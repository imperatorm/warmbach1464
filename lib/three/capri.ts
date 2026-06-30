import { BufferGeometry, Float32BufferAttribute } from "three";

/**
 * Procedural geometry for the Vetroelite "Capri" bottle — the real vessel for
 * 1464byW. It is a flat, square flask (wide front, shallow depth) with softly
 * rounded vertical edges, a gently domed shoulder, and a short bar-top neck.
 *
 * A lathe can't make it (it isn't round), so we loft a superellipse cross-section
 * up the height: a rounded rectangle through the body, morphing (squareness → 2,
 * size → neck radius) across the shoulder into a circular neck. Proportions match
 * the 700 mL Capri: 168 mm tall · 113 mm wide · 65 mm deep (→ scene units below).
 */
export type CapriParams = {
  height: number; // total height, scene units
  halfWidth: number; // x half-extent of the body (the wide face)
  halfDepth: number; // z half-extent (the shallow face)
  neckRadius: number;
  squareness: number; // superellipse exponent n (2 = ellipse, large = rectangle)
  bodyTop: number; // yNorm where the straight body ends / shoulder begins
  shoulderTop: number; // yNorm where the shoulder ends / neck begins
  radial: number; // points around each ring
  rings: number; // height samples
};

/** 700 mL Capri at ~3.4 scene-units tall (113/168 and 65/168 of height). */
export const CAPRI_700: CapriParams = {
  height: 3.4,
  halfWidth: 1.143,
  halfDepth: 0.658,
  neckRadius: 0.3,
  squareness: 4.5,
  bodyTop: 0.7,
  shoulderTop: 0.88,
  radial: 128,
  rings: 160,
};

const smooth = (u: number) => u * u * (3 - 2 * u);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Superellipse point at parameter t∈[0,1) for half-sizes ax/az and exponent n. */
function superXZ(t: number, ax: number, az: number, n: number): [number, number] {
  const a = t * Math.PI * 2;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const e = 2 / n;
  const x = ax * Math.sign(c) * Math.pow(Math.abs(c), e);
  const z = az * Math.sign(s) * Math.pow(Math.abs(s), e);
  return [x, z];
}

function section(yN: number, p: CapriParams): { ax: number; az: number; n: number } {
  if (yN <= p.bodyTop) return { ax: p.halfWidth, az: p.halfDepth, n: p.squareness };
  if (yN >= p.shoulderTop) {
    // round neck, with a subtle bar-top bead near the very top
    let r = p.neckRadius;
    const lipStart = 0.95;
    if (yN > lipStart) r = p.neckRadius * (1 + 0.13 * Math.sin(((yN - lipStart) / (1 - lipStart)) * Math.PI));
    return { ax: r, az: r, n: 2 };
  }
  const u = smooth((yN - p.bodyTop) / (p.shoulderTop - p.bodyTop));
  return {
    ax: lerp(p.halfWidth, p.neckRadius, u),
    az: lerp(p.halfDepth, p.neckRadius, u),
    n: lerp(p.squareness, 2, u),
  };
}

function buildRings(
  p: CapriParams,
  yStart: number,
  yEnd: number,
  inset: number,
  sectionAt: (yN: number) => { ax: number; az: number; n: number },
): BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const H = p.height;
  const y0 = -H / 2;
  const cols = p.radial + 1;

  for (let i = 0; i <= p.rings; i++) {
    const yN = lerp(yStart, yEnd, i / p.rings);
    const s = sectionAt(yN);
    const y = y0 + yN * H;
    for (let j = 0; j <= p.radial; j++) {
      const [x, z] = superXZ(j / p.radial, s.ax * inset, s.az * inset, s.n);
      positions.push(x, y, z);
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
  const baseC = positions.length / 3;
  positions.push(0, y0 + yStart * H, 0);
  for (let j = 0; j < p.radial; j++) indices.push(baseC, j + 1, j);
  // top cap
  const topStart = p.rings * cols;
  const topC = positions.length / 3;
  positions.push(0, y0 + yEnd * H, 0);
  for (let j = 0; j < p.radial; j++) indices.push(topC, topStart + j, topStart + j + 1);

  const geom = new BufferGeometry();
  geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

/** The full glass bottle (closed solid — reads as thick crystal under transmission). */
export function createCapriGeometry(p: CapriParams = CAPRI_700): BufferGeometry {
  return buildRings(p, 0, 1, 1, (yN) => section(yN, p));
}

/** The spirit inside: body cross-section only, inset from the wall, up to a fill line. */
export function createCapriLiquidGeometry(p: CapriParams = CAPRI_700, fillNorm = 0.66, inset = 0.9): BufferGeometry {
  return buildRings(p, 0.012, fillNorm, inset, () => ({
    ax: p.halfWidth,
    az: p.halfDepth,
    n: p.squareness,
  }));
}
