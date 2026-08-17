import { getBrand } from "@/lib/brand";

export default async function SupportPage() {
  const brand = await getBrand();
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-4xl">Shipping & returns</h1>
      <p className="mt-6 leading-relaxed text-[var(--muted)]">
        {brand.shippingIndia}. International {brand.shippingIntl} when enabled.
      </p>
      <p className="mt-4 whitespace-pre-line leading-relaxed text-[var(--muted)]">{brand.shippingPolicy}</p>
      <p className="mt-4 text-sm">
        Returns within {brand.returnDays} days. WhatsApp {brand.supportPhone} · {brand.supportEmail}
      </p>
    </div>
  );
}
