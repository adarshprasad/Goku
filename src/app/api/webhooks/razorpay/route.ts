import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Razorpay is disabled. Orders go through WhatsApp." }, { status: 410 });
}
