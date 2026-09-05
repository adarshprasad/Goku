import { describe, expect, it } from "vitest";
import { slugify, normalizeSiteUrl } from "./slug";

describe("slugify", () => {
  it("turns a product name into a url slug", () => {
    expect(slugify("Kanjivaram Temple Border")).toBe("kanjivaram-temple-border");
  });

  it("falls back when empty", () => {
    expect(slugify("   ")).toBe("item");
  });
});

describe("normalizeSiteUrl", () => {
  it("adds https when the scheme is missing", () => {
    expect(normalizeSiteUrl("shop.tavaru.example")).toBe("https://shop.tavaru.example");
  });

  it("strips a trailing slash", () => {
    expect(normalizeSiteUrl("https://atelier.example/")).toBe("https://atelier.example");
  });

  it("keeps localhost on http", () => {
    expect(normalizeSiteUrl("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("accepts the live shop host", () => {
    expect(normalizeSiteUrl("tavaruseere.com")).toBe("https://tavaruseere.com");
    expect(normalizeSiteUrl("https://www.tavaruseere.com/")).toBe("https://www.tavaruseere.com");
  });
});
