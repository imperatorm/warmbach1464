import { Vector2 } from "three";

/**
 * Hourglass silhouette — retained verbatim from the prototype.
 * Briefing §4.1: "Du behältst die Geometrie. Du veredelst sie." The shape is the
 * brand's protected Sanduhr design; only the material treatment is elevated. This
 * profile is replaced 1:1 by the glass partner's .glb scan (Riedel Kufstein) later.
 */
export const BOTTLE_PROFILE: ReadonlyArray<readonly [number, number]> = [
  [0.0, -1.6],
  [0.55, -1.6],
  [0.65, -1.5],
  [0.65, -1.1],
  [0.55, -0.7],
  [0.35, -0.3],
  [0.3, 0.0],
  [0.35, 0.3],
  [0.55, 0.7],
  [0.65, 1.1],
  [0.65, 1.4],
  [0.45, 1.55],
  [0.22, 1.6],
  [0.22, 1.85],
  [0.0, 1.85],
];

export const bottleProfilePoints = (): Vector2[] =>
  BOTTLE_PROFILE.map(([x, y]) => new Vector2(x, y));

/** Hof Warmbach coordinates — etched into the base, readable only from below
 *  (brand_memory/00_heritage.md · "Stiller-Luxus-Code"). */
export const ESTATE_COORDS = "47.4486° N · 12.3936° E";

export type EditionVariant = {
  slug: string;
  /** Engraved on the copper belly plaque, e.g. "N° 017 / 300". */
  editionLabel: string;
  /** Engraved on the gold neck capsule, e.g. "W//". */
  capsuleMark: string;
};

/** Founder's Reserve N°1 — the Year-1 anchor, 300 bottles (brand_memory/01_product.md). */
export const HERO_EDITION: EditionVariant = {
  slug: "founders-reserve-n1",
  editionLabel: "N° 017 / 300",
  capsuleMark: "W//",
};
