"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { brandDefaults, type SiteBrand } from "@/lib/brand";
import { normalizeSiteUrl } from "@/lib/slug";

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
    const value = key === "siteUrl" ? normalizeSiteUrl(raw) : raw;
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
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

export async function changeAdminPassword(formData: FormData) {
  const session = await requireStaff();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You need an atelier login for this.");
  const next = String(formData.get("newPassword") || "");
  if (next.length < 8) throw new Error("Password must be at least 8 characters.");
  const bcrypt = (await import("bcryptjs")).default;
  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
  revalidatePath("/admin/settings");
}
