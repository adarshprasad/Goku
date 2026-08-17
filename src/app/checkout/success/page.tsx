import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: number } = await searchParams;
  if (!number) notFound();
  const order = await prisma.order.findUnique({
    where: { number },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Namaskara</p>
      <h1 className="mt-3 font-serif text-4xl">Order {order.number}</h1>
      <p className="mt-4 text-[var(--muted)]">
        {order.paymentMethod === "COD"
          ? "Cash on delivery confirmed. We have reserved stock."
          : "Payment recorded. A GST invoice will follow by email."}
      </p>
      <p className="mt-2 text-lg">{formatInr(order.totalPaise)}</p>
      <ul className="mt-6 text-left text-sm text-[var(--muted)]">
        {order.items.map((i) => (
          <li key={i.id}>
            {i.name} × {i.quantity}
          </li>
        ))}
      </ul>
      <Link href="/account/orders" className="mt-8 inline-flex min-h-11 items-center underline">
        View in account
      </Link>
    </div>
  );
}
