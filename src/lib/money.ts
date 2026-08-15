/** GST on apparel: 5% if sale value ≤ ₹1000, else 12%. Amounts in paise. */
export function gstRateForApparel(unitPaise: number): 5 | 12 {
  return unitPaise <= 100_000 ? 5 : 12;
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
  const origin = params.originState ?? "KA";
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
  if (subtotalPaise >= 8_000_00) return 0;
  if (!/^\d{6}$/.test(pincode)) return 14_900;
  const zone = Number(pincode.slice(0, 2));
  if (zone >= 56 && zone <= 59) return 4_900;
  return 9_900;
}

export const COD_FEE_PAISE = 4_900;
export const COD_MAX_PAISE = 25_000_00;

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
  const blocked = new Set(["110001", "400001", "999999"]);
  if (blocked.has(pincode)) {
    return { ok: false, reason: "COD is not available for this pincode." };
  }
  return { ok: true };
}
