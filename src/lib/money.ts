import { commerce } from "./commerce";

/** GST on apparel: 5% if sale value ≤ ₹1000, else 12%. Amounts in paise. */
export function gstRateForApparel(unitPaise: number): 5 | 12 {
  return unitPaise <= commerce.gstThresholdPaise ? commerce.gstLowPercent : commerce.gstHighPercent;
}

export type TaxSplit = {
  taxPaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
};

export function splitGst(params: {
  taxablePaise: number;
  ratePercent: number;
  shipToState: string;
  originState?: string;
}): TaxSplit {
  const origin = params.originState ?? commerce.originState;
  const taxPaise = Math.round((params.taxablePaise * params.ratePercent) / 100);
  const intra = params.shipToState.toUpperCase() === origin.toUpperCase();
  if (intra) {
    const half = Math.floor(taxPaise / 2);
    return {
      taxPaise,
      cgstPaise: half,
      sgstPaise: taxPaise - half,
      igstPaise: 0,
    };
  }
  return { taxPaise, cgstPaise: 0, sgstPaise: 0, igstPaise: taxPaise };
}

export function shippingForPincode(pincode: string, subtotalPaise: number): number {
  if (subtotalPaise >= commerce.freeShippingSubtotalPaise) return 0;
  if (!/^\d{6}$/.test(pincode)) return commerce.invalidPincodeShippingPaise;
  const zone = Number(pincode.slice(0, 2));
  if (zone >= commerce.localPincodePrefixMin && zone <= commerce.localPincodePrefixMax) {
    return commerce.localShippingPaise;
  }
  return commerce.nationalShippingPaise;
}

export const COD_FEE_PAISE = commerce.codFeePaise;
export const COD_MAX_PAISE = commerce.codMaxPaise;

export function codEligible(pincode: string, totalPaise: number): {
  ok: boolean;
  reason?: string;
} {
  if (!/^\d{6}$/.test(pincode)) {
    return { ok: false, reason: "Enter a valid 6-digit Indian pincode for COD." };
  }
  if (totalPaise > COD_MAX_PAISE) {
    return { ok: false, reason: "COD is available on orders up to ₹25,000." };
  }
  const blocked = new Set<string>(commerce.codBlockedPincodes);
  if (blocked.has(pincode)) {
    return { ok: false, reason: "COD is not available for this pincode." };
  }
  return { ok: true };
}
