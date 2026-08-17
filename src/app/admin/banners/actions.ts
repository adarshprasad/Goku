"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin";
import { saveUpload } from "@/lib/uploads";

export async function saveBanner(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id") || "");
  const file = formData.get("image");
  const uploaded = await saveUpload(file instanceof File ? file : null);
  const image = uploaded || String(formData.get("imageUrl") || "");
  const data = {
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    href: String(formData.get("href") || "/shop"),
    image: image || "/brand/tavaru-logo.png",
    active: formData.get("active") === "on",
    sort: Number(formData.get("sort") || 0),
  };
  if (id) await prisma.banner.update({ where: { id }, data });
  else await prisma.banner.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function deleteBanner(formData: FormData) {
  await requireStaff();
  await prisma.banner.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/banners");
}
