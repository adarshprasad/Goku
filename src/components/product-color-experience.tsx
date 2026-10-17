"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ProductBuyForm, type BuyVariant } from "@/components/product-buy-form";
import { imagesForVariant } from "@/lib/colors";

type GalleryImage = { id: string; url: string; alt: string; variantId: string | null };

export function ProductColorExperience({
  children,
  images,
  variants,
  ...buy
}: {
  children: React.ReactNode;
  images: GalleryImage[];
  variants: BuyVariant[];
  productId: string;
  productName: string;
  pricePaise: number;
  productUrl: string;
  brandName: string;
  whatsapp: string;
  madeToOrder: boolean;
  addons: { id: string; slug: string; name: string; pricePaise: number }[];
}) {
  const initial = useMemo(() => variants.find((v) => v.stock > 0) ?? variants[0], [variants]);
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");
  const shown = imagesForVariant(images, selectedId || null);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-3">
        {shown.length === 0 ? <div className="aspect-[3/4] bg-[var(--ivory-2)]" /> : null}
        {shown.map((img) => (
          <div key={img.id} className="relative aspect-[3/4] overflow-hidden bg-[var(--ivory-2)]">
            <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="50vw" priority={img.id === shown[0]?.id} />
          </div>
        ))}
      </div>
      <div>
        {children}
        <ProductBuyForm {...buy} variants={variants} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
