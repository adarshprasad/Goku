"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { formatInr } from "@/lib/utils";

type Hit = {
  slug: string;
  name: string;
  weave: string;
  color: string;
  pricePaise: number;
};

type CollectionHit = { slug: string; name: string; tagline: string };

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<Hit[]>([]);
  const [collections, setCollections] = useState<CollectionHit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setProducts([]);
      setCollections([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = (await res.json()) as { products: Hit[]; collections: CollectionHit[] };
      setProducts(data.products);
      setCollections(data.collections);
    }, 180);
    return () => clearTimeout(t);
  }, [q, open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 items-center text-sm"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        Search
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-20" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-lg border border-[var(--line)] bg-[var(--ivory)] p-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id={titleId} className="font-serif text-xl">
                Search drapes
              </h2>
              <button type="button" className="min-h-11 px-2 text-sm underline" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Banarasi, maroon, wedding…"
              className="mt-3 min-h-12 w-full border border-[var(--line)] bg-white px-3"
            />
            <ul className="mt-4 max-h-80 space-y-2 overflow-auto text-sm">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} onClick={() => setOpen(false)} className="block py-2">
                    Collection · {c.name}
                    <span className="block text-[var(--muted)]">{c.tagline}</span>
                  </Link>
                </li>
              ))}
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="block py-2">
                    {p.name}
                    <span className="block text-[var(--muted)]">
                      {p.weave} · {p.color} · {formatInr(p.pricePaise)}
                    </span>
                  </Link>
                </li>
              ))}
              {q.trim().length >= 2 && products.length === 0 && collections.length === 0 ? (
                <li className="py-4 text-[var(--muted)]">No matches. Try Chanderi or linen.</li>
              ) : null}
            </ul>
            <Link
              href={`/shop?q=${encodeURIComponent(q.trim())}`}
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex min-h-11 items-center text-sm underline"
            >
              View all in shop
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
