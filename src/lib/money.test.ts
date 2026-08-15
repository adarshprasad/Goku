import { describe, expect, it } from "vitest";
import { gstRateForApparel, splitGst, codEligible, COD_FEE_PAISE } from "./money";

describe("gst", () => {
  it("uses 5% at or below ₹1000", () => {
    expect(gstRateForApparel(100_000)).toBe(5);
    expect(gstRateForApparel(100_001)).toBe(12);
  });

  it("splits CGST/SGST intra-state", () => {
    const s = splitGst({ taxablePaise: 10_000_00, ratePercent: 5, shipToState: "KA", originState: "KA" });
    expect(s.taxPaise).toBe(50_000);
    expect(s.cgstPaise + s.sgstPaise).toBe(s.taxPaise);
    expect(s.igstPaise).toBe(0);
  });

  it("uses IGST across states", () => {
    const s = splitGst({ taxablePaise: 10_000_00, ratePercent: 5, shipToState: "MH", originState: "KA" });
    expect(s.igstPaise).toBe(50_000);
    expect(s.cgstPaise).toBe(0);
  });
});

describe("cod", () => {
  it("blocks high-risk pincodes", () => {
    expect(codEligible("110001", 500_000).ok).toBe(false);
  });

  it("allows Bengaluru under cap", () => {
    expect(codEligible("560038", 500_000).ok).toBe(true);
    expect(COD_FEE_PAISE).toBe(4900);
  });
});
