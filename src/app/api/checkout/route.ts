import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { applyCoupon, type CouponInput } from "@/lib/coupons";
import { shippingForPincode, gstRateForApparel } from "@/lib/money";
import { getBrand } from "@/lib/brand";
import { buildWhatsAppOrderText, waMe } from "@/lib/whatsapp-order";

const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  fullName: z.string().min(2),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2).max(3),
  pincode: z.string().regex(/^\d{6}$/),
  country: z.string().default("IN"),
  gstin: z.string().optional(),
  coupon: z.string().optional(),
  notes: z.string().optional(),
});

function nextOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TAV-${ymd}-${rand}`;
}

export async function POST(req: NextRequest) {
  const brand = await getBrand();
  const json = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const session = await auth();
  const cart = await getOrCreateCart();
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const { subtotal, lines } = await cartTotals(cart);
  let couponRow = null;
  if (data.coupon) {
    couponRow = await prisma.coupon.findUnique({ where: { code: data.coupon.trim().toUpperCase() } });
  }
  let shipping = shippingForPincode(data.pincode, subtotal);
  const couponInput: CouponInput | null = couponRow
    ? {
        code: couponRow.code,
        type: couponRow.type as CouponInput["type"],
        value: couponRow.value,
        minSubtotal: couponRow.minSubtotal,
        maxDiscount: couponRow.maxDiscount,
        active: couponRow.active,
        startsAt: couponRow.startsAt,
        endsAt: couponRow.endsAt,
        usageLimit: couponRow.usageLimit,
        usedCount: couponRow.usedCount,
      }
    : null;
  const applied = applyCoupon(couponInput, subtotal, shipping);
  if (applied.error) {
    return NextResponse.json({ error: applied.error }, { status: 400 });
  }
  shipping = applied.shippingPaise;
  const discount = applied.discountPaise;

  const taxableLines = lines.map((l) => ({
    unitPaise: l.unit + l.extra,
    quantity: l.item.quantity,
  }));
  const subAfter = subtotal - discount;
  let taxPaise = 0;
  const origin = brand.originState;
  for (const l of taxableLines) {
    const share = subtotal === 0 ? 0 : (l.unitPaise * l.quantity) / subtotal;
    const lineTaxable = Math.round(subAfter * share);
    const rate = gstRateForApparel(l.unitPaise);
    taxPaise += Math.round((lineTaxable * rate) / 100);
  }
  const intra = data.state.toUpperCase() === origin.toUpperCase();
  const gst = intra
    ? {
        taxPaise,
        cgstPaise: Math.floor(taxPaise / 2),
        sgstPaise: taxPaise - Math.floor(taxPaise / 2),
        igstPaise: 0,
      }
    : { taxPaise, cgstPaise: 0, sgstPaise: 0, igstPaise: taxPaise };

  const total = subAfter + shipping + gst.taxPaise;
  const number = nextOrderNumber();

  const order = await prisma.order.create({
    data: {
      number,
      userId: session?.user?.id,
      email: data.email,
      phone: data.phone,
      status: "PENDING",
      paymentStatus: "UNPAID",
      paymentMethod: "WHATSAPP",
      gateway: "WHATSAPP",
      subtotalPaise: subtotal,
      discountPaise: discount,
      shippingPaise: shipping,
      taxPaise: gst.taxPaise,
      cgstPaise: gst.cgstPaise,
      sgstPaise: gst.sgstPaise,
      igstPaise: gst.igstPaise,
      codFeePaise: 0,
      totalPaise: total,
      couponId: couponRow?.id,
      couponCode: couponRow?.code,
      gstin: data.gstin,
      shippingName: data.fullName,
      shippingPhone: data.phone,
      shippingLine1: data.line1,
      shippingLine2: data.line2,
      shippingCity: data.city,
      shippingState: data.state,
      shippingPincode: data.pincode,
      shippingCountry: data.country,
      notes: data.notes,
      items: {
        create: lines.map((l) => ({
          productId: l.item.productId,
          variantId: l.item.variantId,
          name: l.item.product.name,
          sku: l.item.variant?.sku ?? l.item.product.sku,
          hsn: l.item.product.hsn,
          quantity: l.item.quantity,
          unitPaise: l.unit + l.extra,
          addons: l.item.addons,
          note: l.item.note,
        })),
      },
      events: {
        create: { type: "CREATED", message: "Order sent to WhatsApp. Awaiting confirmation." },
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  const text = buildWhatsAppOrderText({
    brandName: brand.name,
    number: order.number,
    fullName: data.fullName,
    phone: data.phone,
    address: [data.line1, data.line2].filter(Boolean).join(", "),
    pincode: data.pincode,
    city: data.city,
    state: data.state,
    notes: data.notes,
    coupon: couponRow?.code,
    totalPaise: total,
    items: lines.map((l) => ({
      name: l.item.product.name,
      quantity: l.item.quantity,
      sku: l.item.variant?.sku ?? l.item.product.sku,
    })),
    siteUrl: brand.siteUrl,
  });
  const waUrl = waMe(brand.whatsapp, text);

  return NextResponse.json({
    mode: "whatsapp",
    orderId: order.id,
    number: order.number,
    waUrl,
    redirect: `/checkout/success?order=${order.number}`,
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, pay: "whatsapp" });
}
