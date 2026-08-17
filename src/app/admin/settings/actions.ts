"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { brandDefaults, type SiteBrand } from "@/lib/brand";

const TEXT_KEYS = Object.keys(brandDefaults) as (keyof SiteBrand)[];

export async function saveSiteSettings(formData: FormData) {
  await requireStaff();
  const logoFile = formData.get("logoFile");
  const craftFile = formData.get("craftImageFile");
  const logoUrl = await saveUpload(logoFile instanceof File ? logoFile : null, "brand");
  const craftUrl = await saveUpload(craftFile instanceof File ? craftFile : null, "uploads");

  for (const key of TEXT_KEYS) {
    if (key === "logo" && logoUrl) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: logoUrl },
        create: { key, value: logoUrl },
      });
      continue;
    }
    if (key === "craftImage" && craftUrl) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: craftUrl },
        create: { key, value: craftUrl },
      });
      continue;
    }
    const raw = formData.get(key);
    if (typeof raw !== "string") continue;
    await prisma.setting.upsert({
      where: { key },
      update: { value: raw },
      create: { key, value: raw },
    });
  }

  const tagline = String(formData.get("taglineEn") || "");
  if (tagline) {
    await prisma.setting.upsert({
      where: { key: "taglineKn" },
      update: { value: tagline },
      create: { key: "taglineKn", value: tagline },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
