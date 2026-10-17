"use client";

import { addToCart } from "@/app/actions/cart";
import { formatInr, waLink } from "@/lib/utils";
import { contrastInk, swatchHex, variantLabel } from "@/lib/colors";
import { buildWhatsAppProductText } from "@/lib/whatsapp-order";

export type BuyVariant = {
  id: string;
  name: string;
  color: string | null;
  hex: string | null;
  stock: number;
  sku: string;
};

type Addon = { id: string; slug: string; name: string; pricePaise: number };

export function ProductBuyForm({
  productId,
  productName,
  pricePaise,
  productUrl,
  brandName,
  whatsapp,
  madeToOrder,
  variants,
  addons,
  selectedId,
  onSelect,
}: {
  productId: string;
  productName: string;
  pricePaise: number;
  productUrl: string;
  brandName: string;
  whatsapp: string;
  madeToOrder: boolean;
  variants: BuyVariant[];
  addons: Addon[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selected = variants.find((v) => v.id === selectedId) ?? variants.find((v) => v.stock > 0) ?? variants[0];
  const available = Boolean(selected && (selected.stock > 0 || madeToOrder));
  const colour = selected ? variantLabel(selected) : "";
  const waHref = waLink(
    buildWhatsAppProductText({
      brandName,
      name: productName,
      pricePaise,
      url: productUrl,
      color: colour,
    }),
    whatsapp,
  );

  return (
    <form action={addToCart} className="mt-8 space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="variantId" value={selected?.id ?? ""} />

      <fieldset>
        <legend className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Colour / variant</legend>
        <div className="mt-3 flex flex-wrap gap-3" role="listbox" aria-label="Colour">
          {variants.map((v) => {
            const hex = swatchHex(v.color || v.name, v.hex);
            const ink = contrastInk(hex);
            const on = v.id === selected?.id;
            const out = v.stock < 1 && !madeToOrder;
            const label = variantLabel(v);
            return (
              <button
                key={v.id}
                type="button"
                role="option"
                aria-selected={on}
                aria-disabled={out}
                title={out ? `${label} — out of stock` : `${label} · ${v.stock} in atelier`}
                onClick={() => onSelect(v.id)}
                className={`relative flex min-h-11 min-w-11 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                  on ? "ring-2 ring-[var(--forest)] ring-offset-2 ring-offset-[var(--ivory)]" : "border-[var(--line)]"
                } ${out ? "opacity-50 hover:border-[var(--forest)]" : "hover:border-[var(--forest)]"}`}
              >
                <span
                  className="inline-block h-6 w-6 shrink-0 rounded-full border border-black/15"
                  style={{ backgroundColor: hex }}
                  aria-hidden
                />
                <span>{label}</span>
                {on && !out ? (
                  <span className="text-xs" style={{ color: ink === "#f6f1e4" ? "var(--forest)" : "inherit" }} aria-hidden>
                    ✓
                  </span>
                ) : null}
                {out ? <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Out</span> : null}
              </button>
            );
          })}
        </div>
        {selected ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {colour}
            {selected.stock > 0 ? ` · ${selected.stock} in atelier` : madeToOrder ? " · made to order" : " · out of stock"}
          </p>
        ) : null}
      </fieldset>

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
        <button
          className="min-h-12 flex-1 bg-[var(--forest)] px-6 text-[var(--ivory)] disabled:opacity-40"
          disabled={!available}
        >
          Add to bag
        </button>
        {available ? (
          <a
            href={waHref}
            className="inline-flex min-h-12 flex-1 items-center justify-center border border-[var(--forest)] px-6 text-[var(--forest)]"
          >
            Order on WhatsApp
          </a>
        ) : (
          <span className="inline-flex min-h-12 flex-1 items-center justify-center border border-[var(--line)] px-6 text-[var(--muted)]">
            Out of stock
          </span>
        )}
      </div>
    </form>
  );
}
