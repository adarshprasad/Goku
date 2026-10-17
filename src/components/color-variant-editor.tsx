"use client";

import { useState } from "react";
import { swatchHex } from "@/lib/colors";

export type ColorRow = {
  id: string;
  color: string;
  hex: string;
  sku: string;
  stock: number;
};

export function ColorVariantEditor({ variants }: { variants: ColorRow[] }) {
  const [rows, setRows] = useState<ColorRow[]>(
    variants.length
      ? variants
      : [{ id: "", color: "", hex: "#284232", sku: "", stock: 1 }],
  );

  function addRow() {
    setRows((r) => [...r, { id: "", color: "", hex: "#284232", sku: "", stock: 1 }]);
  }

  function removeRow(index: number) {
    setRows((r) => (r.length === 1 ? r : r.filter((_, i) => i !== index)));
  }

  return (
    <fieldset className="space-y-3 border border-[var(--line)] p-4">
      <legend className="px-1 text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Colour inventory</legend>
      <p className="text-sm text-[var(--muted)]">
        Each colour is its own stock. Zero stock greys out that swatch on the shop. Hex is the button colour customers see.
      </p>
      {rows.map((row, i) => (
        <div key={`${row.id || "new"}-${i}`} className="grid gap-3 border-t border-[var(--line)] pt-3 md:grid-cols-[auto_1fr_1fr_5rem_auto] md:items-end">
          <input type="hidden" name="variantId" value={row.id} />
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Swatch</span>
            <input
              name="variantHex"
              type="color"
              value={swatchHex(row.color, row.hex)}
              onChange={(e) => {
                const hex = e.target.value;
                setRows((r) => r.map((x, j) => (j === i ? { ...x, hex } : x)));
              }}
              className="mt-2 h-11 w-14 cursor-pointer border border-[var(--line)] bg-[var(--ivory)] p-1"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Colour name</span>
            <input
              name="variantColor"
              required
              value={row.color}
              onChange={(e) => {
                const color = e.target.value;
                setRows((r) => r.map((x, j) => (j === i ? { ...x, color } : x)));
              }}
              placeholder="Ruby"
              className="mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--ivory)] px-3"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">SKU</span>
            <input
              name="variantSku"
              value={row.sku}
              onChange={(e) => {
                const sku = e.target.value;
                setRows((r) => r.map((x, j) => (j === i ? { ...x, sku } : x)));
              }}
              placeholder="blank = from name"
              className="mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--ivory)] px-3"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Stock</span>
            <input
              name="variantStock"
              type="number"
              min={0}
              value={row.stock}
              onChange={(e) => {
                const stock = Number(e.target.value);
                setRows((r) => r.map((x, j) => (j === i ? { ...x, stock } : x)));
              }}
              className="mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--ivory)] px-3"
            />
          </label>
          <button type="button" onClick={() => removeRow(i)} className="min-h-11 text-sm underline">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="min-h-11 border border-[var(--forest)] px-4 text-sm">
        Add colour
      </button>
    </fieldset>
  );
}
