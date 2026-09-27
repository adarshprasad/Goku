import { Cormorant_Garamond, Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter, BottomNav, WhatsAppButton } from "@/components/chrome";
import { getBrand } from "@/lib/brand";
import { absoluteAsset, socialLinks } from "@/lib/social";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  const image = absoluteAsset(brand.siteUrl, brand.logo);
  return {
    metadataBase: new URL(brand.siteUrl),
    title: {
      default: `${brand.name} — ${brand.taglineEn}`,
      template: `%s · ${brand.name}`,
    },
    description: brand.description,
    keywords: ["saree", "handloom", "Banarasi", "Kanjivaram", "Bengaluru", brand.name, "WhatsApp"],
    alternates: { canonical: brand.siteUrl },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: brand.name,
      statusBarStyle: "black-translucent",
    },
    icons: {
      icon: brand.logo,
      apple: brand.logo,
    },
    openGraph: {
      title: brand.name,
      description: brand.description,
      type: "website",
      locale: "en_IN",
      url: brand.siteUrl,
      siteName: brand.name,
      images: [{ url: image, alt: brand.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: brand.name,
      description: brand.description,
      images: [image],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#284232",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = await getBrand();
  const sameAs = socialLinks(brand).map((s) => s.href);
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: brand.name,
    description: brand.description,
    url: brand.siteUrl,
    image: absoluteAsset(brand.siteUrl, brand.logo),
    telephone: brand.supportPhone,
    email: brand.supportEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address,
      addressLocality: brand.headerCity,
      addressRegion: brand.originState,
      addressCountry: "IN",
    },
    sameAs,
  };
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--ivory)] focus:px-3 focus:py-2">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <BottomNav />
        <WhatsAppButton />
      </body>
    </html>
  );
}
