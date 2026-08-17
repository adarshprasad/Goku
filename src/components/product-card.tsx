import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatInr } from "@/lib/utils";

type ProductCardProduct = {
  slug: string;
  name: string;
  weave: string;
  pricePaise: number;
  mrpPaise: number;
  color: string;
  images: { url: string; alt: string }[];
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const img = product.images[0];
  const off = discountPercent(product.pricePaise, product.mrpPaise);
  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--ivory-2)]">
          {img ? (
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : null}
          {off > 0 ? (
            <span className="absolute left-3 top-3 bg-[var(--maroon)] px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--ivory)]">
              {off}% off
            </span>
          ) : null}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">{product.weave}</p>
          <h3 className="font-serif text-lg leading-snug">{product.name}</h3>
          <p className="text-sm">
            {formatInr(product.pricePaise)}
            {off > 0 ? (
              <span className="ml-2 text-[var(--muted)] line-through">{formatInr(product.mrpPaise)}</span>
            ) : null}
          </p>
          <p className="text-xs text-[var(--muted)]">{product.color}</p>
        </div>
      </Link>
    </article>
  );
}
