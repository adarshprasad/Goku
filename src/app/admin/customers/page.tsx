import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCustomers() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 80,
    include: { _count: { select: { orders: true } } },
  });
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-4xl">Clients</h1>
      <ul className="mt-8 divide-y divide-[var(--line)]">
        {customers.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm">
            <div>
              <p>{c.name ?? "—"}</p>
              <p className="text-[var(--muted)]">{c.email}</p>
            </div>
            <p>
              {c._count.orders} orders
            </p>
          </li>
        ))}
      </ul>
      <Link href="/admin" className="mt-8 inline-block text-sm underline">
        Back to desk
      </Link>
    </div>
  );
}
