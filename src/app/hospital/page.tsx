import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";
import { parseContents, parsePriceBreaks } from "@/lib/pricing";
import { addToCart, reorderLast } from "@/app/actions/cart";

export const metadata = { title: "Hospital orders" };

export default async function HospitalPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const account = session?.user?.id
    ? await prisma.hospitalAccount.findUnique({ where: { userId: session.user.id } })
    : null;
  const approved = account?.status === "APPROVED";

  async function apply(formData: FormData) {
    "use server";
    const hospitalName = String(formData.get("hospitalName") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const gstin = String(formData.get("gstin") ?? "").trim().toUpperCase();
    const contactName = String(formData.get("contactName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const maternityBeds = Number(formData.get("maternityBeds") ?? 0);
    const monthlyBirths = Number(formData.get("monthlyBirths") ?? 0);
    const wardLine1 = String(formData.get("wardLine1") ?? "").trim();
    const wardCity = String(formData.get("wardCity") ?? city).trim();
    const wardState = String(formData.get("wardState") ?? "KA").trim().toUpperCase();
    const wardPincode = String(formData.get("wardPincode") ?? "");

    if (!hospitalName || !email || password.length < 8 || !/^\d{6}$/.test(wardPincode)) {
      redirect("/hospital?error=1");
    }
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin)) {
      redirect("/hospital?error=gst");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const existing = await prisma.user.findUnique({ where: { email } });
    const user =
      existing ??
      (await prisma.user.create({
        data: { email, name: contactName, phone, passwordHash, role: "CUSTOMER", gstin },
      }));
    if (existing && !existing.passwordHash) {
      await prisma.user.update({ where: { id: existing.id }, data: { passwordHash, phone, gstin } });
    }

    await prisma.hospitalAccount.upsert({
      where: { userId: user.id },
      update: {
        hospitalName,
        city,
        gstin,
        contactName,
        phone,
        maternityBeds,
        monthlyBirths,
        wardLine1,
        wardCity,
        wardState,
        wardPincode,
        status: "PENDING",
      },
      create: {
        userId: user.id,
        hospitalName,
        city,
        gstin,
        contactName,
        phone,
        maternityBeds,
        monthlyBirths,
        wardLine1,
        wardCity,
        wardState,
        wardPincode,
      },
    });
    redirect("/hospital?sent=1");
  }

  const products = approved
    ? await prisma.product.findMany({
        where: { published: true, OR: [{ audience: "hospital" }, { hospitalOnly: true }, { priceBreaks: { not: "[]" } }] },
        include: { variants: true },
        orderBy: { name: "asc" },
      })
    : [];

  const lastOrder = approved && session?.user?.id
    ? await prisma.order.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      })
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--clay)]">Maternity wards</p>
      <h1 className="mt-2 font-serif text-5xl">Hospital orders</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Pre-washed newborn sets, packed for the ward. After approval you see bulk rates, place a standing quantity, and download a GST invoice.
      </p>

      {sp.sent ? (
        <p className="mt-6 rounded-2xl bg-[var(--sand)] px-4 py-3 text-sm">Application received. We will approve it from the admin desk.</p>
      ) : null}
      {sp.error ? (
        <p className="mt-6 rounded-2xl bg-[var(--blush)] px-4 py-3 text-sm">Check the GSTIN, PIN code, and use a password of at least 8 characters.</p>
      ) : null}

      {account && !approved ? (
        <p className="mt-6 rounded-2xl border border-[var(--line)] px-4 py-3 text-sm">
          {account.hospitalName} is {account.status.toLowerCase()}. Bulk rates stay hidden until approval.
        </p>
      ) : null}

      {approved && account ? (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl">{account.hospitalName}</h2>
              <p className="text-sm text-[var(--muted)]">
                Tier {account.priceTier} · Ward {account.wardLine1}, {account.wardCity} {account.wardPincode}
              </p>
            </div>
            <form action={reorderLast}>
              <button className="min-h-11 rounded-full bg-[var(--clay)] px-5 text-sm text-white" disabled={!lastOrder}>
                Reorder last kit
              </button>
            </form>
          </div>
          {lastOrder ? (
            <p className="mt-3 text-sm">
              Last order {lastOrder.number} · {formatInr(lastOrder.totalPaise)} ·{" "}
              <Link className="underline" href={`/account/orders/${lastOrder.number}/invoice`}>
                GST invoice
              </Link>
            </p>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">No previous order yet. Build this month’s kit below.</p>
          )}

          <h3 className="mt-10 font-serif text-2xl">Kit builder</h3>
          <div className="mt-4 space-y-4">
            {products.map((product) => {
              const pieces = parseContents(product.contents);
              const breaks = parsePriceBreaks(product.priceBreaks);
              const variant = product.variants[0];
              return (
                <form key={product.id} action={addToCart} className="rounded-3xl border border-[var(--line)] p-5">
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="variantId" value={variant?.id ?? ""} />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-serif text-xl">{product.name}</h4>
                      <p className="text-sm text-[var(--muted)]">List {formatInr(product.pricePaise)} · min {product.minOrderQty}</p>
                    </div>
                    <label className="text-sm">
                      Sets
                      <input
                        name="quantity"
                        type="number"
                        min={product.minOrderQty}
                        defaultValue={product.minOrderQty}
                        className="ml-2 min-h-11 w-24 rounded-xl border px-2"
                      />
                    </label>
                  </div>
                  {pieces.length > 0 ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">{pieces.map((p) => `${p.qty} ${p.name}`).join(" · ")}</p>
                  ) : null}
                  {breaks.length > 0 ? (
                    <p className="mt-2 text-sm">
                      {breaks.map((b) => `${b.minQty}+ ${formatInr(b.pricePaise)}`).join(" · ")}
                    </p>
                  ) : null}
                  <button className="mt-4 min-h-11 rounded-full border border-[var(--clay)] px-4 text-sm" disabled={!variant || variant.stock < 1}>
                    {variant && variant.stock > 0 ? "Add to this month’s order" : "Out of stock"}
                  </button>
                </form>
              );
            })}
          </div>
          <Link href="/cart" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--ink)] px-6 text-white">
            Review bag & checkout
          </Link>
        </section>
      ) : (
        <form action={apply} className="mt-10 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Hospital name
            <input name="hospitalName" required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            City
            <input name="city" required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            GSTIN
            <input name="gstin" required placeholder="29AAAAA0000A1Z5" className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            Contact name
            <input name="contactName" required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            Phone
            <input name="phone" required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            Work email
            <input name="email" type="email" required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            Password
            <input name="password" type="password" required minLength={8} className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            Maternity beds
            <input name="maternityBeds" type="number" min={1} required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            Expected births / month
            <input name="monthlyBirths" type="number" min={1} required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm md:col-span-2">
            Ward delivery address
            <input name="wardLine1" required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            Ward city
            <input name="wardCity" required className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            State code
            <input name="wardState" required defaultValue="KA" maxLength={3} className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <label className="text-sm">
            PIN code
            <input name="wardPincode" required pattern="\d{6}" className="mt-1 min-h-11 w-full rounded-xl border px-3" />
          </label>
          <button className="min-h-12 rounded-full bg-[var(--clay)] px-6 text-white md:col-span-2">Apply for a hospital account</button>
        </form>
      )}
    </div>
  );
}
