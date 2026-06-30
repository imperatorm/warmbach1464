import * as THREE from "three";
import { Tree } from "@dgreenheck/ez-tree";

export type AppleTreeResult = {
  tree: Tree;
  apples: [number, number, number][];
};

/**
 * Builds the tuned realistic apple tree (ez-tree, "Oak Medium" reshaped into an
 * old broad apple tree). Returns the THREE.Group fitted to `targetHeight` with
 * its base at y=0 and x at `posX`, plus a set of world-space apple anchors
 * sampled from the upper crown's leaf vertices. Client-only (ez-tree touches
 * `document`).
 */
export function createAppleTree(targetHeight = 6, posX = 0): AppleTreeResult {
  const t = new Tree();
  t.loadPreset("Oak Medium");

  const o = t.options;
  o.seed = 1464;
  o.branch.levels = 3;
  o.branch.length[0] = 23;
  o.branch.length[1] = 15;
  o.branch.length[2] = 13;
  o.branch.radius[0] = 1.85;
  o.branch.start[1] = 0.22;
  o.branch.children[0] = 4;
  o.branch.children[1] = 7;
  o.branch.children[2] = 7;
  o.branch.angle[1] = 46;
  o.branch.angle[2] = 58;
  o.branch.gnarliness[0] = 0.12;
  o.branch.gnarliness[1] = 0.2;
  o.branch.gnarliness[2] = 0.26;
  o.branch.force.strength = -0.022;
  // keep the preset's oak leaf texture (green); aspen renders autumn-brown
  o.leaves.count = 26;
  o.leaves.size = 1.95;
  o.leaves.start = 0.25;
  o.leaves.tint = 0xc2dc7e; // light fresh spring green

  t.generate();

  const box = new THREE.Box3().setFromObject(t);
  const size = new THREE.Vector3();
  box.getSize(size);
  const s = targetHeight / size.y;
  t.scale.setScalar(s);
  t.position.set(posX, -box.min.y * s, 0);
  t.traverse((obj) => {
    const m = obj as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
  t.updateMatrixWorld(true);

  // Sample apple anchors from leaf vertices in the upper crown (world space).
  const apples: [number, number, number][] = [];
  const leaves = t.leavesMesh;
  const posAttr = leaves?.geometry?.getAttribute("position");
  if (leaves && posAttr) {
    const worldBox = new THREE.Box3().setFromObject(t);
    const yThresh = worldBox.min.y + (worldBox.max.y - worldBox.min.y) * 0.42;
    const v = new THREE.Vector3();
    let tries = 0;
    while (apples.length < 16 && tries < 800) {
      tries++;
      const i = Math.floor(Math.random() * posAttr.count);
      v.fromBufferAttribute(posAttr, i);
      leaves.localToWorld(v);
      if (v.y < yThresh) continue;
      // spread apples out a little so they don't clump on one leaf cluster
      const tooClose = apples.some(
        (a) => Math.hypot(a[0] - v.x, a[1] - v.y, a[2] - v.z) < 0.5,
      );
      if (tooClose) continue;
      apples.push([v.x, v.y, v.z]);
    }
  }

  return { tree: t, apples };
}
