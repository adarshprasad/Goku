import { getBrand } from "@/lib/brand";

export default async function RefundPage() {
  const brand = await getBrand();
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 text-[var(--muted)]">
      <h1 className="font-serif text-4xl text-[var(--ink)]">Refunds</h1>
      <p className="mt-6 whitespace-pre-line leading-relaxed">{brand.refundBody}</p>
    </article>
  );
}
