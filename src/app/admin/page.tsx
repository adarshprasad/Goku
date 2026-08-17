import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatInr } from "@/lib/utils";
import { auth } from "@/auth";

export default async function AdminHome() {
  const session = await auth();
  const [sales, pending, low, orders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalPaise: true },
      where: { paymentStatus: { in: ["PAID", "COD_PENDING"] } },
    }),
    prisma.order.count({ where: { paymentMethod: "COD", paymentStatus: "COD_PENDING" } }),
    prisma.productVariant.count({ where: { stock: { lte: 2 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl">Atelier desk</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Signed in as {session?.user?.email}. Change the name, logo, photographs, catalog, and copy from the links above.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border border-[var(--line)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Sales captured</p>
          <p className="mt-2 font-serif text-3xl">{formatInr(sales._sum.totalPaise ?? 0)}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Pending COD</p>
          <p className="mt-2 font-serif text-3xl">{pending}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Low stock SKUs</p>
          <p className="mt-2 font-serif text-3xl">{low}</p>
        </div>
      </div>
      <h2 className="mt-12 font-serif text-2xl">Recent orders</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href="/admin/orders" className="hover:underline">
              {o.number} · {o.status} · {formatInr(o.totalPaise)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
