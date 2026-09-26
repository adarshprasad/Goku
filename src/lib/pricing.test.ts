import { describe, expect, it } from "vitest";
import { parsePriceBreaks, unitPricePaise } from "./pricing";

const breaks = JSON.stringify([
  { minQty: 10, pricePaise: 74_900 },
  { minQty: 50, pricePaise: 69_900 },
  { minQty: 100, pricePaise: 64_900 },
]);

describe("hospital price breaks", () => {
  it("hides bulk rates from retail shoppers", () => {
    expect(
      unitPricePaise({
        retailPaise: 89_900,
        priceBreaks: breaks,
        quantity: 100,
        hospitalApproved: false,
      }),
    ).toBe(89_900);
  });

  it("picks the highest tier the quantity qualifies for", () => {
    expect(
      unitPricePaise({
        retailPaise: 89_900,
        priceBreaks: breaks,
        quantity: 50,
        hospitalApproved: true,
      }),
    ).toBe(69_900);
    expect(
      unitPricePaise({
        retailPaise: 89_900,
        priceBreaks: breaks,
        quantity: 9,
        hospitalApproved: true,
      }),
    ).toBe(89_900);
  });

  it("ignores malformed breaks", () => {
    expect(parsePriceBreaks("not-json")).toEqual([]);
  });
});
