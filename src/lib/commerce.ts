/** India apparel commerce rules. Amounts are paise. */
export const commerce = {
  originState: "KA",
  gstLowPercent: 5,
  gstHighPercent: 12,
  /** 5% GST when the unit price is at or below this. */
  gstThresholdPaise: 100_000,
  freeShippingSubtotalPaise: 800_000,
  localShippingPaise: 4_900,
  nationalShippingPaise: 9_900,
  invalidPincodeShippingPaise: 14_900,
  localPincodePrefixMin: 56,
  localPincodePrefixMax: 59,
  codFeePaise: 4_900,
  codMaxPaise: 2_500_000,
  codBlockedPincodes: ["110001", "400001", "999999"] as const,
  hsn: "6111",
} as const;
