import { applyCoupon } from "./coupons";
import { describe, expect, it } from "vitest";

describe("applyCoupon", () => {
  const base = {
    code: "HUDUKU10",
    type: "PERCENT" as const,
    value: 10,
    minSubtotal: 500_000,
    maxDiscount: 400_000,
    active: true,
    startsAt: null,
    endsAt: null,
    usageLimit: null,
    usedCount: 0,
  };

  it("applies percent with cap", () => {
    const r = applyCoupon(base, 6_000_000, 9900);
    expect(r.discountPaise).toBe(400_000);
    expect(r.error).toBeUndefined();
  });

  it("rejects below minimum", () => {
    const r = applyCoupon(base, 100_000, 9900);
    expect(r.discountPaise).toBe(0);
    expect(r.error).toMatch(/minimum/i);
  });

  it("zeros shipping on FREE_SHIP", () => {
    const r = applyCoupon({ ...base, type: "FREE_SHIP", value: 0, minSubtotal: 0 }, 1000, 9900);
    expect(r.shippingPaise).toBe(0);
  });
});
