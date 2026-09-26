import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatInr } from "@/lib/utils";
import { auth } from "@/auth";
import { getBrand } from "@/lib/brand";

const desks = [
  { href: "/admin/settings", title: "Brand & pages", body: "Name, logo, WhatsApp, address, home copy, about, legal, admin login." },
  { href: "/admin/products", title: "Catalog", body: "Sarees, photos, price, stock, weave, GI tag." },
  { href: "/admin/collections", title: "Collections", body: "Wedding, handloom, and shop-by-weave photos." },
  { href: "/admin/banners", title: "Home banners", body: "Hero photograph and overlay line." },
  { href: "/admin/journal", title: "Journal", body: "Stories on the home page and /journal." },
  { href: "/admin/addons", title: "Finishing", body: "Fall, pico, blouse stitching add-ons." },
  { href: "/admin/coupons", title: "Coupons", body: "Discount codes at checkout." },
  { href: "/admin/orders", title: "Orders", body: "WhatsApp the customer, mark PAID, tracking." },
];

export default async function AdminHome() {
  const session = await auth();
  const [brand, sales, unpaid, low, orders, products] = await Promise.all([
    getBrand(),
    prisma.order.aggregate({
      _sum: { totalPaise: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.order.count({ where: { paymentStatus: "UNPAID" } }),
    prisma.productVariant.count({ where: { stock: { lte: 2 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.product.count({ where: { published: true } }),
  ]);

  const waLooksDemo = brand.whatsapp.includes("8045672100");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl">Atelier desk</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Signed in as {session?.user?.email}. Tap a card to change what customers see.
      </p>
      {waLooksDemo ? (
        <p className="mt-4 border border-[var(--line)] bg-[var(--ivory-2)] p-4 text-sm">
          Set your real WhatsApp number in{" "}
          <Link href="/admin/settings" className="underline">
            Brand & pages
          </Link>{" "}
          before you take orders. Demo number is still on the shop.
        </p>
      ) : null}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border border-[var(--line)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Paid on WhatsApp</p>
          <p className="mt-2 font-serif text-3xl">{formatInr(sales._sum.totalPaise ?? 0)}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Waiting for UPI</p>
          <p className="mt-2 font-serif text-3xl">{unpaid}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Live drapes / low stock</p>
          <p className="mt-2 font-serif text-3xl">
            {products} / {low}
          </p>
        </div>
      </div>
      <h2 className="mt-12 font-serif text-2xl">Manage the shop</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {desks.map((d) => (
          <Link key={d.href} href={d.href} className="border border-[var(--line)] p-5 hover:border-[var(--forest)]">
            <h3 className="font-serif text-xl">{d.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{d.body}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl">Recent orders</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {orders.length === 0 ? <li className="text-[var(--muted)]">No orders yet. They appear after a WhatsApp checkout.</li> : null}
        {orders.map((o) => (
          <li key={o.id}>
            <Link href="/admin/orders" className="hover:underline">
              {o.number} · {o.paymentStatus} · {o.status} · {formatInr(o.totalPaise)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
