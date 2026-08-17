import { prisma } from "@/lib/prisma";
import { saveCollection, deleteCollection } from "./actions";

export default async function AdminCollections() {
  const collections = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">Collections</h1>
      <form action={saveCollection} className="mt-8 space-y-3 border border-[var(--line)] p-5">
        <p className="font-serif text-xl">New collection</p>
        <input name="name" required placeholder="Name" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="slug" placeholder="url-slug" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="tagline" placeholder="Tagline" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <textarea name="description" placeholder="Description" className="w-full border border-[var(--line)] px-3 py-2" />
        <input name="sortOrder" type="number" defaultValue={0} className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
        <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Create</button>
      </form>
      <div className="mt-10 space-y-8">
        {collections.map((c) => (
          <form key={c.id} action={saveCollection} className="space-y-3 border border-[var(--line)] p-5">
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="imageUrl" value={c.image} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt="" className="h-28 w-24 object-cover" />
            <input name="name" defaultValue={c.name} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="slug" defaultValue={c.slug} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="tagline" defaultValue={c.tagline} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <textarea name="description" defaultValue={c.description} className="w-full border border-[var(--line)] px-3 py-2" />
            <input name="sortOrder" type="number" defaultValue={c.sortOrder} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
            <div className="flex gap-3">
              <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Save</button>
            </div>
          </form>
        ))}
      </div>
      <div className="mt-6 space-y-2">
        {collections.map((c) => (
          <form key={`del-${c.id}`} action={deleteCollection}>
            <input type="hidden" name="id" value={c.id} />
            <button className="text-xs text-[var(--muted)] underline">Remove {c.name}</button>
          </form>
        ))}
      </div>
    </div>
  );
}
