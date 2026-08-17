"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin";
import { filesFromForm, rupeesToPaise, slugify } from "@/lib/slug";
import { saveUploads } from "@/lib/uploads";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base);
  let n = 2;
  while (true) {
    const found = await prisma.product.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${slugify(base)}-${n++}`;
  }
}

async function uniqueSku(raw: string) {
  let sku = raw.trim().toUpperCase() || `TAV-${Date.now()}`;
  let n = 2;
  while (await prisma.product.findUnique({ where: { sku } })) {
    sku = `${raw.trim().toUpperCase() || "TAV"}-${n++}`;
  }
  return sku;
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
    color: String(formData.get("color") || ""),
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

  const stock = Number(formData.get("stock") || 0);

  if (id) {
    await prisma.product.update({ where: { id }, data });
    await prisma.collectionProduct.deleteMany({ where: { productId: id } });
    if (collectionIds.length) {
      await prisma.collectionProduct.createMany({
        data: collectionIds.map((collectionId) => ({ collectionId, productId: id })),
      });
    }
    const variantId = String(formData.get("variantId") || "");
    if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock },
      });
    }
    const maxSort = await prisma.productImage.aggregate({ where: { productId: id }, _max: { sortOrder: true } });
    let sort = (maxSort._max.sortOrder ?? -1) + 1;
    for (const url of urls) {
      await prisma.productImage.create({
        data: { productId: id, url, alt: name, sortOrder: sort++ },
      });
    }
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
      variants: {
        create: { name: "Default", sku: `${sku}-DEF`, stock },
      },
      images: {
        create: urls.map((url, i) => ({ url, alt: name, sortOrder: i })),
      },
      collections: collectionIds.length
        ? { create: collectionIds.map((collectionId) => ({ collectionId })) }
        : undefined,
    },
  });
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
