import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function JournalIndex() {
  const posts = await prisma.journalPost.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-4xl">Journal</h1>
      <p className="mt-2 text-[var(--muted)]">Drape notes, weave literacy, and atelier finishing.</p>
      <div className="mt-10 space-y-10">
        {posts.map((p) => (
          <Link key={p.id} href={`/journal/${p.slug}`} className="grid gap-4 md:grid-cols-3">
            <div className="relative aspect-[16/10] bg-[var(--ivory-2)] md:col-span-1">
              <Image src={p.image} alt="" fill className="object-cover" />
            </div>
            <div className="md:col-span-2">
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-2 text-[var(--muted)]">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
