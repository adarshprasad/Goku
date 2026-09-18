"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatInr } from "@/lib/utils";

type CheckoutFormProps = {
  email: string;
  loggedIn: boolean;
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

type Quote = {
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  codFeePaise: number;
  totalPaise: number;
  couponError?: string;
  codError?: string;
  couponApplied?: string | null;
};

export function CheckoutForm({ email, loggedIn, defaultAddress, subtotalLabel }: CheckoutFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mockNotice, setMockNotice] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pincode, setPincode] = useState(defaultAddress?.pincode ?? "");
  const [state, setState] = useState(defaultAddress?.state ?? "KA");
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) return;
    const t = setTimeout(async () => {
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode, state, coupon, method }),
      });
      const data = (await res.json()) as Quote & { error?: string };
      if (res.ok) setQuote(data);
    }, 250);
    return () => clearTimeout(t);
  }, [pincode, state, coupon, method]);

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
      giftWrap: fd.get("giftWrap") === "on",
      saveAddress: fd.get("saveAddress") === "on",
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
        name: data.name ?? "Huduku",
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
          <input
            name="state"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3"
          />
        </label>
        <label className="text-sm">
          Pincode
          <input
            name="pincode"
            required
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3"
          />
        </label>
        <label className="text-sm">
          GSTIN on invoice (optional)
          <input name="gstin" className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3" />
        </label>
        <label className="text-sm sm:col-span-2">
          Coupon
          <input
            name="coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="HUDUKU10"
            className="mt-1 min-h-11 w-full border border-[var(--line)] bg-white px-3 uppercase"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Notes (blouse stitching, gift message)
          <textarea name="notes" rows={3} className="mt-1 w-full border border-[var(--line)] bg-white px-3 py-2" />
        </label>
      </fieldset>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" name="giftWrap" /> Gift wrap this order (atelier tissue + note)
      </label>
      {loggedIn ? (
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" name="saveAddress" defaultChecked /> Save this address to my account
        </label>
      ) : null}
      <fieldset className="space-y-2">
        <legend className="text-xs uppercase tracking-widest text-[var(--gold-deep)]">Pay</legend>
        <label className="flex min-h-11 items-center gap-2">
          <input type="radio" name="method" value="RAZORPAY" checked={method === "RAZORPAY"} onChange={() => setMethod("RAZORPAY")} />
          UPI / cards / netbanking (Razorpay — mock if keys missing)
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input type="radio" name="method" value="COD" checked={method === "COD"} onChange={() => setMethod("COD")} />
          Cash on delivery (India, eligible pincodes, ₹49 fee)
        </label>
      </fieldset>
      {quote ? (
        <dl className="space-y-1 border border-[var(--line)] p-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatInr(quote.subtotalPaise)}</dd>
          </div>
          {quote.discountPaise > 0 ? (
            <div className="flex justify-between">
              <dt>Coupon {quote.couponApplied}</dt>
              <dd>−{formatInr(quote.discountPaise)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{quote.shippingPaise === 0 ? "Free" : formatInr(quote.shippingPaise)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>GST</dt>
            <dd>{formatInr(quote.taxPaise)}</dd>
          </div>
          {quote.codFeePaise > 0 ? (
            <div className="flex justify-between">
              <dt>COD fee</dt>
              <dd>{formatInr(quote.codFeePaise)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between font-medium">
            <dt>Total</dt>
            <dd>{formatInr(quote.totalPaise)}</dd>
          </div>
          {quote.couponError ? <p className="text-red-800">{quote.couponError}</p> : null}
          {quote.codError ? <p className="text-red-800">{quote.codError}</p> : null}
        </dl>
      ) : null}
      {mockNotice ? <p className="text-sm text-[var(--gold-deep)]">{mockNotice}</p> : null}
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
