"use client";

import { formatInr } from "@/lib/utils";

export function StickyCartBar({
  name,
  pricePaise,
  disabled,
}: {
  name: string;
  pricePaise: number;
  disabled: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-14 z-30 flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--ivory)] px-4 py-3 md:hidden">
      <div>
        <p className="max-w-[44vw] truncate font-serif text-base">{name}</p>
        <p className="text-sm">{formatInr(pricePaise)}</p>
      </div>
      <button
        type="submit"
        form="add-to-bag"
        disabled={disabled}
        className="min-h-11 bg-[var(--maroon)] px-5 text-sm text-[var(--ivory)] disabled:opacity-50"
      >
        Add to bag
      </button>
    </div>
  );
}
