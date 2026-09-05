export function slugify(input: string) {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "item";
}

export function rupeesToPaise(raw: FormDataEntryValue | null) {
  return Math.round(Number(raw || 0) * 100);
}

export function filesFromForm(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((v): v is File => v instanceof File && v.size > 0);
}

export function normalizeSiteUrl(raw: string, fallback = "http://localhost:3000") {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
