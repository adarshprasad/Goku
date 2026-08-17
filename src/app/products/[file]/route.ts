import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const SAFE = /^[A-Za-z0-9._-]+\.(jpe?g|png|webp|gif)$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!SAFE.test(file)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const abs = path.join(process.cwd(), "public", "products", file);
  try {
    const buf = await readFile(abs);
    const lower = file.toLowerCase();
    const type = lower.endsWith(".png")
      ? "image/png"
      : lower.endsWith(".webp")
        ? "image/webp"
        : lower.endsWith(".gif")
          ? "image/gif"
          : "image/jpeg";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
