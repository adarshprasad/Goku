export const brand = {
  name: "Huduku",
  taglineKn: "Hennige anda seere inda",
  taglineEn: "Adds beauty to the woman",
  description:
    "Huduku is a premium Indian saree atelier — handloom Banarasi, Kanjivaram, Chanderi, organza, linen, and designer drapes, with blouses, lehengas, and finishing services.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@huduku.in",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+91 80 4567 2100",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918045672100",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ??
    "Huduku Atelier, 12 Lavelle Road, Bengaluru, Karnataka 560001",
  gstin: process.env.NEXT_PUBLIC_GSTIN ?? "29AAAAA0000A1Z5",
  instagram: "https://instagram.com/huduku",
  returnDays: 7,
  shippingIndia: "3–7 days across India",
  shippingIntl: "10–21 days for international orders",
  originState: "KA",
} as const;

export const siteUrl =
  process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
