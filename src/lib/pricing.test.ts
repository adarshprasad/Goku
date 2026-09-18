import { describe, expect, it } from "vitest";
import { quoteCart } from "./pricing";

describe("quoteCart", () => {
  it("applies KA shipping, GST split, and COD fee", () => {
    const q = quoteCart({
      lines: [{ unitPaise: 5_000_00, quantity: 1 }],
      pincode: "560001",
      state: "KA",
      method: "COD",
      coupon: null,
    });
    expect(q.shippingPaise).toBe(4_900);
    expect(q.taxPaise).toBeGreaterThan(0);
    expect(q.cgstPaise + q.sgstPaise).toBe(q.taxPaise);
    expect(q.igstPaise).toBe(0);
    expect(q.codFeePaise).toBe(4_900);
    expect(q.totalPaise).toBe(q.subtotalPaise + q.shippingPaise + q.taxPaise + q.codFeePaise);
  });

  it("uses IGST for other states and blocks COD on demo pincodes", () => {
    const q = quoteCart({
      lines: [{ unitPaise: 5_000_00, quantity: 1 }],
      pincode: "110001",
      state: "DL",
      method: "COD",
      coupon: null,
    });
    expect(q.igstPaise).toBe(q.taxPaise);
    expect(q.codError).toBeTruthy();
    expect(q.codFeePaise).toBe(0);
  });
});
