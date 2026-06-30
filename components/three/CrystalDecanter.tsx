"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { CAPRI_700, createCapriGeometry, createCapriLiquidGeometry } from "@/lib/three/capri";
import { ESTATE_COORDS } from "@/lib/three/bottle";
import { makeEngravingTexture } from "@/lib/three/engraving";

const BASE_Y = 0;
const FRONT_Z = CAPRI_700.halfDepth; // z of the flat front face (x=0)
const TOP_Y = CAPRI_700.height / 2;

/**
 * The hero decanter — the real Vetroelite "Capri" flask in the brand's ONYX finish:
 * near-black crystal glass with the product label (cropped from the family's render,
 * public/bottle/label.png) applied to the flat front, and the Hof coordinates embossed
 * underneath. Matches the supplied Onyx product photo.
 *
 * Idle: a gentle oscillation that keeps the wide face toward the viewer. On hover it
 * ramps into a continuous spin. Reduced-motion is handled upstream.
 */
export function CrystalDecanter() {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const spin = useRef(0);
  const vel = useRef(0);

  const glassGeom = useMemo(() => createCapriGeometry(CAPRI_700), []);
  const fillGeom = useMemo(
    // fill stays below the shoulder so it never protrudes through the narrow neck
    () => createCapriLiquidGeometry({ ...CAPRI_700, rings: 30 }, 0.66, 0.94),
    [],
  );

  const labelTex = useTexture("/bottle/label.png");
  labelTex.colorSpace = THREE.SRGBColorSpace;
  labelTex.anisotropy = 8;

  const baseTex = useMemo(
    () => makeEngravingTexture(ESTATE_COORDS, { width: 768, height: 160, fontCss: '500 56px Georgia, serif' }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    // Hover → ramp into a continuous spin; idle → gentle oscillation.
    const targetVel = hovered.current ? 0.9 : 0;
    vel.current += (targetVel - vel.current) * Math.min(1, d * 3);
    spin.current += vel.current * d;
    const oscAmp = 0.3 * (1 - Math.min(1, vel.current / 0.9));
    g.rotation.y = spin.current + Math.sin(t * 0.18) * oscAmp;
    g.position.y = BASE_Y + Math.sin(t * Math.PI * 2 * 0.18) * 0.035;
  });

  return (
    <group ref={group} position={[0, BASE_Y, 0]}>
      {/* Invisible hover-catcher — stable hover, no per-mesh flicker */}
      <mesh
        onPointerOver={() => (hovered.current = true)}
        onPointerOut={() => (hovered.current = false)}
      >
        <boxGeometry args={[2.5, 3.7, 1.6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Dark interior fill — gives the onyx body solidity */}
      <mesh geometry={fillGeom}>
        <meshPhysicalMaterial color="#0a130c" roughness={0.5} metalness={0} />
      </mesh>

      {/* Onyx crystal glass */}
      <mesh geometry={glassGeom}>
        <MeshTransmissionMaterial
          transmission={1}
          ior={1.5}
          thickness={1.0}
          roughness={0.05}
          chromaticAberration={0.01}
          distortion={0}
          temporalDistortion={0}
          color="#0d1410"
          attenuationColor="#070d08"
          attenuationDistance={0.9}
          backside={false}
          samples={6}
          resolution={256}
        />
      </mesh>

      {/* Front label — cropped from the product render */}
      <mesh position={[0, 0.16, FRONT_Z + 0.012]}>
        <planeGeometry args={[0.9, 1.42]} />
        <meshStandardMaterial
          map={labelTex}
          emissiveMap={labelTex}
          emissive="#ffffff"
          emissiveIntensity={0.22}
          roughness={0.62}
          metalness={0}
        />
      </mesh>

      {/* Base embossing — Hof coordinates, readable only from below */}
      <mesh position={[0, -TOP_Y - 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 0.62]} />
        <meshStandardMaterial
          color="#0c130d"
          roughness={0.7}
          metalness={0.2}
          side={THREE.DoubleSide}
          bumpMap={baseTex ?? undefined}
          bumpScale={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}
