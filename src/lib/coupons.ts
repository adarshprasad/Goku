export type CouponInput = {
  code: string;
  type: "PERCENT" | "FIXED" | "FREE_SHIP";
  value: number;
  minSubtotal: number;
  maxDiscount: number | null;
  active: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
};

export function applyCoupon(
  coupon: CouponInput | null,
  subtotalPaise: number,
  shippingPaise: number,
  now = new Date(),
): { discountPaise: number; shippingPaise: number; error?: string } {
  if (!coupon) return { discountPaise: 0, shippingPaise };
  if (!coupon.active) return { discountPaise: 0, shippingPaise, error: "This coupon is no longer active." };
  if (coupon.startsAt && now < coupon.startsAt) {
    return { discountPaise: 0, shippingPaise, error: "This coupon is not active yet." };
  }
  if (coupon.endsAt && now > coupon.endsAt) {
    return { discountPaise: 0, shippingPaise, error: "This coupon has expired." };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { discountPaise: 0, shippingPaise, error: "This coupon has reached its usage limit." };
  }
  if (subtotalPaise < coupon.minSubtotal) {
    return {
      discountPaise: 0,
      shippingPaise,
      error: "Cart does not meet the minimum for this coupon.",
    };
  }

  if (coupon.type === "FREE_SHIP") {
    return { discountPaise: 0, shippingPaise: 0 };
  }

  let discount =
    coupon.type === "PERCENT"
      ? Math.round((subtotalPaise * coupon.value) / 100)
      : coupon.value;

  if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotalPaise);
  return { discountPaise: discount, shippingPaise };
}
