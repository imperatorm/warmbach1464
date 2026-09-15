import { sectionOrder, warmbachGallery, type GalleryImage, type GallerySection } from "@/lib/gallery";

/**
 * Where every print lies on the table.
 *
 * The scatter is seeded, not random: the same photograph lands in the same
 * place on every render, on the server and in the browser, so the composition
 * is a fixed thing the visitor can learn rather than a new shuffle each visit.
 * Featured frames sit larger and nearer their region's centre; the rest fall
 * around them under a minimum-distance rule so nothing stacks into a pile.
 */

export type Print = GalleryImage & {
  /** World-space position of the print's centre, in px. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Resting tilt, degrees. */
  rot: number;
  /** Parallax factor — a print further from the eye travels less. */
  depth: number;
  region: GallerySection;
  index: number;
};

export type Region = {
  key: GallerySection;
  label: string;
  cx: number;
  cy: number;
};

const REGION_W = 1680;
const REGION_H = 1220;
/** Two across, two down — the estate laid out as four quarters of one table. */
const GRID: Record<GallerySection, [number, number]> = {
  haus: [0, 0],
  bar: [1, 0],
  brennerei: [0, 1],
  lounge: [1, 1],
};

/** mulberry32 — small, fast, and stable across runtimes. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const WORLD = { w: REGION_W * 2, h: REGION_H * 2 };

export const regions: Region[] = sectionOrder.map(({ key, label }) => {
  const [gx, gy] = GRID[key];
  return { key, label, cx: gx * REGION_W + REGION_W / 2, cy: gy * REGION_H + REGION_H / 2 };
});

export function buildPrints(): Print[] {
  const out: Print[] = [];
  let index = 0;

  for (const region of regions) {
    const items = warmbachGallery.filter((i) => i.section === region.key);
    const rand = rng(region.key.length * 7919 + items.length * 104729);
    const placed: { x: number; y: number; r: number }[] = [];

    // Featured frames first, so they claim the centre before the rest fall in.
    const ordered = [...items].sort((a, b) => Number(b.featured) - Number(a.featured));

    ordered.forEach((img, i) => {
      const featured = img.featured;
      const depth = featured ? 1.06 + rand() * 0.1 : 0.82 + rand() * 0.22;
      const portrait = img.height > img.width;
      const w = Math.round((featured ? 400 : 300) * (portrait ? 0.76 : 1) * (0.9 + depth * 0.18));
      const h = Math.round((w * img.height) / img.width);
      const radius = Math.max(w, h) * 0.62;

      // Rejection sampling: keep drawing a spot until it clears every print
      // already down. Featured frames search a tighter ring near the centre.
      const spread = featured ? 0.2 : 0.38;
      let x = region.cx;
      let y = region.cy;
      for (let attempt = 0; attempt < 90; attempt += 1) {
        const a = rand() * Math.PI * 2;
        // Linear in radius, not in area: the quarter packs toward its middle
        // instead of forming a ring with a hole in it.
        const d = rand() * spread;
        x = region.cx + Math.cos(a) * d * REGION_W;
        y = region.cy + Math.sin(a) * d * REGION_H;
        const clear = placed.every(
          (p) => Math.hypot(p.x - x, p.y - y) > (p.r + radius) * 0.78,
        );
        if (clear) break;
      }
      placed.push({ x, y, r: radius });

      out.push({
        ...img,
        x,
        y,
        w,
        h,
        rot: (rand() - 0.5) * (featured ? 7 : 13),
        depth,
        region: region.key,
        index: index++,
      });
    });
  }

  // Draw order: the deepest prints first, so a near print overlaps a far one.
  return out.sort((a, b) => a.depth - b.depth);
}
