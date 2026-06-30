"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer } from "@react-three/drei";
import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { PostFX } from "./PostFX";

/**
 * 3D-Tiefenschnitt — ein Bohrkern aus vier Erdschichten. Beim Scrollen sinkt der
 * Kern (Humus → Verwitterungsboden → Wildschönauer Schiefer → wasserführende Schicht),
 * sodass die jeweils aktive Schicht in die Bildmitte rückt. Im Schiefer glänzt
 * Kupfererz — der Bogen zur Brennblase.
 *
 * Die Erdschichten tragen eine ruhige Textur: feine horizontale Sediment-Strata über
 * Vertex-Farben (kein Displacement) — sichtbar auf der Wand, ohne die klare Form zu
 * stören. Die Wasserschicht bleibt lichtdurchlässig.
 */
const LAYERS = [
  { key: "humus", color: "#3c2e1d", band: "#4d3a24", rough: 1.0, metal: 0.0 },
  { key: "verwitterung", color: "#4a3a24", band: "#5d4a30", rough: 0.92, metal: 0.0 },
  { key: "schiefer", color: "#39433d", band: "#4a554d", rough: 0.55, metal: 0.25 },
  { key: "wasser", color: "#274a52", band: "#274a52", rough: 0.12, metal: 0.0 },
];
const SEG_H = 1.55;
const N = LAYERS.length;
const TOTAL = SEG_H * N;
const W = 1.85;

/** Clean horizontal mineral strata via vertex colours — no displacement. */
function useStrataGeometry(baseHex: string, bandHex: string) {
  return useMemo(() => {
    const geo = new THREE.BoxGeometry(W, SEG_H, W, 1, 34, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const base = new THREE.Color(baseHex);
    const band = new THREE.Color(bandHex);
    const c = new THREE.Color();
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const lines = 0.5 + 0.5 * Math.sin(y * 30.0); // fine sediment bands
      const slow = 0.5 + 0.5 * Math.sin(y * 4.0 + 1.3); // slow tonal drift
      const t = THREE.MathUtils.clamp(0.38 * lines + 0.24 * slow, 0, 1);
      c.copy(base).lerp(band, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [baseHex, bandHex]);
}

function EarthLayer({ baseHex, bandHex, rough, metal }: { baseHex: string; bandHex: string; rough: number; metal: number }) {
  const geo = useStrataGeometry(baseHex, bandHex);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial vertexColors roughness={rough} metalness={metal} />
    </mesh>
  );
}

function CopperFlecks({ count = 32 }: { count?: number }) {
  // Kupfererz-Einschlüsse, gestreut im Schiefer-Segment (Index 2)
  const segCenterY = TOTAL / 2 - (2 + 0.5) * SEG_H;
  const items = useMemo(() => {
    let seed = 13;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: count }, () => ({
      p: [
        (rnd() - 0.5) * W * 0.84,
        segCenterY + (rnd() - 0.5) * SEG_H * 0.82,
        (rnd() - 0.5) * W * 0.84,
      ] as [number, number, number],
      s: 0.028 + rnd() * 0.05,
      r: [rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI] as [number, number, number],
    }));
  }, [count, segCenterY]);

  return (
    <group>
      {items.map((it, i) => (
        <mesh key={i} position={it.p} rotation={it.r} scale={it.s}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#b87333" metalness={0.92} roughness={0.26} emissive="#5a3414" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Core({ progressRef, reduce }: { progressRef: MutableRefObject<number>; reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;
    // Kern nach oben schieben → tiefere Schichten rücken in die Mitte (= "absinken")
    const targetY = -TOTAL / 2 + SEG_H / 2 + p * (TOTAL - SEG_H);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 4, Math.min(dt, 0.05));
    if (!reduce) g.rotation.y += dt * 0.16;
  });

  return (
    <group ref={group}>
      {LAYERS.map((l, i) => {
        const y = TOTAL / 2 - (i + 0.5) * SEG_H;
        const isWater = l.key === "wasser";
        return (
          <group key={l.key} position={[0, y, 0]}>
            {isWater ? (
              <RoundedBox args={[W, SEG_H, W]} radius={0.05} smoothness={3}>
                <meshPhysicalMaterial
                  color={l.color}
                  roughness={0.12}
                  metalness={0}
                  transmission={0.45}
                  thickness={1.1}
                  transparent
                  opacity={0.94}
                  emissive="#0e2a30"
                  emissiveIntensity={0.45}
                />
              </RoundedBox>
            ) : (
              <EarthLayer baseHex={l.color} bandHex={l.band} rough={l.rough} metal={l.metal} />
            )}
            {l.key === "schiefer" && <CopperFlecks count={reduce ? 18 : 32} />}
          </group>
        );
      })}
    </group>
  );
}

function CoreEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <color attach="background" args={["#0c120e"]} />
      <Lightformer form="rect" intensity={2.0} color="#f3f6ee" position={[-6, 5, 2]} scale={[14, 14, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.4} color="#2f7d4f" position={[0, 1, -7]} scale={[12, 10, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.0} color="#c0916a" position={[6, 0, 3]} scale={[10, 10, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}

export default function TiefenschnittScene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      camera={{ position: [2.7, 0.5, 5.4], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <directionalLight position={[-4, 5, 3]} intensity={2.6} color="#fff1d6" />
      <spotLight position={[0, 2.5, -5]} angle={0.5} penumbra={0.7} decay={0} intensity={1.6} color="#c0916a" />
      <ambientLight intensity={0.22} />
      <Suspense fallback={null}>
        <CoreEnvironment />
        <Core progressRef={progressRef} reduce={reduce} />
      </Suspense>
      <PostFX />
    </Canvas>
  );
}
