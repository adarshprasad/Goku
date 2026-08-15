import { auth } from "@/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export default async function WishlistPage() {
  const session = await auth();
  const token = (await cookies()).get("huduku_wish")?.value;
  const items = await prisma.wishlistItem.findMany({
    where: session?.user?.id ? { userId: session.user.id } : { token: token ?? "__none__" },
    include: { product: { include: { images: { orderBy: { sortOrder: "asc" } } } } },
  });
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl">Wishlist</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-[var(--muted)]">Save drapes while you decide on a pallu.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((i) => (
            <ProductCard key={i.id} product={i.product} />
          ))}
        </div>
      )}
    </div>
  );
}
