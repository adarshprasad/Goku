import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { getBrand } from "@/lib/brand";
import { waLink } from "@/lib/utils";

export default async function HomePage() {
  const [brand, featured, collections, posts, banners] = await Promise.all([
    getBrand(),
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
      <section className="relative min-h-[78vh] bg-[var(--forest)] text-[var(--ivory)]">
        {hero ? (
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
        ) : null}
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 py-20">
          <p className="font-serif text-lg italic text-[var(--ivory)]/80 md:text-xl">{brand.taglineEn}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-6xl leading-[1.05] md:text-8xl">{brand.name}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ivory)]/75 md:text-lg">{brand.heroSubtitle}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/shop" className="inline-flex min-h-12 items-center bg-[var(--ivory)] px-7 text-[var(--forest)]">
              Shop the new weave
            </Link>
            <Link href="/collections/handloom" className="inline-flex min-h-12 items-center border border-[var(--ivory)]/70 px-7">
              Handloom
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Shop by weave</p>
        <div className="mt-8 flex gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="min-w-[220px] shrink-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory-2)]">
                <Image src={c.image} alt="" fill className="object-cover" sizes="33vw" />
              </div>
              <h2 className="mt-4 font-serif text-2xl">{c.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Bestsellers</h2>
          <Link href="/shop" className="text-sm underline decoration-[var(--forest)] underline-offset-4">
            All drapes
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto my-20 grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] bg-[var(--ivory-2)]">
          <Image src={brand.craftImage} alt="" fill className="object-cover" sizes="50vw" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Craft</p>
          <h2 className="mt-3 font-serif text-4xl">{brand.craftTitle}</h2>
          <p className="mt-5 whitespace-pre-line text-[var(--muted)] leading-relaxed">{brand.craftBody}</p>
          <Link href="/about" className="mt-8 inline-flex min-h-11 items-center underline decoration-[var(--forest)] underline-offset-4">
            Meet the atelier
          </Link>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--ivory-2)] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl">Journal</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/journal/${p.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--ivory)]">
                  <Image src={p.image} alt="" fill className="object-cover" sizes="33vw" />
                </div>
                <h3 className="mt-4 font-serif text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-20 md:grid-cols-4">
        {[
          ["Prepaid & UPI", "Razorpay checkout. We never store cards."],
          ["GST invoice", `HSN on every silk. GSTIN ${brand.gstin}.`],
          ["India shipping", brand.shippingIndia],
          ["WhatsApp atelier", "Drape help, measurements, and order care."],
        ].map(([t, d]) => (
          <div key={t} className="border border-[var(--line)] p-6">
            <h3 className="font-serif text-xl">{t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{d}</p>
          </div>
        ))}
      </section>

      <p className="pb-10 text-center text-sm">
        <a href={waLink("I would like a draping appointment.", brand.whatsapp)} className="underline decoration-[var(--forest)] underline-offset-4">
          Book a draping appointment
        </a>
      </p>
    </div>
  );
}
