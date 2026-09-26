import { brand } from "@/lib/brand";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-4xl">Privacy</h1>
      <p className="mt-6 leading-relaxed text-[var(--muted)]">
        {brand.name} stores your name, phone, address, and order so we can pack and deliver sets. Hospital applications also store the hospital name, GSTIN, and ward address. Card and UPI details stay with Razorpay. We use WhatsApp and email for order updates. Write to {brand.supportEmail} to ask for a copy or deletion of your account.
      </p>
    </div>
  );
}
