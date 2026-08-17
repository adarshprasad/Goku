import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX = 8 * 1024 * 1024;

export async function saveUpload(file: File | null | undefined, folder = "uploads"): Promise<string | null> {
  if (!file || !file.size) return null;
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Please upload a JPEG, PNG, WebP, or GIF.");
  if (file.size > MAX) throw new Error("Images must be 8 MB or smaller.");
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/${folder}/${name}`;
}

export async function saveUploads(list: File[], folder = "uploads"): Promise<string[]> {
  const urls: string[] = [];
  for (const file of list) {
    const url = await saveUpload(file, folder);
    if (url) urls.push(url);
  }
  return urls;
}
