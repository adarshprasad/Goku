import { describe, expect, it } from "vitest";
import { buildWhatsAppProductText, whatsappDigits } from "./whatsapp-order";

describe("whatsapp order text", () => {
  it("strips phone formatting", () => {
    expect(whatsappDigits("+91 80 4567 2100")).toBe("918045672100");
    expect(whatsappDigits("9686726381")).toBe("919686726381");
    expect(whatsappDigits("+91 96867 26381")).toBe("919686726381");
    expect(whatsappDigits("919686726381")).toBe("919686726381");
  });

  it("includes product name and pay on WhatsApp", () => {
    const t = buildWhatsAppProductText({
      brandName: "Tavaru",
      name: "Kanjivaram",
      pricePaise: 12_000_00,
      url: "https://tavaruseere.com/product/x",
    });
    expect(t).toMatch(/Kanjivaram/);
    expect(t).toMatch(/WhatsApp/);
  });
});
