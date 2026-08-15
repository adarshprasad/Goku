import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        include: { product: { include: { images: { orderBy: { sortOrder: "asc" } } } } },
      },
    },
  });
  if (!collection) notFound();
  return (
    <div>
      <div className="relative h-72 bg-[var(--maroon-deep)]">
        <Image src={collection.image} alt="" fill className="object-cover opacity-50" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 text-[var(--ivory)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">{collection.tagline}</p>
          <h1 className="font-serif text-5xl">{collection.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--ivory)]/80">{collection.description}</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-12 md:grid-cols-4">
        {collection.products.map((cp) => (
          <ProductCard key={cp.productId} product={cp.product} />
        ))}
      </div>
    </div>
  );
}
