import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });

  async function updateStatus(formData: FormData) {
    "use server";
    const session = await auth();
    const id = String(formData.get("id"));
    const status = String(formData.get("status"));
    const trackingNumber = String(formData.get("trackingNumber") || "") || null;
    const trackingUrl = String(formData.get("trackingUrl") || "") || null;
    await prisma.order.update({ where: { id }, data: { status, trackingNumber, trackingUrl } });
    await prisma.orderEvent.create({
      data: { orderId: id, type: "STATUS", message: `Status → ${status}` },
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id,
        action: "ORDER_STATUS",
        entity: "Order",
        entityId: id,
        meta: JSON.stringify({ status }),
      },
    });
    revalidatePath("/admin/orders");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <form key={o.id} action={updateStatus} className="border border-[var(--line)] p-4">
            <input type="hidden" name="id" value={o.id} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-serif text-xl">{o.number}</p>
                <p className="text-sm text-[var(--muted)]">
                  {o.email} · {o.paymentMethod} · {o.paymentStatus} · {formatInr(o.totalPaise)}
                </p>
              </div>
              <select name="status" defaultValue={o.status} className="min-h-11 border border-[var(--line)] px-2">
                {["PENDING", "PAID", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                name="trackingNumber"
                defaultValue={o.trackingNumber ?? ""}
                placeholder="Tracking no."
                className="min-h-11 border border-[var(--line)] px-2"
              />
              <input
                name="trackingUrl"
                defaultValue={o.trackingUrl ?? ""}
                placeholder="Tracking URL"
                className="min-h-11 min-w-[12rem] border border-[var(--line)] px-2"
              />
              <button className="min-h-11 border border-[var(--line)] px-4">Update</button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
