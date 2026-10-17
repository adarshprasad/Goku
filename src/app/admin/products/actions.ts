"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin";
import { filesFromForm, rupeesToPaise, slugify } from "@/lib/slug";
import { saveUploads } from "@/lib/uploads";
import { swatchHex } from "@/lib/colors";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base);
  let n = 2;
  while (true) {
    const found = await prisma.product.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${slugify(base)}-${n++}`;
  }
}

async function uniqueSku(raw: string, excludeId?: string) {
  let sku = raw.trim().toUpperCase() || `TAV-${Date.now()}`;
  let n = 2;
  while (true) {
    const found = await prisma.product.findUnique({ where: { sku } });
    if (!found || found.id === excludeId) return sku;
    sku = `${raw.trim().toUpperCase() || "TAV"}-${n++}`;
  }
}

async function uniqueVariantSku(raw: string, excludeId?: string) {
  const base = raw.trim().toUpperCase().replace(/\s+/g, "-") || `TAV-${Date.now()}`;
  let sku = base;
  let n = 2;
  while (true) {
    const found = await prisma.productVariant.findUnique({ where: { sku } });
    if (!found || found.id === excludeId) return sku;
    sku = `${base}-${n++}`;
  }
}

async function attachVariantPhotos(productId: string, name: string, variantIds: { id: string }[], formData: FormData) {
  const maxSort = await prisma.productImage.aggregate({ where: { productId }, _max: { sortOrder: true } });
  let sort = (maxSort._max.sortOrder ?? -1) + 1;
  for (let i = 0; i < variantIds.length; i++) {
    const urls = await saveUploads(filesFromForm(formData, `variantPhotos_${i}`));
    for (const url of urls) {
      await prisma.productImage.create({
        data: { productId, variantId: variantIds[i].id, url, alt: name, sortOrder: sort++ },
      });
    }
  }
  const existing = await prisma.productImage.findMany({ where: { productId } });
  const valid = new Set(variantIds.map((v) => v.id));
  for (const img of existing) {
    const raw = formData.get(`imageVariant_${img.id}`);
    if (typeof raw !== "string") continue;
    const variantId = raw && valid.has(raw) ? raw : null;
    if (img.variantId !== variantId) {
      await prisma.productImage.update({ where: { id: img.id }, data: { variantId } });
    }
  }
}

async function syncColorVariants(productId: string, skuBase: string, formData: FormData) {
  const ids = formData.getAll("variantId").map(String);
  const colors = formData.getAll("variantColor").map(String);
  const hexes = formData.getAll("variantHex").map(String);
  const skus = formData.getAll("variantSku").map(String);
  const stocks = formData.getAll("variantStock").map(String);
  const existing = await prisma.productVariant.findMany({ where: { productId } });
  const keep = new Set<string>();
  const count = Math.max(ids.length, colors.length);

  for (let i = 0; i < count; i++) {
    const color = (colors[i] || "").trim() || "Default";
    const hex = swatchHex(color, hexes[i]);
    const stock = Math.max(0, Math.floor(Number(stocks[i] || 0)));
    const id = ids[i] || "";
    const skuHint = (skus[i] || "").trim() || `${skuBase}-${slugify(color).slice(0, 10) || i + 1}`;
    if (id && existing.some((e) => e.id === id)) {
      await prisma.productVariant.update({
        where: { id },
        data: {
          name: color,
          color,
          hex,
          stock,
          sku: await uniqueVariantSku(skuHint, id),
          sortOrder: i,
        },
      });
      keep.add(id);
    } else {
      const created = await prisma.productVariant.create({
        data: {
          productId,
          name: color,
          color,
          hex,
          stock,
          sku: await uniqueVariantSku(skuHint),
          sortOrder: i,
        },
      });
      keep.add(created.id);
    }
  }

  for (const v of existing) {
    if (keep.has(v.id)) continue;
    const sold = await prisma.orderItem.count({ where: { variantId: v.id } });
    if (sold) {
      await prisma.productVariant.update({ where: { id: v.id }, data: { stock: 0 } });
    } else {
      await prisma.cartItem.deleteMany({ where: { variantId: v.id } });
      await prisma.productVariant.delete({ where: { id: v.id } });
    }
  }

  if ((await prisma.productVariant.count({ where: { productId } })) === 0) {
    await prisma.productVariant.create({
      data: {
        productId,
        name: "Default",
        color: "Default",
        hex: "#284232",
        sku: await uniqueVariantSku(`${skuBase}-DEF`),
        stock: 0,
      },
    });
  }

  const [first, sum] = await Promise.all([
    prisma.productVariant.findFirst({ where: { productId }, orderBy: { sortOrder: "asc" } }),
    prisma.productVariant.aggregate({ where: { productId }, _sum: { stock: true } }),
  ]);
  await prisma.product.update({
    where: { id: productId },
    data: {
      color: first?.color || first?.name || "",
      inStock: (sum._sum.stock ?? 0) > 0,
    },
  });

  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
}

export async function saveProduct(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name is required.");
  const slug = await uniqueSlug(String(formData.get("slug") || name), id || undefined);
  const pricePaise = rupeesToPaise(formData.get("price"));
  const mrpPaise = rupeesToPaise(formData.get("mrp")) || pricePaise;
  const collectionIds = formData.getAll("collectionId").map(String).filter(Boolean);
  const photos = filesFromForm(formData, "photos");
  const urls = await saveUploads(photos);

  const data = {
    name,
    slug,
    type: String(formData.get("type") || "Saree"),
    description: String(formData.get("description") || ""),
    craftStory: String(formData.get("craftStory") || ""),
    artisanNote: String(formData.get("artisanNote") || "") || null,
    giTag: String(formData.get("giTag") || "") || null,
    pricePaise,
    mrpPaise,
    hsn: String(formData.get("hsn") || "6211"),
    weave: String(formData.get("weave") || ""),
    fabric: String(formData.get("fabric") || ""),
    work: String(formData.get("work") || "None"),
    occasion: String(formData.get("occasion") || "Festive"),
    color: String(formData.get("variantColor") || formData.get("color") || ""),
    motif: String(formData.get("motif") || "") || null,
    border: String(formData.get("border") || "") || null,
    pallu: String(formData.get("pallu") || "") || null,
    lengthMeters: Number(formData.get("lengthMeters") || 5.5),
    blousePiece: formData.get("blousePiece") === "on",
    weightFeel: String(formData.get("weightFeel") || "Medium"),
    care: String(formData.get("care") || "Dry clean"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    madeToOrder: formData.get("madeToOrder") === "on",
    inStock: formData.get("inStock") !== "off",
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
    await prisma.collectionProduct.deleteMany({ where: { productId: id } });
    if (collectionIds.length) {
      await prisma.collectionProduct.createMany({
        data: collectionIds.map((collectionId) => ({ collectionId, productId: id })),
      });
    }
    const skuBase = String(formData.get("sku") || data.color || "TAV");
    const variantIds = await syncColorVariants(id, skuBase, formData);
    const maxSort = await prisma.productImage.aggregate({ where: { productId: id }, _max: { sortOrder: true } });
    let sort = (maxSort._max.sortOrder ?? -1) + 1;
    for (const url of urls) {
      await prisma.productImage.create({
        data: { productId: id, url, alt: name, sortOrder: sort++ },
      });
    }
    await attachVariantPhotos(id, name, variantIds, formData);
    revalidatePath("/shop");
    revalidatePath(`/product/${slug}`);
    revalidatePath("/admin/products");
    redirect(`/admin/products/${id}`);
  }

  const sku = await uniqueSku(String(formData.get("sku") || `TAV-${Date.now()}`));
  const created = await prisma.product.create({
    data: {
      ...data,
      sku,
      images: {
        create: urls.map((url, i) => ({ url, alt: name, sortOrder: i })),
      },
      collections: collectionIds.length
        ? { create: collectionIds.map((collectionId) => ({ collectionId })) }
        : undefined,
    },
  });
  const variantIds = await syncColorVariants(created.id, sku, formData);
  await attachVariantPhotos(created.id, name, variantIds, formData);
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${created.id}`);
}

export async function deleteProductImage(formData: FormData) {
  await requireStaff();
  const imageId = String(formData.get("imageId"));
  const productId = String(formData.get("productId"));
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteProduct(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id"));
  const sold = await prisma.orderItem.count({ where: { productId: id } });
  if (sold) {
    await prisma.product.update({ where: { id }, data: { published: false } });
  } else {
    await prisma.wishlistItem.deleteMany({ where: { productId: id } });
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
