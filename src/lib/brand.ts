import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { normalizeSiteUrl } from "@/lib/slug";
import { CANONICAL_SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

const envSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL || process.env.NEXTAUTH_URL || CANONICAL_SITE_URL,
);

export const brandDefaults = {
  name: "Tavaru",
  taglineEn: "For the days that become photographs.",
  taglineKn: "For the days that become photographs.",
  description:
    "Tavaru is a premium Indian saree atelier — handloom Banarasi, Kanjivaram, Chanderi, organza, linen, and designer drapes, with blouses, lehengas, and finishing services.",
  logo: "/brand/tavaru-logo.png",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? SUPPORT_EMAIL,
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+91 80 4567 2100",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918045672100",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ??
    "Tavaru Atelier, 12 Lavelle Road, Bengaluru, Karnataka 560001",
  gstin: process.env.NEXT_PUBLIC_GSTIN ?? "29AAAAA0000A1Z5",
  instagram: "https://instagram.com/tavaruseere",
  facebook: "",
  youtube: "",
  pinterest: "",
  twitter: "",
  linkedin: "",
  whatsappChannel: "",
  googleBusiness: "",
  returnDays: "7",
  shippingIndia: "3–7 days across India",
  shippingIntl: "10–21 days for international orders",
  originState: "KA",
  aboutTitle: "Tavaru atelier",
  aboutBody:
    "Tavaru means mother — the person in whose photographs a drape still lives. We seek weaves with a place of origin, and finishing that respects them. The studio sits in Bengaluru: fall, pico, blouse, and a quiet room to drape before a wedding.\n\nWe work with GI clusters in Varanasi, Kanchipuram, Chanderi, and Paithan. Powerloom is labelled. Returns are seven days on unused, unstitched pieces; stitched blouses and custom pallus stay with you.",
  craftTitle: "Named looms, honest cloth.",
  craftBody:
    "We buy from GI clusters — Banaras, Kanchipuram, Chanderi, Paithan — and finish fall, pico, and blouse in Bengaluru. If a piece is powerloom, the product page says so.",
  craftImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
  heroSubtitle: "Handloom, temple borders, and finishing — from a Bengaluru atelier.",
  privacyBody:
    "Tavaru collects account, address, and order data to fulfil drapes. Orders are confirmed and paid on WhatsApp (UPI or bank transfer). We do not take card numbers on this website. You may request access or deletion under India’s DPDP Act.",
  termsBody:
    "By placing an order you agree that colours on screen are indicative, handloom variation is not a defect, and stitched services are made to your measurements. Title passes on delivery. Bengaluru courts have jurisdiction.",
  refundBody:
    "If a WhatsApp UPI payment is reversed, we issue store credit or a bank refund after QC. Unused unstitched pieces follow the returns page.",
  shippingPolicy:
    "Returns within the stated days for unused, unstitched pieces with tags. Stitched blouses, pre-pleating, and custom pallus are not returnable.",
  siteUrl: envSiteUrl,
  checkoutIntro:
    "Fill your address, then WhatsApp opens with the bag already typed. Pay by UPI with the atelier — nothing is charged on this website.",
  productPayNote: "Pay on WhatsApp after you confirm the drape. No cards on this site.",
  checkoutPayNote: "You will pay on WhatsApp — UPI or transfer with the atelier. No cards on this site.",
  headerCity: "Bengaluru",
  heroCta: "Shop the new weave",
  heroCtaHref: "/shop",
  heroSecondary: "Handloom",
  heroSecondaryHref: "/collections/handloom",
  shopByLabel: "Shop by weave",
  bestsellersTitle: "Bestsellers",
  journalHomeTitle: "Journal",
  promise1Title: "Order on WhatsApp",
  promise1Body: "Confirm the drape and pay by UPI in chat. No cards on this site.",
  promise2Title: "GST invoice",
  promise2Body: "",
  promise3Title: "India shipping",
  promise3Body: "",
  promise4Title: "WhatsApp atelier",
  promise4Body: "Drape help, measurements, and order care.",
  drapingCta: "Book a draping appointment",
  footerPromise: "Pay by UPI on WhatsApp. GST invoice.",
  navShop: "Shop",
  navWedding: "Wedding",
  navWeddingHref: "/collections/wedding",
  navHandloom: "Handloom",
  navHandloomHref: "/collections/handloom",
  navJournal: "Journal",
  navAbout: "Atelier",
} as const;

export type SiteBrand = Record<keyof typeof brandDefaults, string>;

const KEYS = Object.keys(brandDefaults) as (keyof SiteBrand)[];

export const getBrand = cache(async (): Promise<SiteBrand> => {
  const rows = await prisma.setting.findMany({
    where: { key: { in: KEYS as unknown as string[] } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const out: SiteBrand = { ...brandDefaults };
  for (const key of KEYS) {
    const v = map[key];
    if (typeof v === "string" && v.trim()) out[key] = v;
  }
  out.siteUrl = normalizeSiteUrl(out.siteUrl || envSiteUrl);
  return out;
});

export async function getSiteUrl() {
  const brand = await getBrand();
  return normalizeSiteUrl(brand.siteUrl || envSiteUrl);
}

/** Sync fallback for modules that cannot await (prefer getBrand / getSiteUrl). */
export const brand = brandDefaults;
export const siteUrl = envSiteUrl;
