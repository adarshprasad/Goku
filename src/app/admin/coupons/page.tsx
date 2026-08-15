import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminCoupons() {
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

  async function createCoupon(formData: FormData) {
    "use server";
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

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-serif text-4xl">Coupons</h1>
      <form action={createCoupon} className="mt-8 space-y-3">
        <input name="code" required placeholder="CODE" className="min-h-11 w-full border px-3 uppercase" />
        <select name="type" className="min-h-11 w-full border px-2">
          <option value="PERCENT">Percent</option>
          <option value="FIXED">Fixed paise</option>
          <option value="FREE_SHIP">Free shipping</option>
        </select>
        <input name="value" type="number" defaultValue={10} className="min-h-11 w-full border px-3" />
        <input name="min" type="number" placeholder="Min ₹" className="min-h-11 w-full border px-3" />
        <button className="min-h-11 bg-[var(--maroon)] px-4 text-[var(--ivory)]">Create</button>
      </form>
      <ul className="mt-8 space-y-2 text-sm">
        {coupons.map((c) => (
          <li key={c.id}>
            {c.code} · {c.type} {c.value} · used {c.usedCount}
          </li>
        ))}
      </ul>
    </div>
  );
}
