import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { auth } from "@/auth";

const COOKIE = "huduku_cart";

async function readToken() {
  return (await cookies()).get(COOKIE)?.value;
}

export async function getCartTokenForWrite() {
  const jar = await cookies();
  let token = jar.get(COOKIE)?.value;
  if (!token) {
    token = randomBytes(16).toString("hex");
    jar.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
  }
  return token;
}

export async function getCart() {
  const session = await auth();
  const token = await readToken();
  if (!token && !session?.user?.id) return null;
  if (session?.user?.id) {
    const byUser = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: { include: { product: { include: { images: true } }, variant: true } } },
    });
    if (byUser) return byUser;
  }
  if (!token) return null;
  return prisma.cart.findUnique({
    where: { token },
    include: { items: { include: { product: { include: { images: true } }, variant: true } } },
  });
}

export async function getOrCreateCart() {
  const session = await auth();
  const token = await getCartTokenForWrite();
  let cart = await prisma.cart.findUnique({
    where: { token },
    include: { items: { include: { product: { include: { images: true } }, variant: true } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { token, userId: session?.user?.id },
      include: { items: { include: { product: { include: { images: true } }, variant: true } } },
    });
  } else if (session?.user?.id && cart.userId !== session.user.id) {
    cart = await prisma.cart.update({
      where: { id: cart.id },
      data: { userId: session.user.id },
      include: { items: { include: { product: { include: { images: true } }, variant: true } } },
    });
  }
  return cart;
}

export function parseAddons(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function cartTotals(
  cart: NonNullable<Awaited<ReturnType<typeof getCart>>>,
) {
  const addons = await prisma.addon.findMany();
  const addonMap = new Map(addons.map((a) => [a.slug, a]));
  let subtotal = 0;
  const lines = cart.items.map((item) => {
    const unit = item.variant?.pricePaise ?? item.product.pricePaise;
    const extra = parseAddons(item.addons).reduce(
      (s, slug) => s + (addonMap.get(slug)?.pricePaise ?? 0),
      0,
    );
    const line = (unit + extra) * item.quantity;
    subtotal += line;
    return { item, unit, extra, line };
  });
  return { subtotal, lines, addons };
}
