import { describe, expect, it } from "vitest";
import { contrastInk, lineWithColor, swatchHex, variantLabel } from "./colors";

describe("color variants", () => {
  it("resolves named saree colours to hex", () => {
    expect(swatchHex("Ruby wine", null)).toBe("#7a1f2b");
    expect(swatchHex("Ivory", "#eee")).toBe("#eeeeee");
  });

  it("picks readable ink on a swatch", () => {
    expect(contrastInk("#f6f1e4")).toBe("#1a241c");
    expect(contrastInk("#284232")).toBe("#f6f1e4");
  });

  it("adds colour to an order line once", () => {
    expect(lineWithColor("Kanchi Flame", "Ruby")).toBe("Kanchi Flame · Ruby");
    expect(lineWithColor("Ruby Banarasi", "Ruby")).toBe("Ruby Banarasi");
    expect(variantLabel({ name: "Default", color: "Forest" })).toBe("Forest");
  });
});
