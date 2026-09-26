import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { ages, categories } from "@/lib/brand";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

type Search = Promise<{
  audience?: string;
  category?: string;
  age?: string;
  fabric?: string;
  pack?: string;
  q?: string;
  sort?: string;
}>;

function searchTerms(q: string) {
  const raw = q.trim();
  const extra = new Set<string>([raw]);
  const folded = raw.toLowerCase();
  if (folded.includes("hospital")) extra.add("hospital-kit");
  if (folded.includes("langot") || folded.includes("nappy")) extra.add("nappy");
  if (folded.includes("jabla")) extra.add("jabla");
  if (folded.includes("muslin")) extra.add("muslin");
  if (folded.includes("feeding") || folded.includes("gown")) extra.add("feeding");
  if (folded.includes("0-3") || folded.includes("0–3")) extra.add("0–3 months");
  return [...extra];
}

export default async function ShopPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const and: Prisma.ProductWhereInput[] = [{ published: true }];
  if (sp.audience) and.push({ audience: sp.audience });
  if (sp.category) and.push({ category: sp.category });
  if (sp.age) and.push({ ageRange: sp.age });
  if (sp.fabric) and.push({ fabric: sp.fabric });
  if (sp.pack) and.push({ packOf: Number(sp.pack) });
  if (sp.q) {
    const terms = searchTerms(sp.q);
    and.push({
      OR: terms.flatMap((term) => [
        { name: { contains: term } },
        { category: { contains: term } },
        { ageRange: { contains: term } },
        { fabric: { contains: term } },
        { description: { contains: term } },
        { audience: { contains: term } },
      ]),
    });
  }

  const orderBy =
    sp.sort === "price-asc"
      ? { pricePaise: "asc" as const }
      : sp.sort === "price-desc"
        ? { pricePaise: "desc" as const }
        : sp.sort === "popular"
          ? { featured: "desc" as const }
          : { createdAt: "desc" as const };

  let products: Awaited<ReturnType<typeof prisma.product.findMany<{ include: { images: true; variants: true } }>>> = [];
  let fabrics: { fabric: string }[] = [];
  let failed = false;
  try {
    [products, fabrics] = await Promise.all([
      prisma.product.findMany({
        where: { AND: and },
        include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
        orderBy,
      }),
      prisma.product.findMany({ where: { published: true }, select: { fabric: true }, distinct: ["fabric"] }),
    ]);
  } catch {
    failed = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl">Shop sets</h1>
      <p className="mt-2 text-[var(--muted)]">
        {failed ? "The catalog is unavailable right now." : `Showing ${products.length} sets`}
      </p>
      <form className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" action="/shop">
        <label className="text-xs sm:col-span-2 lg:col-span-4">
          Search
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Hospital kit, jabla, muslin, 0–3 months, feeding gown"
            className="mt-1 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3"
          />
        </label>
        <select name="audience" defaultValue={sp.audience ?? ""} className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-2" aria-label="Audience">
          <option value="">Everyone</option>
          <option value="hospital">Hospital</option>
          <option value="mother">Mother</option>
          <option value="baby">Baby</option>
        </select>
        <select name="category" defaultValue={sp.category ?? ""} className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-2" aria-label="Category">
          <option value="">All needs</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select name="age" defaultValue={sp.age ?? ""} className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-2" aria-label="Age">
          <option value="">All ages</option>
          {ages.map((age) => (
            <option key={age}>{age}</option>
          ))}
        </select>
        <select name="fabric" defaultValue={sp.fabric ?? ""} className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-2" aria-label="Fabric">
          <option value="">All fabrics</option>
          {fabrics.map((f) => (
            <option key={f.fabric}>{f.fabric}</option>
          ))}
        </select>
        <select name="pack" defaultValue={sp.pack ?? ""} className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-2" aria-label="Pack size">
          <option value="">Any pack</option>
          <option value="1">Pack of 1</option>
          <option value="3">Pack of 3</option>
          <option value="5">Pack of 5</option>
        </select>
        <select name="sort" defaultValue={sp.sort ?? "new"} className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-2" aria-label="Sort">
          <option value="new">Newest</option>
          <option value="popular">Popularity</option>
          <option value="price-asc">Price · low</option>
          <option value="price-desc">Price · high</option>
        </select>
        <button className="min-h-11 rounded-full bg-[var(--clay)] px-4 text-white">Filter</button>
      </form>
      {products.length === 0 ? (
        <div className="mt-16 rounded-3xl bg-[var(--sand)] px-6 py-12 text-center">
          <p>{failed ? "We could not load products." : "No sets match those filters."}</p>
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
