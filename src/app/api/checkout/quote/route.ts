import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCart, cartTotals } from "@/lib/cart";
import { quoteCart } from "@/lib/pricing";
import type { CouponInput } from "@/lib/coupons";

const schema = z.object({
  pincode: z.string().regex(/^\d{6}$/).optional(),
  state: z.string().min(2).max(3).optional(),
  coupon: z.string().optional(),
  method: z.enum(["RAZORPAY", "COD", "STRIPE"]).default("RAZORPAY"),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid quote request." }, { status: 400 });

  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Bag is empty." }, { status: 400 });
  }
  const { subtotal, lines } = await cartTotals(cart);

  let couponRow = null;
  if (parsed.data.coupon) {
    couponRow = await prisma.coupon.findUnique({
      where: { code: parsed.data.coupon.trim().toUpperCase() },
    });
  }
  const coupon: CouponInput | null = couponRow
    ? {
        code: couponRow.code,
        type: couponRow.type as CouponInput["type"],
        value: couponRow.value,
        minSubtotal: couponRow.minSubtotal,
        maxDiscount: couponRow.maxDiscount,
        active: couponRow.active,
        startsAt: couponRow.startsAt,
        endsAt: couponRow.endsAt,
        usageLimit: couponRow.usageLimit,
        usedCount: couponRow.usedCount,
      }
    : null;

  const quote = quoteCart({
    lines: lines.map((l) => ({ unitPaise: l.unit + l.extra, quantity: l.item.quantity })),
    pincode: parsed.data.pincode ?? "560001",
    state: parsed.data.state ?? "KA",
    method: parsed.data.method,
    coupon,
    country: "IN",
  });

  return NextResponse.json({
    ...quote,
    bagSubtotalPaise: subtotal,
    couponApplied: coupon && !quote.couponError ? coupon.code : null,
  });
}
