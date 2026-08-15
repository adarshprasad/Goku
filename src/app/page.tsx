import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { brand } from "@/lib/brand";
import { waLink } from "@/lib/utils";

export default async function HomePage() {
  const [featured, collections, posts, banners] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, published: true },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      take: 8,
    }),
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.journalPost.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.banner.findMany({ where: { active: true }, orderBy: { sort: "asc" } }),
  ]);

  const hero = banners[0];

  return (
    <div>
      <section className="relative min-h-[72vh] bg-[var(--maroon-deep)] text-[var(--ivory)]">
        {hero ? (
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
        ) : null}
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 py-16">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">{brand.taglineKn}</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.1] md:text-7xl">
            {brand.name}
            <span className="mt-3 block font-sans text-lg font-normal tracking-normal text-[var(--ivory)]/80 md:text-xl">
              {brand.taglineEn}. Handloom, temple borders, and finishing — from a Bengaluru atelier.
            </span>
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="inline-flex min-h-12 items-center bg-[var(--ivory)] px-6 text-[var(--maroon)]">
              Shop the new weave
            </Link>
            <Link href="/collections/handloom" className="inline-flex min-h-12 items-center border border-[var(--ivory)] px-6">
              Handloom
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-deep)]">Shop by weave</p>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="min-w-[220px] shrink-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory-2)]">
                <Image src={c.image} alt="" fill className="object-cover" sizes="33vw" />
              </div>
              <h2 className="mt-3 font-serif text-2xl">{c.name}</h2>
              <p className="text-sm text-[var(--muted)]">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Bestsellers</h2>
          <Link href="/shop" className="text-sm underline">
            All drapes
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto my-16 grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] bg-[var(--ivory-2)]">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80"
            alt="Handloom silk being inspected"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-deep)]">Craft</p>
          <h2 className="mt-3 font-serif text-4xl">Named looms, honest gold.</h2>
          <p className="mt-4 text-[var(--muted)] leading-relaxed">
            We buy from GI clusters — Banaras, Kanchipuram, Chanderi, Paithan — and finish fall, pico, and blouse in Bengaluru.
            If a piece is powerloom, the product page says so.
          </p>
          <Link href="/about" className="mt-6 inline-flex min-h-11 items-center underline">
            Meet the atelier
          </Link>
        </div>
      </section>

      <section className="bg-[#f3eadc] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl">Journal</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/journal/${p.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--ivory-2)]">
                  <Image src={p.image} alt="" fill className="object-cover" sizes="33vw" />
                </div>
                <h3 className="mt-3 font-serif text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-4">
        {[
          ["Prepaid & UPI", "Razorpay checkout. We never store cards."],
          ["GST invoice", `HSN on every silk. GSTIN ${brand.gstin}.`],
          ["India shipping", brand.shippingIndia],
          ["WhatsApp atelier", "Drape help, measurements, and order care."],
        ].map(([t, d]) => (
          <div key={t} className="border border-[var(--line)] p-5">
            <h3 className="font-serif text-xl">{t}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{d}</p>
          </div>
        ))}
      </section>

      <p className="pb-8 text-center text-sm">
        <a href={waLink("I would like a draping appointment.")} className="underline">
          Book a draping appointment
        </a>
      </p>
    </div>
  );
}
