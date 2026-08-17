import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductEditor } from "../product-form";
import { deleteProduct } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } }, variants: true, collections: true },
    }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-4xl">Edit drape</h1>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button className="text-sm underline">Remove</button>
        </form>
      </div>
      <ProductEditor
        collections={collections}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          type: product.type,
          description: product.description,
          craftStory: product.craftStory,
          artisanNote: product.artisanNote ?? "",
          giTag: product.giTag ?? "",
          pricePaise: product.pricePaise,
          mrpPaise: product.mrpPaise,
          hsn: product.hsn,
          weave: product.weave,
          fabric: product.fabric,
          work: product.work,
          occasion: product.occasion,
          color: product.color,
          motif: product.motif ?? "",
          border: product.border ?? "",
          pallu: product.pallu ?? "",
          lengthMeters: product.lengthMeters,
          blousePiece: product.blousePiece,
          weightFeel: product.weightFeel,
          care: product.care,
          featured: product.featured,
          published: product.published,
          madeToOrder: product.madeToOrder,
          stock: product.variants[0]?.stock ?? 0,
          variantId: product.variants[0]?.id ?? "",
          collectionIds: product.collections.map((c) => c.collectionId),
          images: product.images,
        }}
      />
    </div>
  );
}
