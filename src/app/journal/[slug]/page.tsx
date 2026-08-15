import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.journalPost.findUnique({ where: { slug } });
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--ivory-2)]">
        <Image src={post.image} alt="" fill className="object-cover" />
      </div>
      <h1 className="mt-8 font-serif text-4xl">{post.title}</h1>
      <div className="mt-6 whitespace-pre-line leading-relaxed text-[var(--muted)]">{post.body}</div>
    </article>
  );
}
