import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/addresses");
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  async function save(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const makeDefault = formData.get("isDefault") === "on";
    if (makeDefault) {
      await prisma.address.updateMany({ where: { userId: s.user.id }, data: { isDefault: false } });
    }
    await prisma.address.create({
      data: {
        userId: s.user.id,
        fullName: String(formData.get("fullName")),
        phone: String(formData.get("phone")),
        line1: String(formData.get("line1")),
        line2: String(formData.get("line2") ?? "") || null,
        city: String(formData.get("city")),
        state: String(formData.get("state")),
        pincode: String(formData.get("pincode")),
        country: "IN",
        isDefault: makeDefault || (await prisma.address.count({ where: { userId: s.user.id } })) === 0,
      },
    });
    revalidatePath("/account/addresses");
  }

  async function remove(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    await prisma.address.deleteMany({
      where: { id: String(formData.get("id")), userId: s.user.id },
    });
    revalidatePath("/account/addresses");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-serif text-4xl">Addresses</h1>
      <ul className="mt-8 space-y-4">
        {addresses.length === 0 ? <li className="text-[var(--muted)]">No saved addresses yet.</li> : null}
        {addresses.map((a) => (
          <li key={a.id} className="border border-[var(--line)] p-4 text-sm">
            <p className="font-serif text-lg">
              {a.fullName} {a.isDefault ? "· default" : ""}
            </p>
            <p className="mt-1 text-[var(--muted)]">
              {a.line1}, {a.city} {a.pincode}
            </p>
            <form action={remove} className="mt-2">
              <input type="hidden" name="id" value={a.id} />
              <button className="underline">Remove</button>
            </form>
          </li>
        ))}
      </ul>
      <form action={save} className="mt-10 grid gap-3">
        <h2 className="font-serif text-2xl">Add address</h2>
        <input name="fullName" required placeholder="Full name" className="min-h-11 border border-[var(--line)] px-3" />
        <input name="phone" required placeholder="Phone" className="min-h-11 border border-[var(--line)] px-3" />
        <input name="line1" required placeholder="Address" className="min-h-11 border border-[var(--line)] px-3" />
        <input name="line2" placeholder="Landmark" className="min-h-11 border border-[var(--line)] px-3" />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" required placeholder="City" className="min-h-11 border border-[var(--line)] px-3" />
          <input name="state" required defaultValue="KA" maxLength={3} placeholder="State" className="min-h-11 border border-[var(--line)] px-3" />
        </div>
        <input name="pincode" required pattern="\d{6}" placeholder="Pincode" className="min-h-11 border border-[var(--line)] px-3" />
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" name="isDefault" /> Default
        </label>
        <button className="min-h-12 bg-[var(--maroon)] text-[var(--ivory)]">Save address</button>
      </form>
    </div>
  );
}
