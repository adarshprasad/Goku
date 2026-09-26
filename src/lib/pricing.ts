export type PriceBreak = { minQty: number; pricePaise: number };

export function parsePriceBreaks(raw: string | null | undefined): PriceBreak[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const minQty = Number((row as { minQty?: unknown }).minQty);
        const pricePaise = Number((row as { pricePaise?: unknown }).pricePaise);
        if (!Number.isFinite(minQty) || !Number.isFinite(pricePaise)) return null;
        return { minQty, pricePaise };
      })
      .filter((row): row is PriceBreak => Boolean(row))
      .sort((a, b) => a.minQty - b.minQty);
  } catch {
    return [];
  }
}

export type Piece = { name: string; qty: number };

export function parseContents(raw: string | null | undefined): Piece[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const name = String((row as { name?: unknown }).name ?? "");
        const qty = Number((row as { qty?: unknown }).qty ?? 0);
        if (!name || !Number.isFinite(qty)) return null;
        return { name, qty };
      })
      .filter((row): row is Piece => Boolean(row));
  } catch {
    return [];
  }
}

/**
 * Retail price is what mothers see. Breaks apply only to an approved hospital account.
 */
export function unitPricePaise(params: {
  retailPaise: number;
  priceBreaks: string;
  quantity: number;
  hospitalApproved: boolean;
}): number {
  if (!params.hospitalApproved) return params.retailPaise;
  const breaks = parsePriceBreaks(params.priceBreaks).filter((b) => params.quantity >= b.minQty);
  if (breaks.length === 0) return params.retailPaise;
  return breaks[breaks.length - 1].pricePaise;
}
