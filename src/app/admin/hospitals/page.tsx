import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminHospitals() {
  const accounts = await prisma.hospitalAccount.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  async function decide(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const status = String(formData.get("status"));
    const priceTier = String(formData.get("priceTier") ?? "STANDARD");
    const account = await prisma.hospitalAccount.update({
      where: { id },
      data: { status, priceTier },
    });
    await prisma.user.update({
      where: { id: account.userId },
      data: { role: status === "APPROVED" ? "HOSPITAL" : "CUSTOMER" },
    });
    revalidatePath("/admin/hospitals");
    revalidatePath("/hospital");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/admin" className="text-sm underline">
        Desk
      </Link>
      <h1 className="mt-3 font-serif text-4xl">Hospital accounts</h1>
      <div className="mt-8 space-y-4">
        {accounts.length === 0 ? <p className="text-[var(--muted)]">No applications yet.</p> : null}
        {accounts.map((account) => (
          <form key={account.id} action={decide} className="rounded-3xl border border-[var(--line)] p-5">
            <input type="hidden" name="id" value={account.id} />
            <p className="font-serif text-2xl">{account.hospitalName}</p>
            <p className="text-sm text-[var(--muted)]">
              {account.city} · {account.gstin} · {account.contactName} · {account.phone}
            </p>
            <p className="mt-1 text-sm">
              {account.maternityBeds} beds · {account.monthlyBirths} births / month · {account.status} · {account.user.email}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {account.wardLine1}, {account.wardCity} {account.wardState} {account.wardPincode}
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <label className="text-xs">
                Price tier
                <select name="priceTier" defaultValue={account.priceTier} className="mt-1 min-h-11 rounded-xl border px-2">
                  <option value="STANDARD">Standard</option>
                  <option value="VOLUME">Volume</option>
                </select>
              </label>
              <button name="status" value="APPROVED" className="min-h-11 rounded-full bg-[var(--clay)] px-4 text-white">
                Approve
              </button>
              <button name="status" value="REJECTED" className="min-h-11 rounded-full border px-4">
                Reject
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
