import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin";

export default async function AdminCoupons() {
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

  async function createCoupon(formData: FormData) {
    "use server";
    await requireStaff();
    await prisma.coupon.create({
      data: {
        code: String(formData.get("code")).trim().toUpperCase(),
        type: String(formData.get("type")),
        value: Number(formData.get("value")),
        minSubtotal: Math.round(Number(formData.get("min") ?? 0) * 100),
        active: true,
      },
    });
    revalidatePath("/admin/coupons");
  }

  async function toggleCoupon(formData: FormData) {
    "use server";
    await requireStaff();
    const id = String(formData.get("id"));
    const active = formData.get("active") === "true";
    await prisma.coupon.update({ where: { id }, data: { active: !active } });
    revalidatePath("/admin/coupons");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-serif text-4xl">Coupons</h1>
      <form action={createCoupon} className="mt-8 space-y-3">
        <input name="code" required placeholder="CODE" className="min-h-11 w-full border border-[var(--line)] px-3 uppercase" />
        <select name="type" className="min-h-11 w-full border border-[var(--line)] px-2">
          <option value="PERCENT">Percent</option>
          <option value="FIXED">Fixed paise</option>
          <option value="FREE_SHIP">Free shipping</option>
        </select>
        <input name="value" type="number" defaultValue={10} className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="min" type="number" placeholder="Min ₹" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <button className="min-h-11 bg-[var(--forest)] px-4 text-[var(--ivory)]">Create</button>
      </form>
      <ul className="mt-8 space-y-3 text-sm">
        {coupons.map((c) => (
          <li key={c.id} className="flex items-center justify-between border border-[var(--line)] px-3 py-3">
            <span>
              {c.code} · {c.type} {c.value} · used {c.usedCount} · {c.active ? "on" : "off"}
            </span>
            <form action={toggleCoupon}>
              <input type="hidden" name="id" value={c.id} />
              <input type="hidden" name="active" value={String(c.active)} />
              <button className="underline">{c.active ? "Pause" : "Resume"}</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
