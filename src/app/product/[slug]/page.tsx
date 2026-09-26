import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addToCart, buyNow, toggleWishlist } from "@/app/actions/cart";
import { formatInr, discountPercent, waLink } from "@/lib/utils";
import { PincodeCheck } from "@/components/pincode-check";
import { ProductCard } from "@/components/product-card";
import { Gallery } from "@/components/gallery";
import { brand, categories, siteUrl } from "@/lib/brand";
import { auth } from "@/auth";
import { hospitalApprovedFor } from "@/lib/cart";
import { parseContents, parsePriceBreaks } from "@/lib/pricing";
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
      pairWith: { include: { paired: { include: { images: true, variants: true } } } },
    },
  });
  if (!product || !product.published) notFound();

  const session = await auth();
  const approved = await hospitalApprovedFor(session?.user?.id);
  const stock = product.variants.reduce((s, v) => s + v.stock, 0);
  const off = product.hospitalOnly && !approved ? 0 : discountPercent(product.pricePaise, product.mrpPaise);
  const pieces = parseContents(product.contents);
  const breaks = approved ? parsePriceBreaks(product.priceBreaks) : [];
  const label = categories.find((c) => c.slug === product.category)?.label ?? product.category;
  const showPrice = !product.hospitalOnly || approved;

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
      ...(showPrice ? { price: (product.pricePaise / 100).toFixed(2) } : {}),
      availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 md:grid-cols-2">
        <Gallery images={product.images} />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--clay)]">{label}</p>
          <h1 className="mt-2 font-serif text-4xl">{product.name}</h1>
          {product.preWashed ? (
            <p className="mt-3 inline-flex rounded-full bg-[var(--sand)] px-3 py-1 text-sm">
              Pre-washed, softened, and sealed for newborn skin
            </p>
          ) : null}
          {showPrice ? (
            <p className="mt-4 text-xl">
              {formatInr(product.pricePaise)}
              {off > 0 ? (
                <span className="ml-2 text-base text-[var(--muted)] line-through">{formatInr(product.mrpPaise)}</span>
              ) : null}
            </p>
          ) : (
            <p className="mt-4 text-lg">Hospital pricing is shown after your account is approved.</p>
          )}
          <p className="mt-3 text-sm">
            {stock > 0 ? `${stock} ready to pack` : "Out of stock"}
            {stock > 0 && stock <= 3 ? " · low stock" : ""}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {product.ageRange} · {product.fabric} · Pack of {product.packOf}
          </p>

          {breaks.length > 0 ? (
            <table className="mt-4 w-full text-sm">
              <caption className="mb-2 text-left text-xs uppercase tracking-widest text-[var(--clay)]">
                Your hospital rates
              </caption>
              <tbody>
                {breaks.map((b) => (
                  <tr key={b.minQty} className="border-t border-[var(--line)]">
                    <td className="py-2">{b.minQty}+ sets</td>
                    <td className="py-2 text-right">{formatInr(b.pricePaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {product.hospitalOnly && !approved ? (
            <Link href="/hospital" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--clay)] px-6 text-white">
              Request a hospital account
            </Link>
          ) : (
            <form action={addToCart} className="mt-8 space-y-4">
              <input type="hidden" name="productId" value={product.id} />
              {product.variants.length > 1 ? (
                <label className="block text-sm">
                  Size or pack
                  <select name="variantId" className="mt-1 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-2">
                    {product.variants.map((v) => (
                      <option key={v.id} value={v.id} disabled={v.stock < 1}>
                        {v.name}
                        {v.stock < 1 ? " · out of stock" : ` · ${v.stock} left`}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <input type="hidden" name="variantId" value={product.variants[0]?.id ?? ""} />
              )}
              <label className="block text-sm">
                Quantity
                <input
                  name="quantity"
                  type="number"
                  min={approved ? product.minOrderQty : 1}
                  defaultValue={approved ? product.minOrderQty : 1}
                  className="mt-1 min-h-11 w-28 rounded-xl border border-[var(--line)] bg-white px-3"
                />
              </label>
              {approved && product.minOrderQty > 1 ? (
                <p className="text-xs text-[var(--muted)]">Minimum hospital order: {product.minOrderQty} sets.</p>
              ) : null}
              <label className="block text-sm">
                Note for packing
                <input name="note" placeholder="Ward name, gift tag, colour preference" className="mt-1 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3" />
              </label>
              <div className="flex flex-wrap gap-3">
                <button className="min-h-12 flex-1 rounded-full bg-[var(--clay)] px-6 text-white" disabled={stock < 1}>
                  Add to bag
                </button>
                <button formAction={buyNow} className="min-h-12 rounded-full border border-[var(--clay)] px-5" disabled={stock < 1}>
                  Buy now
                </button>
                <WishButton productId={product.id} />
              </div>
            </form>
          )}

          <div className="sticky bottom-16 z-30 mt-4 flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--ivory)]/95 p-3 backdrop-blur md:static md:border-0 md:bg-transparent md:p-0">
            <a href={waLink(`I need help choosing ${product.name}`)} className="text-sm underline">
              Ask on WhatsApp
            </a>
          </div>
          <PincodeCheck subtotalPaise={product.pricePaise} />

          <details className="mt-8 border-t border-[var(--line)] pt-4" open>
            <summary className="cursor-pointer font-serif text-xl">The set</summary>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">{product.description}</p>
            {pieces.length > 0 ? (
              <ul className="mt-4 space-y-1 text-sm">
                {pieces.map((piece) => (
                  <li key={piece.name} className="flex justify-between border-b border-[var(--line)] py-2">
                    <span>{piece.name}</span>
                    <span>{piece.qty}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </details>
          <details className="mt-3 border-t border-[var(--line)] pt-4">
            <summary className="cursor-pointer font-serif text-xl">Fabric & care</summary>
            <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
              <li>Fabric · {product.fabric}</li>
              <li>Age · {product.ageRange}</li>
              <li>Pre-washed · {product.preWashed ? "Yes, before packing" : "No"}</li>
              <li>Care · {product.care}</li>
              <li>HSN · {product.hsn}</li>
            </ul>
          </details>
          <details className="mt-3 border-t border-[var(--line)] pt-4">
            <summary className="cursor-pointer font-serif text-xl">Shipping</summary>
            <p className="mt-3 text-sm text-[var(--muted)]">{brand.shippingIndia}. Enter a PIN code above for an estimate.</p>
          </details>
        </div>
      </div>

      {product.pairWith.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Goes with</h2>
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
          {product.reviews.length === 0 ? <p className="text-[var(--muted)]">No reviews yet.</p> : null}
          {product.reviews.map((r) => (
            <blockquote key={r.id} className="border-l-2 border-[var(--blush)] pl-4">
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
      <button type="submit" className="min-h-12 rounded-full border border-[var(--clay)] px-5">
        Wishlist
      </button>
    </form>
  );
}
