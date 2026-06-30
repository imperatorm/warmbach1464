import * as THREE from "three";

/**
 * Procedural OLD APPLE TREE for the diorama — modelled on the Warmbachhof's real
 * tree: a thick, gnarled trunk that divides low into several twisting scaffold
 * limbs, a broad spreading + drooping crown, and a dense foliage volume. Returns
 * tube-curve limbs (woody structure), a dense foliage point-cloud, apple anchors,
 * and the mirrored root system (kept as glowing lines).
 */
export type Limb = {
  pts: [number, number, number][];
  r0: number;
  r1: number;
};

export type TreeData = {
  limbs: Limb[];
  foliage: Float32Array;
  apples: [number, number, number][];
  rootPositions: Float32Array;
  rootTips: [number, number, number][];
};

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateAppleTree(seed = 7): TreeData {
  const rand = mulberry32(seed);
  const up = new THREE.Vector3(0, 1, 0);
  const down = new THREE.Vector3(0, -1, 0);

  const limbs: Limb[] = [];
  const foliageAnchors: { p: THREE.Vector3; depth: number }[] = [];
  const apples: [number, number, number][] = [];

  const MAX_DEPTH = 4;
  const randAxis = () =>
    new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();

  function grow(
    start: THREE.Vector3,
    dir: THREE.Vector3,
    length: number,
    radius: number,
    depth: number,
  ) {
    // a gnarled, arching curve built from stepped direction changes
    const pts: THREE.Vector3[] = [start.clone()];
    let p = start.clone();
    const d = dir.clone().normalize();
    const STEPS = 4;
    for (let s = 1; s <= STEPS; s++) {
      d.applyAxisAngle(randAxis(), (rand() - 0.5) * 0.55); // gnarl
      const droop = (depth >= 1 ? 0.07 : 0.015) + (s / STEPS) * 0.05 * depth;
      d.lerp(down, droop); // older/outer wood arches over and droops
      if (depth === 0) d.lerp(up, 0.07); // trunk stays upright
      d.normalize();
      p = p.clone().addScaledVector(d, length / STEPS);
      pts.push(p.clone());
    }
    limbs.push({
      pts: pts.map((v) => [v.x, v.y, v.z] as [number, number, number]),
      r0: radius,
      r1: radius * 0.52,
    });

    const end = p;
    const endDir = d.clone();

    // dense foliage hangs on the outer wood
    if (depth >= 2) {
      foliageAnchors.push({ p: end.clone(), depth });
      foliageAnchors.push({ p: pts[STEPS - 1].clone(), depth });
    }
    if (depth >= MAX_DEPTH) {
      if (rand() < 0.5) apples.push([end.x, end.y, end.z]);
      return;
    }

    const n = depth === 0 ? 4 + Math.floor(rand() * 2) : depth === 1 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const cd = endDir.clone();
      const spread = (depth === 0 ? 0.7 : 0.5) + rand() * 0.5;
      cd.applyAxisAngle(randAxis(), spread);
      if (depth === 0) cd.lerp(up, 0.22); // scaffold limbs lift out of the trunk
      cd.normalize();
      grow(end, cd, length * (0.68 + rand() * 0.1), radius * 0.58, depth + 1);
    }
  }

  // the trunk
  grow(new THREE.Vector3(0, 0, 0), up.clone(), 1.25, 0.24, 0);

  // scatter a dense crown around the outer wood
  const fol: number[] = [];
  for (const a of foliageAnchors) {
    const count = a.depth >= 3 ? 30 : 20;
    const spread = a.depth >= 3 ? 0.5 : 0.4;
    for (let k = 0; k < count; k++) {
      // sum of two uniforms ≈ soft bell → clustered, not boxy
      fol.push(
        a.p.x + (rand() - 0.5 + rand() - 0.5) * spread,
        a.p.y + (rand() - 0.5 + rand() - 0.5) * spread,
        a.p.z + (rand() - 0.5 + rand() - 0.5) * spread,
      );
    }
  }

  // mirrored root system (glowing lines), fanning wide toward the spring
  const root: number[] = [];
  const rootTips: [number, number, number][] = [];
  const ROOT_DEPTH = 5;
  (function growRoot(
    pos: THREE.Vector3,
    dir: THREE.Vector3,
    len: number,
    depth: number,
  ) {
    const end = pos.clone().addScaledVector(dir, len);
    root.push(pos.x, pos.y, pos.z, end.x, end.y, end.z);
    if (depth >= ROOT_DEPTH) {
      rootTips.push([end.x, end.y, end.z]);
      return;
    }
    const n = depth < 1 ? 7 : depth < 2 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const axis = randAxis();
      const angle = (depth < 1 ? 0.66 : 0.4) + rand() * 0.5;
      const nd = dir
        .clone()
        .applyAxisAngle(axis, angle)
        .lerp(down, depth < 1 ? 0.08 : 0.16)
        .normalize();
      growRoot(end, nd, len * (0.79 + rand() * 0.1), depth + 1);
    }
  })(new THREE.Vector3(0, 0, 0), down.clone(), 0.95, 0);

  return {
    limbs,
    foliage: new Float32Array(fol),
    apples,
    rootPositions: new Float32Array(root),
    rootTips,
  };
}
