import { getCart, cartTotals } from "@/lib/cart";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout-form";
import { formatInr } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) redirect("/cart");
  const { subtotal } = await cartTotals(cart);
  const session = await auth();
  const address = session?.user?.id
    ? await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { isDefault: "desc" },
      })
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Guest checkout is welcome. Prepaid via Razorpay (UPI, cards, netbanking) or COD where eligible. Payment success is
        confirmed only after the server webhook — or the labeled mock gateway when keys are absent.
      </p>
      <div className="mt-8">
        <CheckoutForm
          email={session?.user?.email ?? ""}
          defaultAddress={address}
          subtotalLabel={formatInr(subtotal)}
        />
      </div>
    </div>
  );
}
