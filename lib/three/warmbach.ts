import { BufferGeometry, Float32BufferAttribute, LatheGeometry, Vector2 } from "three";

/**
 * Procedural geometry for the NEW "Warmbach" bottle — an organic, mouth-blown
 * egg / oval body (round cross-section) with a short neck, a flared rounded disc
 * lip, and the signature inward "X-fold" pressed into the front AND back faces.
 *
 * Real-world reference (design portfolio): 143 mm tall × 96 mm wide, ~750 ml,
 * clear mouth-blown glass, wall 2–4 mm. Scaled here to ~3.4 scene-units tall so
 * it fits the existing hero camera framing. The X-fold is fully parametric
 * (depth / spread / centre / arm geometry) so it can be tuned after first look.
 */
export type WarmbachFold = {
  depth: number; // max inward push of the fold (scene units)
  faceSpread: number; // σ of the front/back angular falloff (radians)
  yCenter: number; // yNorm of the X crossing point
  uSpread: number; // lateral normalisation (radians)
  vSpread: number; // vertical normalisation (yNorm)
  slope: number; // diagonal slope of the X arms
  channel: number; // X channel half-width (normalised)
  armWindow: number; // how far the arms reach before fading (normalised)
};

export type WarmbachParams = {
  height: number;
  maxRadius: number;
  rings: number;
  radial: number;
  fold: WarmbachFold;
};

export const WARMBACH_01: WarmbachParams = {
  height: 3.4,
  maxRadius: 1.14, // 96/143 of the height → matches the 143×96 mm proportion
  rings: 224,
  radial: 184,
  fold: {
    depth: 0.2, // a ~17% pressed valley (not a crater); tune on a real GPU
    faceSpread: 0.5,
    yCenter: 0.42, // X crosses on the visual mid-belly, not low off the bulge
    uSpread: 0.62,
    vSpread: 0.3,
    slope: 1.15,
    channel: 0.12,
    armWindow: 0.85,
  },
};

/** Lip top in local space (to seat the stopper / accents). */
export const WARMBACH_LIP_Y = WARMBACH_01.height / 2;

// Radius profile control points: [yNorm, radiusFraction (0..1 of maxRadius)].
// Egg body widest in the lower-middle, a short neck, then a flared rounded lip.
const PROFILE: [number, number][] = [
  [0.0, 0.0],
  [0.03, 0.44],
  [0.08, 0.72],
  [0.16, 0.91],
  [0.3, 1.0], // belly — widest
  [0.45, 0.985],
  [0.58, 0.895],
  [0.68, 0.77],
  [0.76, 0.58],
  [0.82, 0.385],
  [0.85, 0.265],
  [0.875, 0.228], // neck
  [0.9, 0.228],
  [0.925, 0.35], // lip flares out
  [0.95, 0.404], // lip max
  [0.965, 0.4],
  [0.98, 0.315],
  [1.0, 0.21], // lip rounds over to a small mouth
];

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a: number, b: number, x: number) => {
  const u = clamp01((x - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const TAU = Math.PI * 2;

/** Catmull-Rom through the profile control points → a smooth organic radius(yN). */
function profileRadius(yN: number): number {
  const pts = PROFILE;
  const y = clamp01(yN);
  let i = 0;
  while (i < pts.length - 1 && pts[i + 1][0] < y) i++;
  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[Math.max(0, i)];
  const p2 = pts[Math.min(pts.length - 1, i + 1)];
  const p3 = pts[Math.min(pts.length - 1, i + 2)];
  const seg = p2[0] - p1[0] || 1e-6;
  const t = clamp01((y - p1[0]) / seg);
  const t2 = t * t;
  const t3 = t2 * t;
  const r =
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * t +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
  return r < 0 ? 0 : r;
}

function wrapPi(a: number): number {
  while (a > Math.PI) a -= TAU;
  while (a < -Math.PI) a += TAU;
  return a;
}

/** Inward fold depth at (theta, yNorm) — an X-shaped valley on the front & back faces. */
function foldDepth(theta: number, yN: number, f: WarmbachFold): number {
  const dFront = Math.abs(wrapPi(theta - Math.PI / 2)); // +Z faces the camera
  const dBack = Math.abs(wrapPi(theta + Math.PI / 2));
  const latOff = dFront <= dBack ? wrapPi(theta - Math.PI / 2) : wrapPi(theta + Math.PI / 2);
  const aFace = Math.min(dFront, dBack);
  const faceMask = Math.exp(-(aFace * aFace) / (2 * f.faceSpread * f.faceSpread));
  const u = latOff / f.uSpread;
  const w = (yN - f.yCenter) / f.vSpread;
  const norm = Math.sqrt(1 + f.slope * f.slope);
  const d1 = Math.abs(w - f.slope * u) / norm;
  const d2 = Math.abs(w + f.slope * u) / norm;
  const dX = Math.min(d1, d2); // distance to the nearer diagonal → the X channel
  const channel = Math.exp(-(dX * dX) / (2 * f.channel * f.channel));
  const windowF = Math.exp(-(u * u + w * w) / (2 * f.armWindow * f.armWindow));
  // fade the fold to zero below the belly so tuning yCenter/depth can't climb into the radius clamp
  const lowFade = smoothstep(0.04, 0.16, yN);
  return f.depth * faceMask * channel * windowF * lowFade;
}

/** The full glass bottle (closed solid → reads as thick crystal under transmission). */
export function createWarmbachGeometry(p: WarmbachParams = WARMBACH_01): BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const H = p.height;
  const y0 = -H / 2;
  const cols = p.radial + 1;

  for (let i = 0; i <= p.rings; i++) {
    const yN = i / p.rings;
    const r0 = profileRadius(yN) * p.maxRadius;
    const y = y0 + yN * H;
    for (let j = 0; j <= p.radial; j++) {
      const theta = (j / p.radial) * TAU;
      const r = Math.max(0.05, r0 - foldDepth(theta, yN, p.fold));
      positions.push(Math.cos(theta) * r, y, Math.sin(theta) * r);
    }
  }
  for (let i = 0; i < p.rings; i++) {
    for (let j = 0; j < p.radial; j++) {
      const a = i * cols + j;
      const b = a + cols;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  // bottom cap
  const bc = positions.length / 3;
  positions.push(0, y0, 0);
  for (let j = 0; j < p.radial; j++) indices.push(bc, j + 1, j);
  // top cap (closes the mouth → solid crystal read; the stopper covers it)
  const topStart = p.rings * cols;
  const tc = positions.length / 3;
  positions.push(0, y0 + H, 0);
  for (let j = 0; j < p.radial; j++) indices.push(tc, topStart + j, topStart + j + 1);

  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/** The ringed disc stopper that rests on the lip (round → LatheGeometry). */
export function createWarmbachStopper(): BufferGeometry {
  const pts = [
    [0.001, 0.0],
    [0.205, 0.0],
    [0.205, 0.2], // plug side
    [0.2, 0.225],
    [0.255, 0.245],
    [0.46, 0.275], // disc underside
    [0.465, 0.4], // disc side
    [0.45, 0.45], // ring step
    [0.4, 0.455],
    [0.4, 0.49], // second ring
    [0.3, 0.515],
    [0.165, 0.53],
    [0.001, 0.535], // domed top centre
  ].map(([x, y]) => new Vector2(x, y));
  const g = new LatheGeometry(pts, 96);
  g.computeVertexNormals();
  return g;
}
