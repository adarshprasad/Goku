import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminReviews() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } });

  async function save(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await prisma.review.update({
      where: { id },
      data: { published: formData.get("published") === "on" },
    });
    revalidatePath("/admin/reviews");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm underline">
        Desk
      </Link>
      <h1 className="mt-3 font-serif text-4xl">Reviews</h1>
      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <form key={review.id} action={save} className="rounded-3xl border border-[var(--line)] p-4">
            <input type="hidden" name="id" value={review.id} />
            <p className="font-serif text-xl">{review.title}</p>
            <p className="text-sm text-[var(--muted)]">
              {review.authorName} · {review.product.name}
            </p>
            <p className="mt-2 text-sm">{review.body}</p>
            <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={review.published} /> Published
            </label>
            <button className="min-h-11 rounded-full bg-[var(--clay)] px-4 text-white">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
