"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { CrystalDecanter } from "./CrystalDecanter";
import { SceneLighting } from "./SceneLighting";
import { StudioEnvironment } from "./StudioEnvironment";
import { GoldDust } from "./GoldDust";
import { PostFX } from "./PostFX";

/** Fires once the suspended resources (environment, material buffers) have mounted —
 *  the signal HeroSection uses to cross-fade from the WebP still to the live scene. */
function SceneReady({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

/** Pull the camera back on narrow / portrait viewports so the bottle keeps
 *  comfortable margins on phones — it otherwise renders edge-to-edge. */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, 0, aspect >= 1 ? 7.3 : 7.3 * (1 + (1 - aspect)));
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function HeroBottleScene({
  onReady,
  active = true,
}: {
  onReady?: () => void;
  active?: boolean;
}) {
  return (
    <Canvas
      flat // NoToneMapping on the renderer; ACES is applied in PostFX exactly once
      shadows
      // Pause the render loop when the hero scrolls out of view — the page below
      // stays smooth instead of competing with the bottle's GPU work.
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.3], fov: 35 }}
      gl={{
        antialias: false, // EffectComposer handles AA (multisampling)
        alpha: true,
        powerPreference: "high-performance",
        // dev-only: enables WebP still capture via canvas.toDataURL (/api/devshot).
        preserveDrawingBuffer: process.env.NODE_ENV !== "production",
      }}
    >
      <ResponsiveCamera />
      <SceneLighting />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <CrystalDecanter />
        <ContactShadows
          position={[0, -1.78, 0]}
          opacity={0.45}
          blur={2.4}
          scale={6}
          far={4}
          resolution={512}
          color="#04140a"
        />
        <GoldDust count={500} />
        <SceneReady onReady={onReady} />
      </Suspense>
      <PostFX />
    </Canvas>
  );
}
