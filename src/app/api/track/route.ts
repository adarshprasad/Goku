import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { number?: string; email?: string } | null;
  const number = String(body?.number ?? "").trim().toUpperCase();
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!number || !email) {
    return NextResponse.json({ error: "Order number and email are required." }, { status: 400 });
  }
  const order = await prisma.order.findFirst({
    where: { number, email },
    include: { items: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) {
    return NextResponse.json({ error: "No order matches that number and email." }, { status: 404 });
  }
  return NextResponse.json({
    number: order.number,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    totalPaise: order.totalPaise,
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    city: order.shippingCity,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    events: order.events.map((e) => ({ type: e.type, message: e.message, at: e.createdAt })),
  });
}
