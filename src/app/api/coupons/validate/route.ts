import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyCoupon, type CouponInput } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  const { code, subtotal, shipping } = (await req.json()) as {
    code?: string;
    subtotal?: number;
    shipping?: number;
  };
  if (!code) return NextResponse.json({ error: "Enter a code" }, { status: 400 });
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });
  if (!coupon) return NextResponse.json({ error: "Unknown coupon" }, { status: 404 });
  const result = applyCoupon(coupon as CouponInput, subtotal ?? 0, shipping ?? 0);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({
    code: coupon.code,
    discountPaise: result.discountPaise,
    shippingPaise: result.shippingPaise,
  });
}
