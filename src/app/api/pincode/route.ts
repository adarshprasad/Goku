import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { codEligible, shippingForPincode } from "@/lib/money";

export async function GET(req: NextRequest) {
  const pin = req.nextUrl.searchParams.get("pin") ?? "";
  const sub = Number(req.nextUrl.searchParams.get("subtotal") ?? 0);
  const parsed = z.string().regex(/^\d{6}$/).safeParse(pin);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a 6-digit pincode." }, { status: 400 });
  }
  const shipping = shippingForPincode(pin, Number.isFinite(sub) ? sub : 0);
  const cod = codEligible(pin, 1);
  return NextResponse.json({
    ok: true,
    pincode: pin,
    eta: pin.startsWith("56") ? "2–4 days" : "4–7 days",
    shippingPaise: shipping,
    free: shipping === 0,
    cod: cod.ok,
    codReason: cod.reason ?? null,
  });
}
