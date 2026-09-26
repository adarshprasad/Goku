"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images }: { images: { id: string; url: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <button
        type="button"
        className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[var(--sand)]"
        onClick={() => setOpen(true)}
        aria-label="Enlarge photo"
      >
        <Image src={current.url} alt={current.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
      </button>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-14 overflow-hidden rounded-xl border ${index === active ? "border-[var(--clay)]" : "border-transparent"}`}
              aria-label={`Photo ${index + 1}`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/80 p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute right-4 top-4 min-h-11 rounded-full bg-white px-4" onClick={() => setOpen(false)}>
            Close
          </button>
          <div className="relative h-[80vh] w-full max-w-3xl">
            <Image src={current.url} alt={current.alt} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
