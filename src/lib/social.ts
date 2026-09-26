import type { SiteBrand } from "./brand";
import { waLink } from "./utils";

export type SocialLink = { label: string; href: string };

export function socialLinks(brand: SiteBrand): SocialLink[] {
  const rows: [string, string][] = [
    ["Instagram", brand.instagram],
    ["Facebook", brand.facebook],
    ["YouTube", brand.youtube],
    ["Pinterest", brand.pinterest],
    ["X", brand.twitter],
    ["LinkedIn", brand.linkedin],
    ["WhatsApp Channel", brand.whatsappChannel],
    ["Google", brand.googleBusiness],
  ];
  return rows
    .filter(([, href]) => /^https?:\/\//i.test(href.trim()))
    .map(([label, href]) => ({ label, href: href.trim() }));
}

export function productShareLinks(opts: { name: string; url: string; shopWhatsApp: string }) {
  const u = encodeURIComponent(opts.url);
  const t = encodeURIComponent(`${opts.name} — ${opts.url}`);
  return [
    { label: "WhatsApp", href: waLink(`${opts.name}\n${opts.url}`, opts.shopWhatsApp) },
    { label: "Status / friends", href: `https://api.whatsapp.com/send/?text=${t}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${u}&description=${encodeURIComponent(opts.name)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${t}` },
  ];
}

export function absoluteAsset(siteUrl: string, path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
