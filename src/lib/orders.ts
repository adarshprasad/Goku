import { prisma } from "@/lib/prisma";
import { gstRateForApparel, splitGst } from "@/lib/money";

export async function decrementStockAndMarkPaid(orderId: string, gatewayPaymentId?: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === "PAID") return order;

    for (const item of order.items) {
      if (!item.variantId) continue;
      const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
      if (!variant || variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.sku}`);
      }
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const invoiceNumber = `INV-${order.number}`;
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: order.paymentMethod === "COD" ? "CONFIRMED" : "PAID",
        paymentStatus: order.paymentMethod === "COD" ? "COD_PENDING" : "PAID",
        gatewayPaymentId: gatewayPaymentId ?? order.gatewayPaymentId,
        invoiceNumber,
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId,
        type: "PAYMENT",
        message:
          order.paymentMethod === "COD"
            ? "COD confirmed. Stock reserved."
            : "Payment verified. Stock decremented.",
      },
    });

    await tx.payment.create({
      data: {
        orderId,
        amountPaise: order.totalPaise,
        status: order.paymentMethod === "COD" ? "COD_PENDING" : "CAPTURED",
        gateway: order.gateway,
      },
    });

    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return updated;
  });
}

export function taxableFromItems(
  items: { unitPaise: number; quantity: number }[],
  discountPaise: number,
) {
  const subtotal = items.reduce((s, i) => s + i.unitPaise * i.quantity, 0);
  const ratio = subtotal === 0 ? 0 : 1 - discountPaise / subtotal;
  let tax = 0;
  for (const i of items) {
    const line = Math.round(i.unitPaise * i.quantity * ratio);
    const rate = gstRateForApparel(i.unitPaise);
    tax += Math.round((line * rate) / 100);
  }
  return tax;
}

export { splitGst };
