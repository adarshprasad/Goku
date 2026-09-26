import { brand } from "@/lib/brand";

export const metadata = { title: "Shipping, returns, and contact" };

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-4xl">Shipping, returns, and contact</h1>
      <p className="mt-6 leading-relaxed text-[var(--muted)]">{brand.shippingIndia}. Enter your PIN code on a product to see if we deliver there.</p>
      <p className="mt-4 leading-relaxed text-[var(--muted)]">
        Returns within {brand.returnDays} days if the seal is intact and the set is unused. Opened hospital cartons that have been issued on the ward cannot be returned. Cash on delivery is available under the limit shown at checkout, except a few blocked PIN codes.
      </p>
      <p className="mt-6 text-sm">
        WhatsApp and phone {brand.supportPhone}
        <br />
        Email {brand.supportEmail}
      </p>
    </div>
  );
}
