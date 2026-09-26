import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatInr } from "@/lib/utils";

export default async function AdminHome() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const [sales, pending, low, orders, today, hospitals] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalPaise: true },
      where: { paymentStatus: { in: ["PAID", "COD_PENDING"] } },
    }),
    prisma.order.count({ where: { paymentMethod: "COD", paymentStatus: "COD_PENDING" } }),
    prisma.productVariant.count({ where: { stock: { lte: 2 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.order.aggregate({
      _sum: { totalPaise: true },
      _count: true,
      where: { createdAt: { gte: start }, paymentStatus: { in: ["PAID", "COD_PENDING"] } },
    }),
    prisma.hospitalAccount.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl">Yaju desk</h1>
      <nav className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href="/admin/products" className="underline">
          Catalog
        </Link>
        <Link href="/admin/orders" className="underline">
          Orders
        </Link>
        <Link href="/admin/coupons" className="underline">
          Coupons
        </Link>
        <Link href="/admin/hospitals" className="underline">
          Hospitals ({hospitals} pending)
        </Link>
        <Link href="/admin/reviews" className="underline">
          Reviews
        </Link>
      </nav>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-widest">Today</p>
          <p className="mt-2 font-serif text-3xl">{formatInr(today._sum.totalPaise ?? 0)}</p>
          <p className="text-xs text-[var(--muted)]">{today._count} paid or COD orders</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-widest">Sales captured</p>
          <p className="mt-2 font-serif text-3xl">{formatInr(sales._sum.totalPaise ?? 0)}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-widest">Pending COD</p>
          <p className="mt-2 font-serif text-3xl">{pending}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-widest">Low stock SKUs</p>
          <p className="mt-2 font-serif text-3xl">{low}</p>
        </div>
      </div>
      <h2 className="mt-10 font-serif text-2xl">Recent orders</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {orders.map((o) => (
          <li key={o.id}>
            {o.number} · {o.status} · {formatInr(o.totalPaise)}
          </li>
        ))}
      </ul>
    </div>
  );
}
