"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { saveUpload } from "@/lib/uploads";

export async function saveCollection(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const file = formData.get("image");
  const uploaded = await saveUpload(file instanceof File ? file : null);
  const existing = String(formData.get("imageUrl") || "");
  const image = uploaded || existing;
  const data = {
    name,
    slug: slugify(String(formData.get("slug") || name)),
    tagline: String(formData.get("tagline") || ""),
    description: String(formData.get("description") || ""),
    image: image || "/brand/tavaru-logo.png",
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
  if (id) await prisma.collection.update({ where: { id }, data });
  else await prisma.collection.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
}

export async function deleteCollection(formData: FormData) {
  await requireStaff();
  await prisma.collection.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/collections");
}
