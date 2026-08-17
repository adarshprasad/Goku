import { prisma } from "@/lib/prisma";
import { saveBanner, deleteBanner } from "./actions";

export default async function AdminBanners() {
  const banners = await prisma.banner.findMany({ orderBy: { sort: "asc" } });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">Home banners</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">The first active banner sits behind the forest-green hero at 25% opacity.</p>
      <form action={saveBanner} className="mt-8 space-y-3 border border-[var(--line)] p-5">
        <p className="font-serif text-xl">New banner</p>
        <input name="title" required placeholder="Title" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="subtitle" placeholder="Subtitle" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="href" defaultValue="/shop" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="sort" type="number" defaultValue={0} className="min-h-11 w-full border border-[var(--line)] px-3" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked /> Active
        </label>
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
        <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Create</button>
      </form>
      <div className="mt-10 space-y-8">
        {banners.map((b) => (
          <form key={b.id} action={saveBanner} className="space-y-3 border border-[var(--line)] p-5">
            <input type="hidden" name="id" value={b.id} />
            <input type="hidden" name="imageUrl" value={b.image} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt="" className="h-32 w-full object-cover" />
            <input name="title" defaultValue={b.title} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="subtitle" defaultValue={b.subtitle} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="href" defaultValue={b.href} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="sort" type="number" defaultValue={b.sort} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked={b.active} /> Active
            </label>
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
            <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Save</button>
          </form>
        ))}
      </div>
      {banners.map((b) => (
        <form key={`del-${b.id}`} action={deleteBanner} className="mt-2">
          <input type="hidden" name="id" value={b.id} />
          <button className="text-xs underline">Remove {b.title}</button>
        </form>
      ))}
    </div>
  );
}
