"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { saveUpload } from "@/lib/uploads";

export async function saveJournal(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const file = formData.get("image");
  const uploaded = await saveUpload(file instanceof File ? file : null);
  const image = uploaded || String(formData.get("imageUrl") || "") || "/brand/tavaru-logo.png";
  const data = {
    title,
    slug: slugify(String(formData.get("slug") || title)),
    excerpt: String(formData.get("excerpt") || ""),
    body: String(formData.get("body") || ""),
    image,
  };
  if (id) await prisma.journalPost.update({ where: { id }, data });
  else await prisma.journalPost.create({ data });
  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
}

export async function deleteJournal(formData: FormData) {
  await requireStaff();
  await prisma.journalPost.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
}
