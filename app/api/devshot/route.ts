import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * DEV-ONLY utility to (re)generate the hero LCP still from the live canvas.
 * The browser captures `canvas.toDataURL('image/webp')` and POSTs it here; we
 * decode and write public/hero-still.webp. Disabled in production. Useful to
 * re-shoot the still whenever the scene changes (real fonts, HDR, or the glass
 * partner's .glb). Writes only that one fixed path, accepts only webp.
 */
export const runtime = "nodejs";

const PREFIX = "data:image/webp;base64,";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev only" }, { status: 403 });
  }
  const { dataUrl } = (await req.json()) as { dataUrl?: unknown };
  if (typeof dataUrl !== "string" || !dataUrl.startsWith(PREFIX)) {
    return NextResponse.json({ error: "expected a webp data URL" }, { status: 400 });
  }
  const buf = Buffer.from(dataUrl.slice(PREFIX.length), "base64");
  const dir = path.join(process.cwd(), "public");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "hero-still.webp"), buf);
  return NextResponse.json({ ok: true, bytes: buf.length });
}
