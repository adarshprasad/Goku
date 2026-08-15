import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true } }),
    prisma.journalPost.findMany({ select: { slug: true, publishedAt: true } }),
  ]);
  const staticPaths = ["", "/shop", "/about", "/journal", "/support"].map((p) => ({
    url: `${siteUrl}${p || "/"}`,
    lastModified: new Date(),
  }));
  return [
    ...staticPaths,
    ...products.map((p) => ({ url: `${siteUrl}/product/${p.slug}`, lastModified: p.updatedAt })),
    ...collections.map((c) => ({ url: `${siteUrl}/collections/${c.slug}`, lastModified: new Date() })),
    ...posts.map((p) => ({ url: `${siteUrl}/journal/${p.slug}`, lastModified: p.publishedAt })),
  ];
}
