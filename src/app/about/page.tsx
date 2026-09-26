import { brand } from "@/lib/brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--clay)]">{brand.tagline}</p>
      <h1 className="mt-3 font-serif text-5xl">About {brand.name}</h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
        SubbaSubbi started with a simple gap. Hospitals wanted a washed set of clothes ready for a baby who had just been born. New mothers wanted the same set for the bag they take to the hospital, plus something soft to wear while feeding.
      </p>
      <p className="mt-4 leading-relaxed text-[var(--muted)]">
        We sell two ways. Maternity wards order kits in bulk, with a GST invoice and a delivery to the ward. Mothers order single sets online. Every baby garment is pre-washed, softened, and sealed before it leaves us.
      </p>
      <address className="mt-10 not-italic text-sm">
        {brand.address}
        <br />
        {brand.supportEmail} · {brand.supportPhone}
        <br />
        GSTIN {brand.gstin}
      </address>
    </div>
  );
}
