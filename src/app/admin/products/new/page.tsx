import { prisma } from "@/lib/prisma";
import { ProductEditor } from "../product-form";

export default async function NewProductPage() {
  const collections = await prisma.collection.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">New drape</h1>
      <ProductEditor collections={collections} />
    </div>
  );
}
