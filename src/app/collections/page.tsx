import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function CollectionsIndex() {
  const collections = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl">Collections</h1>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.slug}`}>
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory-2)]">
              <Image src={c.image} alt="" fill className="object-cover" />
            </div>
            <h2 className="mt-3 font-serif text-2xl">{c.name}</h2>
            <p className="text-sm text-[var(--muted)]">{c.tagline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
