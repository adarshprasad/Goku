import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/brand";
import { discountPercent, formatInr } from "@/lib/utils";

type ProductCardProduct = {
  slug: string;
  name: string;
  category: string;
  ageRange: string;
  packOf: number;
  pricePaise: number;
  mrpPaise: number;
  hospitalOnly?: boolean;
  images: { url: string; alt: string }[];
  variants?: { stock: number }[];
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const img = product.images[0];
  const off = discountPercent(product.pricePaise, product.mrpPaise);
  const label = categories.find((c) => c.slug === product.category)?.label ?? product.category;
  const stock = product.variants?.reduce((sum, v) => sum + v.stock, 0);
  const soldOut = stock === 0;

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--sand)]">
          {img ? (
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          ) : null}
          {soldOut ? (
            <span className="absolute inset-0 flex items-center justify-center bg-[var(--ink)]/45 text-sm font-medium text-white">
              Out of stock
            </span>
          ) : null}
          {off > 0 && !soldOut ? (
            <span className="absolute left-3 top-3 rounded-full bg-[var(--clay)] px-2.5 py-1 text-[10px] uppercase tracking-wider text-white">
              {off}% off
            </span>
          ) : null}
          {product.hospitalOnly ? (
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[var(--ink)]">
              Hospital
            </span>
          ) : null}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--clay)]">{label}</p>
          <h3 className="font-serif text-lg leading-snug">{product.name}</h3>
          <p className="text-sm">
            {product.hospitalOnly ? (
              <span>Hospital rate after approval</span>
            ) : (
              <>
                {formatInr(product.pricePaise)}
                {off > 0 ? (
                  <span className="ml-2 text-[var(--muted)] line-through">{formatInr(product.mrpPaise)}</span>
                ) : null}
              </>
            )}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {product.ageRange} · Pack of {product.packOf}
          </p>
        </div>
      </Link>
    </article>
  );
}
