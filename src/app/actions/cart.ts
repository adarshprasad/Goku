"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart, hospitalApprovedFor } from "@/lib/cart";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function addToCart(formData: FormData): Promise<void> {
  const productId = String(formData.get("productId") ?? "");
  const variantId = String(formData.get("variantId") ?? "") || null;
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const addons = formData.getAll("addons").map(String).sort();
  const note = String(formData.get("note") ?? "") || null;
  if (!productId) return;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });
  if (!product?.published) return;

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  if (!variant || variant.stock < quantity) {
    return;
  }

  const session = await auth();
  const approved = await hospitalApprovedFor(session?.user?.id);
  if (product.hospitalOnly && !approved) return;
  const minQty = approved ? product.minOrderQty : 1;
  const qty = Math.max(minQty, quantity);
  if (variant.stock < qty) return;

  const cart = await getOrCreateCart();
  const addonsKey = JSON.stringify(addons);
  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variant.id,
      addons: addonsKey,
    },
  });

  if (existing) {
    const nextQty = existing.quantity + qty;
    if (nextQty > variant.stock) return;
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: nextQty, note },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variant.id,
        quantity: qty,
        addons: addonsKey,
        note,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/");
}

export async function updateCartItem(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 0));
  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.id === id);
  if (!item) return;
  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id } });
  } else {
    const stock = item.variant?.stock ?? 0;
    if (quantity > stock) return;
    await prisma.cartItem.update({ where: { id }, data: { quantity } });
  }
  revalidatePath("/cart");
}

export async function toggleWishlist(productId: string) {
  const { cookies } = await import("next/headers");
  const { auth } = await import("@/auth");
  const session = await auth();
  const jar = await cookies();
  let token = jar.get("subbasubbi_wish")?.value;
  if (!token) {
    token = crypto.randomUUID();
    jar.set("subbasubbi_wish", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 180, sameSite: "lax" });
  }

  const existing = session?.user?.id
    ? await prisma.wishlistItem.findFirst({ where: { userId: session.user.id, productId } })
    : await prisma.wishlistItem.findFirst({ where: { token, productId } });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/wishlist");
    return { wished: false };
  }

  await prisma.wishlistItem.create({
    data: { productId, userId: session?.user?.id, token: session?.user?.id ? null : token },
  });
  revalidatePath("/wishlist");
  return { wished: true };
}

export async function buyNow(formData: FormData) {
  await addToCart(formData);
  redirect("/checkout");
}

export async function reorderLast() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/hospital");
  const last = await prisma.order.findFirst({
    where: { userId: session.user.id, paymentStatus: { in: ["PAID", "COD_PENDING"] } },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  if (!last) redirect("/hospital");
  const cart = await getOrCreateCart();
  for (const item of last.items) {
    const variant = item.variantId
      ? await prisma.productVariant.findUnique({ where: { id: item.variantId } })
      : null;
    if (!variant || variant.stock < 1) continue;
    const quantity = Math.min(item.quantity, variant.stock);
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: item.productId, variantId: variant.id, addons: "[]" },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: Math.min(variant.stock, existing.quantity + quantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          variantId: variant.id,
          quantity,
          addons: "[]",
        },
      });
    }
  }
  redirect("/cart");
}
