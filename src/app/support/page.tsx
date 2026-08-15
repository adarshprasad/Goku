import { brand } from "@/lib/brand";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-4xl">Shipping & returns</h1>
      <p className="mt-6 leading-relaxed text-[var(--muted)]">{brand.shippingIndia}. International {brand.shippingIntl} when enabled.</p>
      <p className="mt-4 leading-relaxed text-[var(--muted)]">
        Returns within {brand.returnDays} days for unused, unstitched pieces with tags. Stitched blouses, pre-pleating, and custom pallus are not returnable. COD orders may be refused at the door only if the packet is unopened; RTO fees may be deducted from refunds.
      </p>
      <p className="mt-4 text-sm">WhatsApp {brand.supportPhone} · {brand.supportEmail}</p>
    </div>
  );
}
