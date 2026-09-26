import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { ages, brand, categories } from "@/lib/brand";

const kitPieces = [
  { name: "Pre-washed jabla", qty: "3" },
  { name: "Muslin nappy", qty: "5" },
  { name: "Swaddle", qty: "2" },
  { name: "Hooded towel", qty: "1" },
];

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof loadFeatured>> = [];
  let reviews: { id: string; authorName: string; title: string; body: string; rating: number }[] = [];
  try {
    [featured, reviews] = await Promise.all([loadFeatured(), loadReviews()]);
  } catch {
    featured = [];
    reviews = [];
  }

  return (
    <div>
      <section className="bg-[var(--clay-deep)] text-[var(--ivory)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--blush)]">{brand.tagline}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">
              Pre-washed sets for hospitals and new mothers
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
              Clothing that is washed, softened, and sealed before it reaches a newborn. One door for maternity wards. One door for the mother taking a set home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop?audience=mother" className="inline-flex min-h-12 items-center rounded-full bg-[var(--ivory)] px-6 text-[var(--ink)]">
                Shop mother & baby sets
              </Link>
              <Link href="/hospital" className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-6">
                Hospital orders
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--sand)]">
            <Image
              src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80"
              alt="Placeholder photo of a newborn — replace with SubbaSubbi photography"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <ul className="mx-auto grid max-w-6xl gap-4 px-4 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {["Pre-washed & sealed", "Hospital-packed sets", "Soft cotton & muslin", "Delivered across India"].map((item) => (
            <li key={item} className="rounded-2xl bg-[var(--sand)] px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 md:grid-cols-2">
        <Link href="/hospital" className="rounded-3xl bg-[var(--sand)] p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--clay)]">For hospitals</p>
          <h2 className="mt-3 font-serif text-3xl">Newborn kits for the ward</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Bulk pricing, GST invoice, and a delivery date for the maternity ward. Reorder last month in one tap.
          </p>
        </Link>
        <Link href="/shop?audience=mother" className="rounded-3xl bg-[var(--blush)] p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--clay-deep)]">For new mothers</p>
          <h2 className="mt-3 font-serif text-3xl">What to pack for the hospital</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/80">
            A mother-and-baby going-home set, first-month clothes, and feeding wear that opens without a fuss.
          </p>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="font-serif text-3xl">Shop by need</h2>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="shrink-0 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-serif text-3xl">Shop by age</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ages.map((age) => (
            <Link key={age} href={`/shop?age=${encodeURIComponent(age)}`} className="rounded-2xl bg-[var(--sand)] px-4 py-6 text-center">
              <span className="font-serif text-xl">{age}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Featured sets</h2>
          <Link href="/shop" className="text-sm underline">
            All sets
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="mt-6 text-[var(--muted)]">Catalog is loading. Seed the database to see sets.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-8 px-4 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">What’s inside a hospital kit</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            A typical first-day set. Exact counts are on each product, and wards can change the mix after approval.
          </p>
          <ul className="mt-6 divide-y divide-[var(--line)]">
            {kitPieces.map((piece) => (
              <li key={piece.name} className="flex justify-between py-3 text-sm">
                <span>{piece.name}</span>
                <span className="text-[var(--muted)]">{piece.qty}</span>
              </li>
            ))}
          </ul>
          <Link href="/hospital-kit" className="mt-4 inline-block text-sm underline">
            Read the full kit
          </Link>
        </div>
        <div className="rounded-3xl bg-[var(--sand)] p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--clay)]">From the founder</p>
          <p className="mt-4 font-serif text-2xl leading-snug">
            Newborn skin should meet cloth that has already been washed. Hospitals needed that as a set, not a pile of loose pieces. Mothers asked for the same set to take home.
          </p>
          <Link href="/about" className="mt-6 inline-block text-sm underline">
            Our story
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl">Loved by parents</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-[var(--muted)]">Reviews appear here after the catalog is seeded.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <blockquote key={r.id} className="rounded-3xl border border-[var(--line)] p-5">
                <p className="font-serif text-xl">{r.title}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{r.body}</p>
                <footer className="mt-3 text-xs uppercase tracking-widest">
                  {r.authorName} · {r.rating}/5
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

async function loadFeatured() {
  return prisma.product.findMany({
    where: { featured: true, published: true, hospitalOnly: false },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
    take: 8,
  });
}

async function loadReviews() {
  return prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}
