import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { name: "asc" },
  });

  async function save(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const price = Math.round(Number(formData.get("price")) * 100);
    const published = formData.get("published") === "on";
    await prisma.product.update({
      where: { id },
      data: { pricePaise: price, published },
    });
    const variantId = String(formData.get("variantId") ?? "");
    const stock = Number(formData.get("stock"));
    if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock },
      });
    }
    revalidatePath("/admin/products");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-4xl">Catalog</h1>
      <div className="mt-8 space-y-6">
        {products.map((p) => (
          <form key={p.id} action={save} className="grid gap-2 border border-[var(--line)] p-4 md:grid-cols-6 md:items-end">
            <input type="hidden" name="id" value={p.id} />
            <input type="hidden" name="variantId" value={p.variants[0]?.id ?? ""} />
            <p className="md:col-span-2">
              <span className="font-serif text-lg">{p.name}</span>
              <span className="block text-xs text-[var(--muted)]">{p.sku}</span>
            </p>
            <label className="text-xs">
              Price ₹
              <input
                name="price"
                type="number"
                defaultValue={Math.round(p.pricePaise / 100)}
                className="mt-1 min-h-11 w-full border px-2"
              />
            </label>
            <label className="text-xs">
              Stock
              <input
                name="stock"
                type="number"
                defaultValue={p.variants[0]?.stock ?? 0}
                className="mt-1 min-h-11 w-full border px-2"
              />
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={p.published} /> Live
            </label>
            <button className="min-h-11 bg-[var(--maroon)] text-[var(--ivory)]">Save</button>
            <p className="text-xs text-[var(--muted)] md:col-span-6">{formatInr(p.pricePaise)}</p>
          </form>
        ))}
      </div>
    </div>
  );
}
