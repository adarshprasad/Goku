import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

export function discountPercent(pricePaise: number, mrpPaise: number) {
  if (mrpPaise <= pricePaise) return 0;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}

export function waLink(text?: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918045672100";
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${phone}${q}`;
}
