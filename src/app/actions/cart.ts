"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";

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
    const nextQty = existing.quantity + quantity;
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
        quantity,
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
  let token = jar.get("huduku_wish")?.value;
  if (!token) {
    token = crypto.randomUUID();
    jar.set("huduku_wish", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 180, sameSite: "lax" });
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
