import { brand } from "@/lib/brand";

export const metadata = { title: "Refunds" };

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-4xl">Refunds</h1>
      <p className="mt-6 leading-relaxed text-[var(--muted)]">
        Unused, sealed sets can be returned within {brand.returnDays} days. Refunds go back to the original payment method. Cash on delivery refunds are sent by UPI after we receive the sealed set. Hospital cartons opened for ward use are not refundable.
      </p>
    </div>
  );
}
