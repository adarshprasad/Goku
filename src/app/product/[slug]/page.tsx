import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addToCart, toggleWishlist } from "@/app/actions/cart";
import { formatInr, discountPercent, waLink } from "@/lib/utils";
import { PincodeCheck } from "@/components/pincode-check";
import { ProductCard } from "@/components/product-card";
import { getBrand, siteUrl } from "@/lib/brand";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p) return {};
  return { title: p.name, description: p.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      reviews: { where: { published: true }, orderBy: { createdAt: "desc" } },
      pairWith: { include: { paired: { include: { images: true } } } },
    },
  });
  if (!product) notFound();
  const [addons, brand] = await Promise.all([prisma.addon.findMany(), getBrand()]);
  const stock = product.variants.reduce((s, v) => s + v.stock, 0);
  const off = discountPercent(product.pricePaise, product.mrpPaise);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: brand.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.pricePaise / 100).toFixed(2),
      availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          {product.images.map((img) => (
            <div key={img.id} className="relative aspect-[3/4] overflow-hidden bg-[var(--ivory-2)]">
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="50vw" />
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{product.weave}</p>
          <h1 className="mt-2 font-serif text-4xl">{product.name}</h1>
          <p className="mt-4 text-xl">
            {formatInr(product.pricePaise)}
            {off > 0 ? <span className="ml-2 text-base text-[var(--muted)] line-through">{formatInr(product.mrpPaise)}</span> : null}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">EMI available on Razorpay for eligible cards.</p>
          <p className="mt-3 text-sm">
            {stock > 0 ? `${stock} in atelier` : "Made to order"}
            {stock > 0 && stock <= 3 ? " · low stock" : ""}
          </p>
          {product.modelHeightCm ? (
            <p className="mt-1 text-sm text-[var(--muted)]">
              Model {product.modelHeightCm} cm · blouse {product.modelBlouseSize}
            </p>
          ) : null}

          <form action={addToCart} className="mt-8 space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            {product.variants.length > 1 ? (
              <label className="block text-sm">
                Size
                <select name="variantId" className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-2">
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} · {v.stock} left
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <input type="hidden" name="variantId" value={product.variants[0]?.id ?? ""} />
            )}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest text-[var(--muted)]">Atelier services</legend>
              {addons.map((a) => (
                <label key={a.id} className="mt-2 flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" name="addons" value={a.slug} />
                  {a.name} · {formatInr(a.pricePaise)}
                </label>
              ))}
            </fieldset>
            <label className="block text-sm">
              Note
              <input name="note" placeholder="Blouse measurements, gift wrap name…" className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
            </label>
            <div className="flex flex-wrap gap-3">
              <button className="min-h-12 flex-1 bg-[var(--maroon)] px-6 text-[var(--ivory)]" disabled={stock < 1 && !product.madeToOrder}>
                Add to bag
              </button>
              <WishButton productId={product.id} />
            </div>
          </form>

          <a
            href={waLink(`I need help draping ${product.name}`, brand.whatsapp)}
            className="mt-4 inline-block text-sm underline"
          >
            Need help draping?
          </a>
          <PincodeCheck subtotalPaise={product.pricePaise} />

          <details className="mt-8 border-t border-[var(--line)] pt-4" open>
            <summary className="cursor-pointer font-serif text-xl">The drape</summary>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">{product.description}</p>
          </details>
          <details className="mt-3 border-t border-[var(--line)] pt-4">
            <summary className="cursor-pointer font-serif text-xl">Craft</summary>
            <p className="mt-3 text-[var(--muted)]">{product.craftStory}</p>
            {product.artisanNote ? <p className="mt-2 text-sm">{product.artisanNote}</p> : null}
            {product.giTag ? <p className="mt-2 text-sm">GI: {product.giTag}</p> : null}
          </details>
          <details className="mt-3 border-t border-[var(--line)] pt-4">
            <summary className="cursor-pointer font-serif text-xl">Details & care</summary>
            <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
              <li>Fabric · {product.fabric}</li>
              <li>Work · {product.work}</li>
              <li>Occasion · {product.occasion}</li>
              <li>Length · {product.lengthMeters} m {product.blousePiece ? `· blouse piece ${product.blouseLengthM} m` : ""}</li>
              <li>Weight · {product.weightFeel}</li>
              <li>Pallu · {product.pallu}</li>
              <li>Care · {product.care}</li>
              <li>HSN · {product.hsn}</li>
            </ul>
          </details>
          <details className="mt-3 border-t border-[var(--line)] pt-4">
            <summary className="cursor-pointer font-serif text-xl">Shipping & stitching</summary>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {brand.shippingIndia}. Fall & pico and blouse stitching add 4–7 days. Stitched / custom pieces cannot be returned.
            </p>
          </details>
        </div>
      </div>

      {product.pairWith.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Complete the look</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.pairWith.map((rel) => (
              <ProductCard key={rel.id} product={rel.paired} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Reviews</h2>
        <div className="mt-6 space-y-6">
          {product.reviews.length === 0 ? <p className="text-[var(--muted)]">Be the first to review after your order.</p> : null}
          {product.reviews.map((r) => (
            <blockquote key={r.id} className="border-l-2 border-[var(--gold)] pl-4">
              <p className="font-serif text-xl">{r.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{r.body}</p>
              <footer className="mt-2 text-xs uppercase tracking-widest">
                {r.authorName} · {r.rating}/5 {r.verified ? "· verified" : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}

function WishButton({ productId }: { productId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await toggleWishlist(productId);
      }}
    >
      <button type="submit" className="min-h-12 border border-[var(--maroon)] px-5">
        Wishlist
      </button>
    </form>
  );
}
