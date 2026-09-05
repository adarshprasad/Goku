import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/brand";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const url = await getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${url}/sitemap.xml`,
  };
}
