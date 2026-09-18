import { brand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    q: "How do I pay?",
    a: "UPI, cards, netbanking, wallets, and EMI via Razorpay. When keys are not configured, checkout uses a labeled mock gateway that still confirms the order on the server. COD is available on eligible Indian pincodes with a ₹49 fee, up to ₹25,000.",
  },
  {
    q: "Do you stitch blouses?",
    a: "Yes — add blouse stitching at the product page. Share measurements in the note. Stitched and custom pieces are not returnable.",
  },
  {
    q: "What is your return window?",
    a: `Unused, unstitched sarees with tags may be returned within ${brand.returnDays} days. Fall/pico-only finishing is accepted if the drape is unused.`,
  },
  {
    q: "Do you ship internationally?",
    a: `${brand.shippingIntl}. International checkout is gated until ENABLE_INTERNATIONAL is set. Duties are the buyer’s responsibility. No COD abroad.`,
  },
  {
    q: "Will I get a GST invoice?",
    a: `Yes. Every silk lists an HSN. Add a GSTIN at checkout for a business invoice. GSTIN ${brand.gstin}.`,
  },
  {
    q: "Can I visit the atelier?",
    a: `${brand.address}. Book a draping appointment on WhatsApp ${brand.supportPhone}.`,
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="font-serif text-4xl">Questions</h1>
      <dl className="mt-10 space-y-8">
        {faqs.map((f) => (
          <div key={f.q}>
            <dt className="font-serif text-2xl">{f.q}</dt>
            <dd className="mt-2 leading-relaxed text-[var(--muted)]">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
