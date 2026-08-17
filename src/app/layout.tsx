import { Cormorant_Garamond, Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter, BottomNav, WhatsAppButton } from "@/components/chrome";
import { getBrand, siteUrl } from "@/lib/brand";

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
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${brand.name} — ${brand.taglineEn}`,
      template: `%s · ${brand.name}`,
    },
    description: brand.description,
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
      images: [brand.logo],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#284232",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
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
