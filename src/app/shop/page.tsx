import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";

type Search = Promise<{
  weave?: string;
  fabric?: string;
  occasion?: string;
  color?: string;
  work?: string;
  q?: string;
  sort?: string;
}>;

export default async function ShopPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const where = {
    published: true,
    ...(sp.weave ? { weave: sp.weave } : {}),
    ...(sp.fabric ? { fabric: sp.fabric } : {}),
    ...(sp.occasion ? { occasion: sp.occasion } : {}),
    ...(sp.color ? { color: sp.color } : {}),
    ...(sp.work ? { work: sp.work } : {}),
    ...(sp.q
      ? {
          OR: [
            { name: { contains: sp.q } },
            { weave: { contains: sp.q } },
            { color: { contains: sp.q } },
            { description: { contains: sp.q } },
          ],
        }
      : {}),
  };

  const orderBy =
    sp.sort === "price-asc"
      ? { pricePaise: "asc" as const }
      : sp.sort === "price-desc"
        ? { pricePaise: "desc" as const }
        : { createdAt: "desc" as const };

  const [products, weaves, occasions] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy,
    }),
    prisma.product.findMany({ select: { weave: true }, distinct: ["weave"] }),
    prisma.product.findMany({ select: { occasion: true }, distinct: ["occasion"] }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl">Shop</h1>
      <p className="mt-2 text-[var(--muted)]">Showing {products.length} pieces</p>
      <form className="mt-6 flex flex-wrap gap-3" action="/shop">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Search weaves, colour…"
          className="min-h-11 min-w-[180px] flex-1 border border-[var(--line)] bg-white px-3"
        />
        <select name="weave" defaultValue={sp.weave ?? ""} className="min-h-11 border border-[var(--line)] bg-white px-2">
          <option value="">All weaves</option>
          {weaves.map((w) => (
            <option key={w.weave}>{w.weave}</option>
          ))}
        </select>
        <select name="occasion" defaultValue={sp.occasion ?? ""} className="min-h-11 border border-[var(--line)] bg-white px-2">
          <option value="">All occasions</option>
          {occasions.map((w) => (
            <option key={w.occasion}>{w.occasion}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sp.sort ?? "new"} className="min-h-11 border border-[var(--line)] bg-white px-2">
          <option value="new">Newest</option>
          <option value="price-asc">Price · low</option>
          <option value="price-desc">Price · high</option>
        </select>
        <button className="min-h-11 bg-[var(--maroon)] px-4 text-[var(--ivory)]">Filter</button>
      </form>
      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p>No drapes match. Try linen or Chanderi.</p>
          <Link href="/shop" className="mt-4 inline-block underline">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
