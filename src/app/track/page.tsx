"use client";

import { useState } from "react";
import { formatInr } from "@/lib/utils";

type Tracked = {
  number: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalPaise: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  city: string;
  items: { name: string; quantity: number }[];
  events: { type: string; message: string; at: string }[];
};

export default function TrackPage() {
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Tracked | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: String(fd.get("number")),
        email: String(fd.get("email")),
      }),
    });
    const data = (await res.json()) as Tracked & { error?: string };
    if (!res.ok) {
      setOrder(null);
      setError(data.error ?? "Could not find that order.");
      return;
    }
    setOrder(data);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-serif text-4xl">Track an order</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Use the order number from your confirmation and the email you checked out with.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input name="number" required placeholder="HDK-…" className="min-h-11 w-full border border-[var(--line)] px-3 uppercase" />
        <input name="email" type="email" required placeholder="Email" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <button className="min-h-12 w-full bg-[var(--maroon)] text-[var(--ivory)]">Look up</button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-800">{error}</p> : null}
      {order ? (
        <div className="mt-10 border border-[var(--line)] p-5">
          <p className="font-serif text-2xl">{order.number}</p>
          <p className="text-sm text-[var(--muted)]">
            {order.status} · {order.paymentStatus} · {formatInr(order.totalPaise)} · {order.city}
          </p>
          {order.trackingNumber ? (
            <p className="mt-2 text-sm">
              AWB {order.trackingNumber}
              {order.trackingUrl ? (
                <>
                  {" "}
                  ·{" "}
                  <a href={order.trackingUrl} className="underline" target="_blank" rel="noreferrer">
                    Carrier
                  </a>
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted)]">Not handed to a courier yet.</p>
          )}
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((i) => (
              <li key={i.name}>
                {i.name} × {i.quantity}
              </li>
            ))}
          </ul>
          <ol className="mt-6 space-y-2 text-sm text-[var(--muted)]">
            {order.events.map((ev) => (
              <li key={ev.at + ev.message}>
                {new Date(ev.at).toLocaleString("en-IN")} — {ev.message}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
