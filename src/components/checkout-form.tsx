"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutFormProps = {
  email: string;
  defaultAddress?: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    pincode: string;
  } | null;
  subtotalLabel: string;
};

export function CheckoutForm({ email, defaultAddress, subtotalLabel }: CheckoutFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      fullName: String(fd.get("fullName")),
      line1: String(fd.get("line1")),
      line2: String(fd.get("line2") ?? ""),
      city: String(fd.get("city")),
      state: String(fd.get("state")),
      pincode: String(fd.get("pincode")),
      country: "IN",
      gstin: String(fd.get("gstin") ?? "") || undefined,
      coupon: String(fd.get("coupon") ?? "") || undefined,
      notes: String(fd.get("notes") ?? "") || undefined,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as {
      error?: unknown;
      waUrl?: string;
      redirect?: string;
    };
    if (!res.ok) {
      setPending(false);
      setError(typeof data.error === "string" ? data.error : "Could not place order.");
      return;
    }
    if (data.waUrl) {
      window.location.href = data.waUrl;
      return;
    }
    if (data.redirect) router.push(data.redirect);
    setPending(false);
  }

  const field = "mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Bag {subtotalLabel} before shipping. You will pay on WhatsApp — UPI or transfer with the atelier. No cards on this site.
      </p>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Email
          <input name="email" type="email" required defaultValue={email} className={field} />
        </label>
        <label className="text-sm">
          WhatsApp phone
          <input name="phone" required defaultValue={defaultAddress?.phone ?? ""} className={field} />
        </label>
        <label className="text-sm sm:col-span-2">
          Full name
          <input name="fullName" required defaultValue={defaultAddress?.fullName ?? ""} className={field} />
        </label>
        <label className="text-sm sm:col-span-2">
          Address
          <input name="line1" required defaultValue={defaultAddress?.line1 ?? ""} className={field} />
        </label>
        <label className="text-sm sm:col-span-2">
          Apartment / landmark
          <input name="line2" defaultValue={defaultAddress?.line2 ?? ""} className={field} />
        </label>
        <label className="text-sm">
          City
          <input name="city" required defaultValue={defaultAddress?.city ?? ""} className={field} />
        </label>
        <label className="text-sm">
          State code
          <input name="state" required defaultValue={defaultAddress?.state ?? "KA"} className={field} />
        </label>
        <label className="text-sm">
          Pincode
          <input name="pincode" required defaultValue={defaultAddress?.pincode ?? ""} className={field} />
        </label>
        <label className="text-sm">
          GSTIN on invoice (optional)
          <input name="gstin" className={field} />
        </label>
        <label className="text-sm sm:col-span-2">
          Coupon
          <input name="coupon" placeholder="Optional" className={`${field} uppercase`} />
        </label>
        <label className="text-sm sm:col-span-2">
          Notes (blouse stitching, gift message)
          <textarea name="notes" rows={3} className="mt-1 w-full border border-[var(--line)] bg-white px-3 py-2" />
        </label>
      </fieldset>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button
        disabled={pending}
        className="min-h-12 w-full bg-[var(--forest)] text-[var(--ivory)] disabled:opacity-60"
      >
        {pending ? "Opening WhatsApp…" : "Order on WhatsApp"}
      </button>
    </form>
  );
}
