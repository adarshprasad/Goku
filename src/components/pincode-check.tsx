"use client";

import { useState } from "react";
import { formatInr } from "@/lib/utils";

export function PincodeCheck({ subtotalPaise }: { subtotalPaise: number }) {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function check() {
    const res = await fetch(`/api/pincode?pin=${pin}&subtotal=${subtotalPaise}`);
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      eta?: string;
      shippingPaise?: number;
      free?: boolean;
      cod?: boolean;
    };
    if (!data.ok) {
      setMsg(data.error ?? "Could not check pincode");
      return;
    }
    setMsg(
      `${data.eta} · ${data.free ? "Free shipping" : `Shipping ${formatInr(data.shippingPaise ?? 0)}`} · COD ${data.cod ? "available" : "not available"}`,
    );
  }

  return (
    <div className="mt-4">
      <label className="text-xs uppercase tracking-widest text-[var(--muted)]" htmlFor="pin">
        Delivery pincode
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="pin"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="min-h-11 w-32 border border-[var(--line)] bg-white px-3"
          inputMode="numeric"
          autoComplete="postal-code"
        />
        <button type="button" onClick={check} className="min-h-11 border border-[var(--maroon)] px-4 text-sm">
          Check
        </button>
      </div>
      {msg ? <p className="mt-2 text-sm text-[var(--muted)]">{msg}</p> : null}
    </div>
  );
}
