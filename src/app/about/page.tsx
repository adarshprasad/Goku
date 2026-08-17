import Image from "next/image";
import { getBrand } from "@/lib/brand";

export default async function AboutPage() {
  const brand = await getBrand();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="bg-[var(--forest)] p-8">
        <Image src={brand.logo} alt={brand.name} width={120} height={120} className="h-[120px] w-[120px] object-cover" />
      </div>
      <p className="mt-10 font-serif text-lg italic text-[var(--muted)]">{brand.taglineEn}</p>
      <h1 className="mt-3 font-serif text-5xl">{brand.aboutTitle}</h1>
      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-[var(--muted)]">{brand.aboutBody}</div>
      <address className="mt-12 not-italic text-sm leading-relaxed">
        {brand.address}
        <br />
        {brand.supportEmail} · {brand.supportPhone}
        <br />
        GSTIN {brand.gstin}
      </address>
    </div>
  );
}
