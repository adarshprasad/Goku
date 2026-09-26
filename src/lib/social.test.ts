import { describe, expect, it } from "vitest";
import { socialLinks } from "./social";

describe("social links", () => {
  it("hides empty profiles", () => {
    const brand = {
      instagram: "https://instagram.com/tavaruseere",
      facebook: "",
      youtube: "https://youtube.com/@tavaru",
      pinterest: "",
      twitter: "",
      linkedin: "",
      whatsappChannel: "",
      googleBusiness: "",
    } as never;
    const labels = socialLinks(brand).map((s) => s.label);
    expect(labels).toContain("Instagram");
    expect(labels).toContain("YouTube");
    expect(labels).not.toContain("Facebook");
  });
});
