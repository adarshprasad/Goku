import { formatInr, waLink } from "./utils";

export function whatsappDigits(raw: string) {
  return raw.replace(/\D/g, "") || "918045672100";
}

export function waMe(phone: string, text: string) {
  return waLink(text, whatsappDigits(phone));
}

export type WhatsAppOrderLine = { name: string; quantity: number; sku?: string };

export function buildWhatsAppOrderText(opts: {
  brandName: string;
  number: string;
  fullName: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  notes?: string;
  coupon?: string;
  totalPaise: number;
  items: WhatsAppOrderLine[];
  siteUrl?: string;
}) {
  const items = opts.items
    .slice(0, 12)
    .map((i) => `• ${i.name} × ${i.quantity}${i.sku ? ` (${i.sku})` : ""}`)
    .join("\n");
  const extra = opts.items.length > 12 ? `\n• …and ${opts.items.length - 12} more` : "";
  const note = opts.notes?.trim() ? `\nNote: ${opts.notes.trim()}` : "";
  const coupon = opts.coupon ? `\nCoupon: ${opts.coupon}` : "";
  const link = opts.siteUrl ? `\n${opts.siteUrl}` : "";
  return `Namaskara, I would like to confirm this ${opts.brandName} order and pay on WhatsApp.

Order ${opts.number}
${opts.fullName} · ${opts.phone}
${opts.address}
${opts.city} ${opts.state} ${opts.pincode}

${items}${extra}
Total ${formatInr(opts.totalPaise)}${coupon}${note}${link}`;
}

export function buildWhatsAppProductText(opts: {
  brandName: string;
  name: string;
  pricePaise: number;
  url: string;
}) {
  return `Namaskara, I would like this ${opts.brandName} drape:

${opts.name}
${formatInr(opts.pricePaise)}
${opts.url}

Please help me confirm and pay on WhatsApp.`;
}
