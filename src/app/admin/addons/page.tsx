import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin";
import { rupeesToPaise } from "@/lib/slug";

export default async function AdminAddons() {
  const addons = await prisma.addon.findMany({ orderBy: { name: "asc" } });

  async function save(formData: FormData) {
    "use server";
    await requireStaff();
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const data = {
      name,
      slug,
      description: String(formData.get("description") || ""),
      pricePaise: rupeesToPaise(formData.get("price")),
      sku: String(formData.get("sku") || `ADD-${slug}`).toUpperCase(),
    };
    if (id) await prisma.addon.update({ where: { id }, data });
    else await prisma.addon.create({ data });
    revalidatePath("/admin/addons");
    revalidatePath("/shop");
  }

  async function remove(formData: FormData) {
    "use server";
    await requireStaff();
    await prisma.addon.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath("/admin/addons");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">Finishing services</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Fall, pico, blouse stitching — shown on each product page.</p>
      <form action={save} className="mt-8 space-y-3 border border-[var(--line)] p-5">
        <p className="font-serif text-xl">Add service</p>
        <input name="name" required placeholder="Name" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="slug" placeholder="url-slug" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="sku" placeholder="SKU" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="price" type="number" required placeholder="Price ₹" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="description" placeholder="Description" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Create</button>
      </form>
      <div className="mt-8 space-y-6">
        {addons.map((a) => (
          <form key={a.id} action={save} className="space-y-2 border border-[var(--line)] p-4">
            <input type="hidden" name="id" value={a.id} />
            <input name="name" defaultValue={a.name} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="slug" defaultValue={a.slug} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="sku" defaultValue={a.sku} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="price" type="number" defaultValue={Math.round(a.pricePaise / 100)} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="description" defaultValue={a.description} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Save</button>
          </form>
        ))}
      </div>
      {addons.map((a) => (
        <form key={`del-${a.id}`} action={remove} className="mt-2">
          <input type="hidden" name="id" value={a.id} />
          <button className="text-xs underline">Remove {a.name}</button>
        </form>
      ))}
    </div>
  );
}
