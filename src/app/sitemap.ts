import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [url, products, collections, posts] = await Promise.all([
    getSiteUrl(),
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true } }),
    prisma.journalPost.findMany({ select: { slug: true, publishedAt: true } }),
  ]);
  const staticPaths = ["", "/shop", "/about", "/journal", "/support"].map((p) => ({
    url: `${url}${p || "/"}`,
    lastModified: new Date(),
  }));
  return [
    ...staticPaths,
    ...products.map((p) => ({ url: `${url}/product/${p.slug}`, lastModified: p.updatedAt })),
    ...collections.map((c) => ({ url: `${url}/collections/${c.slug}`, lastModified: new Date() })),
    ...posts.map((p) => ({ url: `${url}/journal/${p.slug}`, lastModified: p.publishedAt })),
  ];
}
