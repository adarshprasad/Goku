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

/** wa.me needs country code + number with no +, spaces, or dashes. */
export function whatsappDigits(raw?: string | null) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) d = `91${d}`;
  if (d.startsWith("91") && d.length === 13 && d[2] === "0") d = `91${d.slice(3)}`;
  return d || "918045672100";
}

export function waLink(text?: string, phone?: string) {
  const n = whatsappDigits(phone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const params = new URLSearchParams({ phone: n, type: "phone_number", app_absent: "0" });
  if (text) params.set("text", text);
  return `https://api.whatsapp.com/send/?${params.toString()}`;
}

export function formatWhatsAppDisplay(raw?: string | null) {
  const d = whatsappDigits(raw);
  if (d.startsWith("91") && d.length === 12) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return `+${d}`;
}
