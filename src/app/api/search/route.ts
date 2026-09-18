import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ products: [], collections: [] });

  const [products, collections] = await Promise.all([
    prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q } },
          { weave: { contains: q } },
          { color: { contains: q } },
          { fabric: { contains: q } },
          { occasion: { contains: q } },
          { sku: { contains: q } },
          { work: { contains: q } },
        ],
      },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      take: 8,
    }),
    prisma.collection.findMany({
      where: {
        OR: [{ name: { contains: q } }, { slug: { contains: q } }],
      },
      take: 4,
    }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      weave: p.weave,
      color: p.color,
      pricePaise: p.pricePaise,
      image: p.images[0]?.url ?? null,
    })),
    collections: collections.map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline })),
  });
}
