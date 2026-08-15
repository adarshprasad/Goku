import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { decrementStockAndMarkPaid } from "@/lib/orders";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.gateway !== "MOCK") {
    return NextResponse.json({ error: "Not a mock order" }, { status: 400 });
  }
  await decrementStockAndMarkPaid(order.id, `mock_${Date.now()}`);
  if (order.userId) {
    const cart = await prisma.cart.findFirst({ where: { userId: order.userId } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  return NextResponse.json({
    ok: true,
    redirect: `/checkout/success?order=${order.number}`,
  });
}
