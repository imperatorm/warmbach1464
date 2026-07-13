"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { WarmbachBottle } from "./WarmbachBottle";
import { GoldDust } from "./GoldDust";
import { PostFX } from "./PostFX";

/** Fires once the suspended resources have mounted — the signal consumers use
 *  to cross-fade from the poster still to the live scene. */
function SceneReady({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

/** Green-tuned "alpine night" environment — emerald back-glow instead of gold. */
function GreenEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <color attach="background" args={["#0c120e"]} />
      <Lightformer form="rect" intensity={2.1} color="#f3f6ee" position={[-6, 5, 1]} scale={[15, 15, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.0} color="#bcae93" position={[7, 0, 3]} scale={[12, 12, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.5} color="#2f7d4f" position={[0, 2, -7]} scale={[11, 9, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.7} color="#e7ead8" position={[0, 9, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 9, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}

/** Three-point rig, green/copper accents (copper rim instead of gold). */
function GreenLighting() {
  return (
    <>
      <directionalLight position={[-4, 5, 3]} intensity={3.0} color="#fff1d6" />
      <spotLight position={[5, 1.5, 3.5]} angle={0.9} penumbra={1} decay={0} intensity={0.8} color="#15351f" />
      <spotLight position={[0, 2.5, -5]} angle={0.45} penumbra={0.6} decay={0} intensity={1.7} color="#8c5438" />
      <ambientLight intensity={0.2} />
      <pointLight position={[0.6, -0.2, 4.5]} intensity={0.5} decay={0} color="#dfeede" />
    </>
  );
}

export default function WarmbachBottleScene({
  tint = "green",
  showStopper = true,
  active = true,
  onReady,
  dustCount = 260,
  enableZoom = true,
}: {
  tint?: "green" | "clear";
  showStopper?: boolean;
  /** Pause the render loop when the scene scrolls out of view. */
  active?: boolean;
  onReady?: () => void;
  dustCount?: number;
  /** Off in scroll-embedded sections — wheel capture would trap Lenis smooth scroll. */
  enableZoom?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, 6.8], fov: 38 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <GreenLighting />
      <Suspense fallback={null}>
        <GreenEnvironment />
        <WarmbachBottle tint={tint} showStopper={showStopper} reduce={reduce} />
        <ContactShadows position={[0, -1.82, 0]} opacity={0.5} blur={2.6} scale={7} far={4} resolution={512} color="#04140a" />
        <GoldDust count={dustCount} />
        <SceneReady onReady={onReady} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={enableZoom}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.86}
        autoRotate={!reduce}
        autoRotateSpeed={0.6}
        minDistance={4.5}
        maxDistance={11}
        target={[0, 0, 0]}
      />
      <PostFX />
    </Canvas>
  );
}
