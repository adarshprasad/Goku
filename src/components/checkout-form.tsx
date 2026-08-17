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
  const [mockNotice, setMockNotice] = useState<string | null>(null);

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
      method: String(fd.get("method")),
      notes: String(fd.get("notes") ?? "") || undefined,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as {
      error?: unknown;
      mode?: string;
      orderId?: string;
      number?: string;
      redirect?: string;
      notice?: string;
      razorpayOrderId?: string;
      amount?: number;
      key?: string;
      name?: string;
    };
    if (!res.ok) {
      setPending(false);
      setError(typeof data.error === "string" ? data.error : "Could not place order.");
      return;
    }

    if (data.mode === "cod" && data.redirect) {
      router.push(data.redirect);
      return;
    }

    if (data.mode === "razorpay" && data.key && data.razorpayOrderId) {
      await openRazorpay({
        key: data.key,
        amount: data.amount ?? 0,
        orderId: data.razorpayOrderId,
        name: data.name ?? "Tavaru",
        email: payload.email,
        phone: payload.phone,
        successPath: `/checkout/success?order=${data.number}`,
      });
      setPending(false);
      return;
    }

    if (data.mode === "mock" && data.orderId) {
      setMockNotice(data.notice ?? "Mock payment");
      const done = await fetch("/api/checkout/mock-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId }),
      });
      const body = (await done.json()) as { redirect?: string; error?: string };
      setPending(false);
      if (body.redirect) router.push(body.redirect);
      else setError(body.error ?? "Mock payment failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <p className="text-sm text-[var(--muted)]">Bag {subtotalLabel} before shipping & GST.</p>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Email
          <input name="email" type="email" required defaultValue={email} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm">
          Phone
          <input name="phone" required defaultValue={defaultAddress?.phone ?? ""} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm sm:col-span-2">
          Full name
          <input name="fullName" required defaultValue={defaultAddress?.fullName ?? ""} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm sm:col-span-2">
          Address
          <input name="line1" required defaultValue={defaultAddress?.line1 ?? ""} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm sm:col-span-2">
          Apartment / landmark
          <input name="line2" defaultValue={defaultAddress?.line2 ?? ""} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm">
          City
          <input name="city" required defaultValue={defaultAddress?.city ?? ""} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm">
          State code
          <input name="state" required defaultValue={defaultAddress?.state ?? "KA"} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm">
          Pincode
          <input name="pincode" required defaultValue={defaultAddress?.pincode ?? ""} className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm">
          GSTIN on invoice (optional)
          <input name="gstin" className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm sm:col-span-2">
          Coupon
          <input name="coupon" placeholder="HUDUKU10" className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3 uppercase" />
        </label>
        <label className="text-sm sm:col-span-2">
          Notes (blouse stitching, gift message)
          <textarea name="notes" rows={3} className="mt-1 w-full border border-[var(--line)] bg-white px-3 py-2" />
        </label>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-xs uppercase tracking-widest text-[var(--muted)]">Pay</legend>
        <label className="flex min-h-11 items-center gap-2">
          <input type="radio" name="method" value="RAZORPAY" defaultChecked />
          UPI / cards / netbanking (Razorpay — mock if keys missing)
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input type="radio" name="method" value="COD" />
          Cash on delivery (India, eligible pincodes, ₹49 fee)
        </label>
      </fieldset>
      {mockNotice ? <p className="text-sm text-[var(--muted)]">{mockNotice}</p> : null}
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button
        disabled={pending}
        className="min-h-12 w-full bg-[var(--maroon)] text-[var(--ivory)] disabled:opacity-60"
      >
        {pending ? "Placing…" : "Place order"}
      </button>
    </form>
  );
}

async function openRazorpay(opts: {
  key: string;
  amount: number;
  orderId: string;
  name: string;
  email: string;
  phone: string;
  successPath: string;
}) {
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  const Razorpay = (
    window as unknown as {
      Razorpay: new (o: Record<string, unknown>) => { open: () => void };
    }
  ).Razorpay;
  const rzp = new Razorpay({
    key: opts.key,
    amount: opts.amount,
    currency: "INR",
    name: opts.name,
    order_id: opts.orderId,
    prefill: { email: opts.email, contact: opts.phone },
    handler() {
      window.location.href = opts.successPath;
    },
  });
  rzp.open();
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Razorpay failed to load"));
    document.body.appendChild(s);
  });
}

