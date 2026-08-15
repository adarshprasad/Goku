import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ReturnsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/returns");
  const reqs = await prisma.returnRequest.findMany({
    where: { userId: session.user.id },
    include: { order: true },
  });

  async function createReturn(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user) return;
    const number = String(formData.get("number") ?? "");
    const order = await prisma.order.findFirst({
      where: { number, userId: s.user.id },
    });
    if (!order) return;
    await prisma.returnRequest.create({
      data: {
        orderId: order.id,
        userId: s.user.id,
        reason: String(formData.get("reason") ?? ""),
      },
    });
    redirect("/account/returns");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-serif text-4xl">Returns</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        7 days, unused and unstitched only. Stitched blouses and custom pallus are final.
      </p>
      <form action={createReturn} className="mt-8 space-y-3">
        <input name="number" required placeholder="Order number HDK-…" className="min-h-11 w-full border px-3" />
        <textarea name="reason" required placeholder="Reason" className="w-full border px-3 py-2" rows={4} />
        <button className="min-h-11 bg-[var(--maroon)] px-5 text-[var(--ivory)]">Request return</button>
      </form>
      <ul className="mt-8 space-y-3 text-sm">
        {reqs.map((r) => (
          <li key={r.id}>
            {r.order.number} · {r.status} · {r.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
