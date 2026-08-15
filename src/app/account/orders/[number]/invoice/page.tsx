import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { brand } from "@/lib/brand";
import { formatInr } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";

export default async function InvoicePage({ params }: { params: Promise<{ number: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { number } = await params;
  const order = await prisma.order.findUnique({
    where: { number },
    include: { items: true },
  });
  if (!order || (order.userId && order.userId !== session.user.id && session.user.role !== "ADMIN")) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-12 print:p-0">
      <p className="font-serif text-3xl text-[var(--maroon)]">{brand.name}</p>
      <p className="text-sm">{brand.address}</p>
      <p className="text-sm">GSTIN {brand.gstin}</p>
      <h1 className="mt-8 font-serif text-2xl">Tax invoice {order.invoiceNumber}</h1>
      <p className="text-sm">
        {order.shippingName} · {order.shippingLine1}, {order.shippingCity} {order.shippingPincode}
      </p>
      {order.gstin ? <p className="text-sm">Buyer GSTIN {order.gstin}</p> : null}
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Item</th>
            <th>HSN</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.id} className="border-b border-[var(--line)]">
              <td className="py-2">{i.name}</td>
              <td>{i.hsn}</td>
              <td>{i.quantity}</td>
              <td>{formatInr(i.unitPaise * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="mt-6 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatInr(order.subtotalPaise)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount</dt>
          <dd>− {formatInr(order.discountPaise)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatInr(order.shippingPaise)}</dd>
        </div>
        {order.cgstPaise ? (
          <div className="flex justify-between">
            <dt>CGST</dt>
            <dd>{formatInr(order.cgstPaise)}</dd>
          </div>
        ) : null}
        {order.sgstPaise ? (
          <div className="flex justify-between">
            <dt>SGST</dt>
            <dd>{formatInr(order.sgstPaise)}</dd>
          </div>
        ) : null}
        {order.igstPaise ? (
          <div className="flex justify-between">
            <dt>IGST</dt>
            <dd>{formatInr(order.igstPaise)}</dd>
          </div>
        ) : null}
        {order.codFeePaise ? (
          <div className="flex justify-between">
            <dt>COD fee</dt>
            <dd>{formatInr(order.codFeePaise)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between font-medium">
          <dt>Total</dt>
          <dd>{formatInr(order.totalPaise)}</dd>
        </div>
      </dl>
    </div>
  );
}
