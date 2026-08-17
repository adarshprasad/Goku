import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { variants: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">Catalog</h1>
        <Link href="/admin/products/new" className="inline-flex min-h-11 items-center bg-[var(--forest)] px-5 text-[var(--ivory)]">
          Add a drape
        </Link>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">Edit names, photos, price, and stock. New photos upload from each product page.</p>
      <div className="mt-8 divide-y divide-[var(--line)] border border-[var(--line)]">
        {products.map((p) => (
          <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center gap-4 p-4 hover:bg-[var(--ivory-2)]">
            <div className="h-16 w-12 shrink-0 bg-[var(--ivory-2)]">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0].url} alt="" className="h-16 w-12 object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg">{p.name}</p>
              <p className="text-xs text-[var(--muted)]">
                {p.sku} · {p.published ? "Live" : "Hidden"} · stock {p.variants[0]?.stock ?? 0}
              </p>
            </div>
            <p className="text-sm">{formatInr(p.pricePaise)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
