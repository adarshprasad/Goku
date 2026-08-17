import { getBrand } from "@/lib/brand";

export default async function PrivacyPage() {
  const brand = await getBrand();
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 text-[var(--muted)]">
      <h1 className="font-serif text-4xl text-[var(--ink)]">Privacy</h1>
      <p className="mt-6 whitespace-pre-line leading-relaxed">{brand.privacyBody}</p>
      <p className="mt-6 text-sm">{brand.supportEmail}</p>
    </article>
  );
}
