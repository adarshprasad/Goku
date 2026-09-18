import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const take = Math.min(60, Number(req.nextUrl.searchParams.get("take") ?? 24) || 24);
  const cursor = req.nextUrl.searchParams.get("cursor");
  const weave = req.nextUrl.searchParams.get("weave") ?? undefined;

  const products = await prisma.product.findMany({
    where: { published: true, ...(weave ? { weave } : {}) },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: true },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      weave: p.weave,
      fabric: p.fabric,
      color: p.color,
      occasion: p.occasion,
      pricePaise: p.pricePaise,
      mrpPaise: p.mrpPaise,
      image: p.images[0]?.url ?? null,
      stock: p.variants.reduce((s, v) => s + v.stock, 0),
    })),
    nextCursor: products.at(-1)?.id ?? null,
  });
}
