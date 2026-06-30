"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Tree } from "@dgreenheck/ez-tree";

/**
 * TEST scene — a photorealistic procedural apple tree (ez-tree) in an overcast
 * alpine daylight, on grass, with soft shadows. Standalone so the look can be
 * judged against the real photo before deciding how to bring it into the site.
 */
function AppleTree() {
  const tree = useMemo(() => {
    const t = new Tree();
    t.loadPreset("Oak Medium");

    // Reshape into an old, broad, gnarled apple tree
    const o = t.options;
    o.seed = 1464;
    o.branch.levels = 3;
    o.branch.length[0] = 23; // tall, clear trunk → taller-than-wide crown
    o.branch.length[1] = 15;
    o.branch.length[2] = 13;
    o.branch.radius[0] = 1.85; // thick gnarled trunk
    o.branch.start[1] = 0.22; // limbs split low
    o.branch.children[0] = 4; // a few strong scaffold limbs
    o.branch.children[1] = 7; // many fine sub-branches → twiggy, airy
    o.branch.children[2] = 7;
    o.branch.angle[1] = 46; // upright, oval crown (not flat-wide)
    o.branch.angle[2] = 58;
    o.branch.gnarliness[0] = 0.12; // gnarled
    o.branch.gnarliness[1] = 0.2;
    o.branch.gnarliness[2] = 0.26;
    o.branch.force.strength = -0.022; // outer branches droop
    // keep the preset's oak leaf texture (green); aspen renders autumn-brown
    o.leaves.count = 26; // airy but even — some sky shows through
    o.leaves.size = 1.95; // smallish leaves
    o.leaves.start = 0.25;
    o.leaves.tint = 0xc2dc7e; // lighter fresh spring green

    t.generate();

    // Fit to ~6 units tall, base on the ground
    const box = new THREE.Box3().setFromObject(t);
    const size = new THREE.Vector3();
    box.getSize(size);
    const s = 6 / size.y;
    t.scale.setScalar(s);
    t.position.y = -box.min.y * s;

    t.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return t;
  }, []);

  useFrame((state) => {
    try {
      tree.update(state.clock.elapsedTime);
    } catch {
      /* wind update is optional */
    }
  });

  return <primitive object={tree} />;
}

export default function TreeTestScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 3.5, 13], fov: 42 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#c6cdd4"]} />
      <fog attach="fog" args={["#c6cdd4", 26, 70]} />

      <hemisphereLight args={["#dde4ea", "#5e6b34", 1.35]} />
      <directionalLight
        position={[9, 17, 8]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0005}
      />

      <Suspense fallback={null}>
        <AppleTree />
      </Suspense>

      {/* grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#566b2f" roughness={1} />
      </mesh>

      <OrbitControls
        target={[0, 3, 0]}
        enablePan={false}
        minDistance={6}
        maxDistance={32}
        maxPolarAngle={Math.PI / 2 - 0.03}
      />
    </Canvas>
  );
}
