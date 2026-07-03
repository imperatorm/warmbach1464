"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { inSphere } from "maath/random";
import * as THREE from "three";

/**
 * Gold dust motes (briefing §4.2): ~800 points, additive, opacity 0.3, very slow
 * Brownian drift. No bokeh masses. Distributed in a sphere via maath, animated by
 * a slow multi-axis rotation that reads as suspended drift.
 */
export function GoldDust({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // fill a hollow-ish sphere; keep motes off the dead center of frame
    inSphere(arr, { radius: 6 });
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.018;
    ref.current.rotation.x += delta * 0.006;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#c57e5b"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
