import { getCart, cartTotals, parseAddons } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { updateCartItem } from "@/app/actions/cart";
import Link from "next/link";
import Image from "next/image";

export default async function CartPage() {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-serif text-4xl">Bag</h1>
        <p className="mt-8 text-[var(--muted)]">
          Your bag is empty. <Link href="/shop" className="underline">Shop drapes</Link>
        </p>
      </div>
    );
  }
  const { subtotal, lines, addons } = await cartTotals(cart);
  const addonNames = new Map(addons.map((a) => [a.slug, a.name]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-4xl">Bag</h1>
      {lines.length === 0 ? (
        <p className="mt-8 text-[var(--muted)]">
          Your bag is empty. <Link href="/shop" className="underline">Shop drapes</Link>
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {lines.map(({ item, line }) => (
            <div key={item.id} className="flex gap-4 border-b border-[var(--line)] pb-6">
              <div className="relative h-36 w-28 shrink-0 bg-[var(--ivory-2)]">
                {item.product.images[0] ? (
                  <Image src={item.product.images[0].url} alt="" fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1">
                <Link href={`/product/${item.product.slug}`} className="font-serif text-xl">
                  {item.product.name}
                </Link>
                <p className="text-sm text-[var(--muted)]">{item.variant?.name}</p>
                <p className="text-sm">
                  {parseAddons(item.addons)
                    .map((s) => addonNames.get(s))
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="mt-2">{formatInr(line)}</p>
                <form action={updateCartItem} className="mt-3 flex items-center gap-2">
                  <input type="hidden" name="id" value={item.id} />
                  <input
                    name="quantity"
                    type="number"
                    min={0}
                    defaultValue={item.quantity}
                    className="min-h-11 w-20 border border-[var(--line)] px-2"
                  />
                  <button className="text-sm underline">Update</button>
                </form>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <p className="text-lg">Subtotal {formatInr(subtotal)}</p>
            <Link href="/checkout" className="inline-flex min-h-12 items-center bg-[var(--maroon)] px-6 text-[var(--ivory)]">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
