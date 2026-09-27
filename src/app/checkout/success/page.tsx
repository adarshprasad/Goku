import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { buildWhatsAppOrderText, waMe } from "@/lib/whatsapp-order";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: number } = await searchParams;
  if (!number) notFound();
  const [brand, order] = await Promise.all([
    getBrand(),
    prisma.order.findUnique({ where: { number }, include: { items: true } }),
  ]);
  if (!order) notFound();

  const waUrl = waMe(
    brand.whatsapp,
    buildWhatsAppOrderText({
      brandName: brand.name,
      number: order.number,
      fullName: order.shippingName,
      phone: order.phone,
      address: [order.shippingLine1, order.shippingLine2].filter(Boolean).join(", "),
      pincode: order.shippingPincode,
      city: order.shippingCity,
      state: order.shippingState,
      notes: order.notes ?? undefined,
      coupon: order.couponCode ?? undefined,
      totalPaise: order.totalPaise,
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, sku: i.sku })),
      siteUrl: brand.siteUrl,
    }),
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Namaskara</p>
      <h1 className="mt-3 font-serif text-4xl">Order {order.number}</h1>
      <p className="mt-4 text-[var(--muted)]">
        We saved your bag. Finish on WhatsApp — confirm the drape and pay by UPI with the atelier.
      </p>
      <p className="mt-2 text-lg">{formatInr(order.totalPaise)}</p>
      <ul className="mt-6 text-left text-sm text-[var(--muted)]">
        {order.items.map((i) => (
          <li key={i.id}>
            {i.name} × {i.quantity}
          </li>
        ))}
      </ul>
      <a
        href={waUrl}
        className="mt-8 inline-flex min-h-12 items-center bg-[var(--forest)] px-6 text-[var(--ivory)]"
      >
        Continue on WhatsApp
      </a>
      <p className="mt-6">
        <Link href="/shop" className="underline">
          Keep browsing
        </Link>
      </p>
    </div>
  );
}
