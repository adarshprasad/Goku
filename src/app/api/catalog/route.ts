import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hospitalApprovedFor } from "@/lib/cart";
import { parseContents, parsePriceBreaks } from "@/lib/pricing";

/** Public catalog for a future app. Bulk rates are included only for an approved hospital session. */
export async function GET() {
  const session = await auth();
  const approved = await hospitalApprovedFor(session?.user?.id);
  const products = await prisma.product.findMany({
    where: { published: true },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    products: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      audience: product.audience,
      category: product.category,
      ageRange: product.ageRange,
      fabric: product.fabric,
      packOf: product.packOf,
      preWashed: product.preWashed,
      hospitalOnly: product.hospitalOnly,
      minOrderQty: approved ? product.minOrderQty : 1,
      contents: parseContents(product.contents),
      pricePaise: product.hospitalOnly && !approved ? null : product.pricePaise,
      mrpPaise: product.hospitalOnly && !approved ? null : product.mrpPaise,
      priceBreaks: approved ? parsePriceBreaks(product.priceBreaks) : [],
      inStock: product.variants.some((variant) => variant.stock > 0),
      images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
    })),
  });
}
