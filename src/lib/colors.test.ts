import { describe, expect, it } from "vitest";
import { contrastInk, imagesForVariant, lineWithColor, swatchHex, variantLabel } from "./colors";

describe("color variants", () => {
  it("resolves named saree colours to hex", () => {
    expect(swatchHex("Ruby wine", null)).toBe("#7a1f2b");
    expect(swatchHex("Ivory", "#eee")).toBe("#eeeeee");
  });

  it("picks readable ink on a swatch", () => {
    expect(contrastInk("#f6f1e4")).toBe("#1a241c");
    expect(contrastInk("#284232")).toBe("#f6f1e4");
  });

  it("shows colour photos then shared photos", () => {
    const images = [
      { url: "shared.jpg", variantId: null },
      { url: "ruby.jpg", variantId: "v1" },
      { url: "ivory.jpg", variantId: "v2" },
    ];
    expect(imagesForVariant(images, "v1").map((i) => i.url)).toEqual(["ruby.jpg"]);
    expect(imagesForVariant(images, "missing").map((i) => i.url)).toEqual(["shared.jpg"]);
  });

  it("adds colour to an order line once", () => {
    expect(lineWithColor("Kanchi Flame", "Ruby")).toBe("Kanchi Flame · Ruby");
    expect(lineWithColor("Ruby Banarasi", "Ruby")).toBe("Ruby Banarasi");
    expect(variantLabel({ name: "Default", color: "Forest" })).toBe("Forest");
  });
});
