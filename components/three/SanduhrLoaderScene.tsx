"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { SanduhrField } from "./SanduhrField";

/**
 * Canvas wrapper for the loader background. Dynamically imported (ssr:false) so
 * none of three.js sits in the first paint of a page it isn't shown on.
 *
 * The vignette and the warm floor glow are CSS, not a fullscreen quad — the whole
 * scene stays a single points draw call.
 */
export default function SanduhrLoaderScene({
  progress,
  duration = 1500,
  className = "",
}: {
  /** Feed a real load signal here. Omitted → the sand runs over `duration` ms. */
  progress?: number;
  duration?: number;
  className?: string;
}) {
  const [auto, setAuto] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (progress !== undefined) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setAuto(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, duration]);

  const p = progress ?? auto;

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      {/* Stage: bronze green, deepened toward the centre so the Sanduhr still has
          something dark to sit on without leaving the brand's night palette. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 50%, #162116 0%, #1a251a 55%, #1d291d 100%)",
        }}
      />
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        style={{ pointerEvents: "none" }}
      >
        <SanduhrField
          progress={p}
          frozen={reduce}
          // Fewer grains on phones: same read, a third of the fill cost.
          grains={typeof window !== "undefined" && window.innerWidth < 768 ? 4500 : 9000}
        />
      </Canvas>

      {/* Warm pool + edge falloff, both cheap CSS. The pool is anchored on the
          bottom edge so only its upper half is in frame — a wide, soft horizon of
          heat under the Sanduhr rather than a blob behind it. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 92% at 50% 100%, rgba(197,126,91,0.13), transparent 70%)," +
            "radial-gradient(80% 66% at 50% 50%, transparent 50%, rgba(24,34,24,0.78) 100%)",
        }}
      />
    </div>
  );
}
