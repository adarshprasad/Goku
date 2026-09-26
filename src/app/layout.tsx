import { Fraunces, Nunito } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter, BottomNav, WhatsAppButton } from "@/components/chrome";
import { PwaRegister } from "@/components/pwa-register";
import { brand, siteUrl } from "@/lib/brand";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-serif",
});

const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: brand.name,
    statusBarStyle: "default",
  },
  openGraph: {
    title: brand.name,
    description: brand.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3f6f64",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <BottomNav />
        <WhatsAppButton />
        <PwaRegister />
      </body>
    </html>
  );
}
