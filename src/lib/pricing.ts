import { applyCoupon, type CouponInput } from "./coupons";
import { brand } from "./brand";
import { COD_FEE_PAISE, codEligible, gstRateForApparel, shippingForPincode } from "./money";

export type QuoteLine = { unitPaise: number; quantity: number };

export type OrderQuote = {
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  codFeePaise: number;
  totalPaise: number;
  couponError?: string;
  codError?: string;
};

export function quoteCart(params: {
  lines: QuoteLine[];
  pincode: string;
  state: string;
  method: "RAZORPAY" | "COD" | "STRIPE";
  coupon: CouponInput | null;
  country?: string;
}): OrderQuote {
  const subtotalPaise = params.lines.reduce((s, l) => s + l.unitPaise * l.quantity, 0);
  let shippingPaise = shippingForPincode(params.pincode, subtotalPaise);
  const applied = applyCoupon(params.coupon, subtotalPaise, shippingPaise);
  shippingPaise = applied.shippingPaise;
  const discountPaise = applied.discountPaise;
  const subAfter = Math.max(0, subtotalPaise - discountPaise);

  let taxPaise = 0;
  for (const l of params.lines) {
    const share = subtotalPaise === 0 ? 0 : (l.unitPaise * l.quantity) / subtotalPaise;
    const lineTaxable = Math.round(subAfter * share);
    const rate = gstRateForApparel(l.unitPaise);
    taxPaise += Math.round((lineTaxable * rate) / 100);
  }

  const intra = params.state.toUpperCase() === brand.originState.toUpperCase();
  const gst = intra
    ? {
        taxPaise,
        cgstPaise: Math.floor(taxPaise / 2),
        sgstPaise: taxPaise - Math.floor(taxPaise / 2),
        igstPaise: 0,
      }
    : { taxPaise, cgstPaise: 0, sgstPaise: 0, igstPaise: taxPaise };

  let codFeePaise = 0;
  let codError: string | undefined;
  if (params.method === "COD") {
    if ((params.country ?? "IN") !== "IN") {
      codError = "COD is available only in India.";
    } else {
      const gate = codEligible(params.pincode, subAfter + shippingPaise + gst.taxPaise + COD_FEE_PAISE);
      if (!gate.ok) codError = gate.reason;
      else codFeePaise = COD_FEE_PAISE;
    }
  }

  return {
    subtotalPaise,
    discountPaise,
    shippingPaise,
    ...gst,
    codFeePaise,
    totalPaise: subAfter + shippingPaise + gst.taxPaise + (codError ? 0 : codFeePaise),
    couponError: applied.error,
    codError,
  };
}
