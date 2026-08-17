import Image from "next/image";
import { brand } from "@/lib/brand";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Image
        src={brand.logo}
        alt={brand.name}
        width={160}
        height={160}
        className="h-40 w-40 rounded-sm object-cover"
      />
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--gold-deep)]">{brand.taglineEn}</p>
      <h1 className="mt-3 font-serif text-5xl">Tavaru atelier</h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
        Tavaru means mother — the person in whose photographs a drape still lives. We seek weaves with a place of origin,
        and finishing that respects them. The studio sits on Lavelle Road, Bengaluru: fall, pico, blouse, and a quiet room
        to drape before a wedding.
      </p>
      <p className="mt-4 leading-relaxed text-[var(--muted)]">
        We work with GI clusters in Varanasi, Kanchipuram, Chanderi, and Paithan. Powerloom is labelled. Gold is antique where
        the loom allows. Returns are seven days on unused, unstitched pieces; stitched blouses and custom pallus stay with you.
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
