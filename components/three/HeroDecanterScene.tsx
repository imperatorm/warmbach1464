"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { WarmbachBottle } from "./WarmbachBottle";
import { GoldDust } from "./GoldDust";
import { PostFX } from "./PostFX";

/** Anything with a `.get()` — a Framer Motion MotionValue qualifies without
 *  making three depend on framer types. */
type Readable = { get: () => number };

/** Fires once the suspended resources have mounted — the signal the hero uses
 *  to cross-fade the decanter into the film. */
function SceneReady({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

/** Rotates its children from the page's scroll progress (plus a slow idle
 *  drift), read per-frame so the spin never re-renders React. */
function ScrollSpin({ spin, reduce, children }: { spin?: Readable; reduce: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = spin?.get() ?? 0;
    const drift = reduce ? 0 : state.clock.elapsedTime * 0.1;
    g.rotation.y = drift + scroll;
    if (!reduce) g.rotation.z = Math.sin(scroll * 0.9) * 0.04; // faint lean into the turn
  });
  return <group ref={group}>{children}</group>;
}

/** A soft dark disc behind the bottle: the transmission buffer refracts THIS
 *  instead of an empty (bright) frame, so the belly reads as green crystal
 *  rather than chrome. In the DOM it doubles as a quiet halo of depth behind
 *  the specimen — the video stays visible past its feathered edge. */
function RefractionBackdrop() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(5, 12, 7, 0.92)");
    g.addColorStop(0.55, "rgba(5, 12, 7, 0.55)");
    g.addColorStop(1, "rgba(5, 12, 7, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0, 0, -4]}>
      <planeGeometry args={[14, 14]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/** Compact alpine-night rig — the WarmbachBottleScene environment, trimmed for
 *  a hero that shares the frame with a video film. */
function HeroEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <color attach="background" args={["#0c120e"]} />
      <Lightformer form="rect" intensity={0.8} color="#f3f6ee" position={[-6, 5, 1]} scale={[15, 15, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.5} color="#bcae93" position={[7, 0, 3]} scale={[12, 12, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.6} color="#2f7d4f" position={[0, 2, -7]} scale={[11, 9, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}

function HeroLighting() {
  return (
    <>
      <directionalLight position={[-4, 5, 3]} intensity={1.6} color="#fff1d6" />
      <spotLight position={[0, 2.5, -5]} angle={0.45} penumbra={0.6} decay={0} intensity={1.7} color="#8c5438" />
      <ambientLight intensity={0.2} />
      <pointLight position={[0.6, -0.2, 4.5]} intensity={0.5} decay={0} color="#dfeede" />
    </>
  );
}

/**
 * The hero's floating decanter — WarmbachBottle without controls: the camera
 * is fixed, the bottle's rotation belongs to the scroll (Oryzo pattern), and
 * the canvas is pointer-transparent so nav and Lenis keep the input. Same
 * performance contract as the v3 Flaschenkammer: mounted late, frameloop
 * paused off-screen, never mounted under prefers-reduced-motion.
 */
export default function HeroDecanterScene({
  spin,
  active = true,
  onReady,
  dustCount = 200,
}: {
  /** Scroll progress mapped to radians — read per-frame, no re-renders. */
  spin?: Readable;
  active?: boolean;
  onReady?: () => void;
  dustCount?: number;
}) {
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.15, 9.5], fov: 32 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <HeroLighting />
      <Suspense fallback={null}>
        <HeroEnvironment />
        {/* No ContactShadows — the decanter floats free in the film; a shadow
            plane would hang in the sky (and reads as a grey slab over video). */}
        <RefractionBackdrop />
        <ScrollSpin spin={spin} reduce={false}>
          <WarmbachBottle tint="green" reduce={false} />
        </ScrollSpin>
        <GoldDust count={dustCount} />
        <SceneReady onReady={onReady} />
      </Suspense>
      <PostFX />
    </Canvas>
  );
}
