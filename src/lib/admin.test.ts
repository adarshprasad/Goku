import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("turns a product name into a url slug", () => {
    expect(slugify("Kanjivaram Temple Border")).toBe("kanjivaram-temple-border");
  });

  it("falls back when empty", () => {
    expect(slugify("   ")).toBe("item");
  });
});
