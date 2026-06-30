"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import {
  WARMBACH_01,
  createWarmbachGeometry,
  createWarmbachStopper,
} from "@/lib/three/warmbach";

/** Glass tints. "green" = the brand emerald (poster), "clear" = the portfolio glass.
 *  attenuationDistance is long enough that the 2.3u-wide belly glows like a jewel
 *  instead of going near-opaque (council note). */
const TINTS = {
  green: { color: "#dcefe0", attenuationColor: "#2a7d4a", attenuationDistance: 2.2 },
  clear: { color: "#eef4f0", attenuationColor: "#d6e8da", attenuationDistance: 3.6 },
} as const;

const NECK_BASE_Y = -WARMBACH_01.height / 2 + 0.85 * WARMBACH_01.height; // yNorm ≈ 0.85
const STOPPER_Y = -WARMBACH_01.height / 2 + 0.925 * WARMBACH_01.height; // seat on the lip

export function WarmbachBottle({
  tint = "green",
  showStopper = true,
  autoSpin = false,
  reduce = false,
}: {
  tint?: keyof typeof TINTS;
  showStopper?: boolean;
  autoSpin?: boolean;
  reduce?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const glass = useMemo(() => createWarmbachGeometry(WARMBACH_01), []);
  const stopper = useMemo(() => createWarmbachStopper(), []);
  const t = TINTS[tint];

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (autoSpin && !reduce) g.rotation.y += Math.min(delta, 0.05) * 0.25;
    g.position.y = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.18) * 0.03;
  });

  return (
    <group ref={group}>
      {/* The crystal body */}
      <mesh geometry={glass}>
        <MeshTransmissionMaterial
          transmission={1}
          ior={1.52}
          thickness={1.6}
          roughness={0.045}
          chromaticAberration={0.02}
          distortion={0}
          temporalDistortion={0}
          color={t.color}
          attenuationColor={t.attenuationColor}
          attenuationDistance={t.attenuationDistance}
          backside
          samples={6}
          resolution={256}
        />
      </mesh>

      {/* Copper collar at the neck base — major radius clears the glass surface (~0.30) */}
      <mesh position={[0, NECK_BASE_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.024, 16, 100]} />
        <meshStandardMaterial color="#6f4f34" metalness={1} roughness={0.34} />
      </mesh>

      {/* Ringed disc stopper (single-sided transmission — backside off for perf) */}
      {showStopper && (
        <mesh geometry={stopper} position={[0, STOPPER_Y, 0]}>
          <MeshTransmissionMaterial
            transmission={1}
            ior={1.52}
            thickness={0.9}
            roughness={0.05}
            color={t.color}
            attenuationColor={t.attenuationColor}
            attenuationDistance={t.attenuationDistance}
            samples={6}
            resolution={256}
          />
        </mesh>
      )}
    </group>
  );
}
