import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { decrementStockAndMarkPaid } from "@/lib/orders";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = await req.text();
  if (secret) {
    const sig = req.headers.get("x-razorpay-signature") ?? "";
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (sig !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  const payload = JSON.parse(body) as {
    payload?: { payment?: { entity?: { order_id?: string; id?: string } } };
  };

  const gatewayOrderId = payload.payload?.payment?.entity?.order_id;
  const paymentId = payload.payload?.payment?.entity?.id;
  if (!gatewayOrderId) return NextResponse.json({ ok: true, ignored: true });

  const order = await prisma.order.findFirst({ where: { gatewayOrderId } });
  if (!order) return NextResponse.json({ ok: true, missing: true });

  await decrementStockAndMarkPaid(order.id, paymentId);
  return NextResponse.json({ ok: true });
}
