import { brand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blouse, fall & fabric guide" };

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-4xl">How to order a blouse</h1>
      <p className="mt-4 leading-relaxed text-[var(--muted)]">
        Most Huduku sarees include an unstitched blouse piece. Fall, pico, and stitching are atelier add-ons with a 4–7 day
        lead. Stitched pieces cannot be returned.
      </p>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Measurements we need</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--muted)]">
          <li>Bust, waist, and shoulder — in inches or centimetres, clearly labelled.</li>
          <li>Blouse length (typical 13–15 inches) and sleeve length.</li>
          <li>Preferred neck (boat, sweetheart, high) and lining.</li>
          <li>Model height on the product page is a drape reference, not your size.</li>
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Fabric feel</h2>
        <p className="mt-4 text-[var(--muted)]">
          Silk Kanjivaram and Banarasi drape structured. Chanderi and organza are lighter and slightly translucent — we note
          transparency on each page. Linen and cotton are everyday weaves; dry-clean silks, gentle wash cottons.
        </p>
      </section>
      <p className="mt-10 text-sm">
        WhatsApp {brand.supportPhone} with a photo of a well-fitting blouse if you are unsure.
      </p>
    </div>
  );
}
