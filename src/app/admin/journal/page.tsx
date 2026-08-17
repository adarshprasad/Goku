import { prisma } from "@/lib/prisma";
import { saveJournal, deleteJournal } from "./actions";

export default async function AdminJournal() {
  const posts = await prisma.journalPost.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">Journal</h1>
      <form action={saveJournal} className="mt-8 space-y-3 border border-[var(--line)] p-5">
        <p className="font-serif text-xl">New note</p>
        <input name="title" required placeholder="Title" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="slug" placeholder="url-slug" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="excerpt" placeholder="Short excerpt" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <textarea name="body" rows={8} placeholder="Body" className="w-full border border-[var(--line)] px-3 py-2" />
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
        <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Publish</button>
      </form>
      <div className="mt-10 space-y-8">
        {posts.map((p) => (
          <form key={p.id} action={saveJournal} className="space-y-3 border border-[var(--line)] p-5">
            <input type="hidden" name="id" value={p.id} />
            <input type="hidden" name="imageUrl" value={p.image} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="h-32 w-full object-cover" />
            <input name="title" defaultValue={p.title} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="slug" defaultValue={p.slug} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <input name="excerpt" defaultValue={p.excerpt} className="min-h-11 w-full border border-[var(--line)] px-3" />
            <textarea name="body" rows={8} defaultValue={p.body} className="w-full border border-[var(--line)] px-3 py-2" />
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
            <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Save</button>
          </form>
        ))}
      </div>
      {posts.map((p) => (
        <form key={`del-${p.id}`} action={deleteJournal} className="mt-2">
          <input type="hidden" name="id" value={p.id} />
          <button className="text-xs underline">Remove {p.title}</button>
        </form>
      ))}
    </div>
  );
}
