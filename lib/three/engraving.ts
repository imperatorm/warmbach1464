import { CanvasTexture, LinearFilter, NoColorSpace } from "three";

type EngravingOpts = {
  width?: number;
  height?: number;
  fontCss?: string;
};

/**
 * Render text to an offscreen canvas for use as a bumpMap on the metal parts —
 * black glyphs on mid-grey read as a recessed engraving (briefing §4.1:
 * "Normal-Map mit gravierter Editionsnummer"). Done this way rather than with
 * troika/<Text> so nothing fetches a default font from a CDN at runtime — the
 * decanter stays fully self-contained and offline-safe.
 *
 * Client-only (needs `document`); returns null during SSR so callers can guard.
 */
export function makeEngravingTexture(
  text: string,
  opts: EngravingOpts = {},
): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const {
    width = 512,
    height = 256,
    fontCss = '600 92px Georgia, "Times New Roman", serif',
  } = opts;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080"; // flat metal baseline
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#000000"; // recessed glyphs
  ctx.font = fontCss;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2 + 4);

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = NoColorSpace; // bump data is linear, not sRGB color
  tex.anisotropy = 4;
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  return tex;
}
