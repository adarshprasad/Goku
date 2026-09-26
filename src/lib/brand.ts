export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "SubbaSubbi",
  nameKn: "ಸುಬ್ಬ & ಸುಬ್ಬಿ",
  tagline: "Soft from the first day",
  description:
    "SubbaSubbi packs pre-washed newborn clothing sets for hospitals and ready sets for new mothers — jabla, muslin, swaddle, and feeding wear, delivered across India.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@subbasubbi.in",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+91 80 4567 2100",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918045672100",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ??
    "SubbaSubbi, 18 Infant Lane, Indiranagar, Bengaluru, Karnataka 560038",
  gstin: process.env.NEXT_PUBLIC_GSTIN ?? "29AAAAA0000A1Z5",
  instagram: "https://instagram.com/subbasubbi",
  returnDays: 7,
  shippingIndia: "3–7 days across India",
  shippingIntl: "10–21 days for international orders",
  originState: "KA",
} as const;

export const siteUrl =
  process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const categories = [
  { slug: "hospital-kit", label: "Hospital kit" },
  { slug: "jabla", label: "Jabla" },
  { slug: "nappy", label: "Nappy / langot" },
  { slug: "muslin", label: "Muslin set" },
  { slug: "swaddle", label: "Swaddle" },
  { slug: "wrapper", label: "Wrapper" },
  { slug: "bedding", label: "Bedding" },
  { slug: "hooded-towel", label: "Hooded towel" },
  { slug: "burp-cloth", label: "Burp cloth" },
  { slug: "dry-sheet", label: "Dry sheet" },
  { slug: "feeding", label: "Mother feeding wear" },
] as const;

export const ages = ["Newborn", "0–3 months", "3–6 months", "6–12 months"] as const;
