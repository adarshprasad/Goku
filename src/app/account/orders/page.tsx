import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="mt-8 space-y-6">
        {orders.length === 0 ? <p>No orders yet.</p> : null}
        {orders.map((o) => (
          <div key={o.id} className="border border-[var(--line)] p-5">
            <div className="flex justify-between">
              <p className="font-serif text-xl">{o.number}</p>
              <p>{formatInr(o.totalPaise)}</p>
            </div>
            <p className="text-sm text-[var(--muted)]">
              {o.status} · {o.paymentStatus} · {o.shippingCity}
            </p>
            <ul className="mt-2 text-sm">
              {o.items.map((i) => (
                <li key={i.id}>
                  {i.name} × {i.quantity}
                </li>
              ))}
            </ul>
            {o.invoiceNumber ? (
              <Link href={`/account/orders/${o.number}/invoice`} className="mt-3 inline-block text-sm underline">
                GST invoice
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
