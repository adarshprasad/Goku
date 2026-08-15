export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 text-[var(--muted)]">
      <h1 className="font-serif text-4xl text-[var(--ink)]">Privacy</h1>
      <p className="mt-6">
        Huduku collects account, address, and order data to fulfil drapes. We do not store card numbers — Razorpay / Stripe
        process payments. WhatsApp messages are used for order care. You may request access or deletion at hello@huduku.in
        under India’s DPDP Act.
      </p>
    </article>
  );
}
