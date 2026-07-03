"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural "alpine night" environment (PLAN D4) — no external .hdr file.
 * Built like a photographer's lighting tent: LARGE soft panels, not narrow bright
 * strips. Narrow sources streak ("tiger-stripe") through clear curved glass; big
 * softboxes give clean, even gradient reflections. Baked once (`frames={1}`).
 * Swap path: `useEnvironment({ files: "/alpine-night.hdr" })`.
 */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <color attach="background" args={["#060606"]} />
      {/* Large soft key, upper-left */}
      <Lightformer form="rect" intensity={2.2} color="#fff1d6" position={[-6, 5, 1]} scale={[15, 15, 1]} target={[0, 0, 0]} />
      {/* Large soft fill, right */}
      <Lightformer form="rect" intensity={1.1} color="#cdbb9a" position={[7, 0, 3]} scale={[12, 12, 1]} target={[0, 0, 0]} />
      {/* Wide warm back-glow for an even gold rim (no streak) */}
      <Lightformer form="rect" intensity={1.4} color="#c57e5b" position={[0, 2, -7]} scale={[11, 9, 1]} target={[0, 0, 0]} />
      {/* Gentle top */}
      <Lightformer form="rect" intensity={0.7} color="#e8e2d2" position={[0, 9, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 9, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}
