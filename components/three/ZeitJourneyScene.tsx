"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { WetPaint } from "./WetPaint";

/**
 * Zeit v5 — the diorama.
 *
 * A paper theatre in three dimensions: the painted land as the floor, the
 * Wilder Kaiser as the backdrop, forest in the wings, and every figure of
 * the story — the old Hof, the frame, the new house, the old apple tree, the
 * young orchard, a branch of apples — a watercolour cut-out standing on the
 * floor. One camera flies through it on a scrubbed path: from high above the
 * meadow, down and in through the building of the Hof, out to eye level
 * between the trees, and finally to a hand's breadth from the fruit.
 *
 * The camera never cuts. Scroll progress picks a point on a Catmull-Rom path
 * of positions and a second one of look-targets, both passing exactly
 * through their keyframes, and the camera is damped towards that point so a
 * flick of the wheel reads as a glide, not a jump. Figures fade and grow
 * on the same progress, so the frame is built while the camera is still
 * high enough to watch it happen, and the orchard grows as the camera comes
 * down to meet it.
 *
 * Everything is unlit: a watercolour has its light painted in, and a lamp
 * would only wash it. Depth comes from fog in the paper's own cream.
 *
 * Lives under components/three because next.config excludes this folder from
 * the click-to-source instrumentation that crashes R3F.
 */

export type JourneyProgress = { current: number };

const CREAM = "#f0efeb";

type Key = { at: number; pos: [number, number, number]; look: [number, number, number] };

/** The flight. `at` is scroll progress; the captions in ZeitJourney are timed to the same numbers. */
// The cut-outs are painted from a little above eye level, so the camera never
// looks down at more than ~30°: the opening is high but oblique, and by the
// time the house stands the eye is at balcony height.
const KEYS: Key[] = [
  { at: 0.0, pos: [34, 40, 46], look: [8, 0, -16] },
  { at: 0.14, pos: [42, 22, 28], look: [14, 4, -18] },
  { at: 0.32, pos: [44, 16, 12], look: [14, 6, -18] },
  { at: 0.5, pos: [40, 13, -1], look: [14, 7, -18] },
  { at: 0.62, pos: [14, 3.5, 16], look: [-12, 2.5, 2] },
  { at: 0.76, pos: [-12, 1.7, 26], look: [-30, 1.8, 8] },
  { at: 0.9, pos: [-30, 1.7, 16], look: [-45, 1.8, 3] },
  { at: 1.0, pos: [-44.7, 1.9, 4.1], look: [-47, 1.85, 2] },
];

/** Where the branch of apples hangs — the journey's last point, just past the last row, the forest behind it. */
const BRANCH: [number, number, number] = [-47, 1.1, 2];

/** Progress → curve parameter, so each keyframe sits exactly at its `at`. */
function paramAt(p: number): number {
  const n = KEYS.length - 1;
  for (let i = 0; i < n; i++) {
    const a = KEYS[i].at, b = KEYS[i + 1].at;
    if (p <= b) {
      const local = Math.max(0, Math.min(1, (p - a) / (b - a)));
      return (i + local) / n;
    }
  }
  return 1;
}

const ramp = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));
/** In over [a,b], full until c, out over [c,d]. */
const span = (p: number, a: number, b: number, c: number, d: number) =>
  p < c ? ramp(p, a, b) : 1 - ramp(p, c, d);
const ease = (t: number) => t * t * (3 - 2 * t);

function CameraRig({ progress, reduce }: { progress: JourneyProgress; reduce: boolean }) {
  const { posCurve, lookCurve } = useMemo(
    () => ({
      posCurve: new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal"),
      lookCurve: new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.look)), false, "centripetal"),
    }),
    [],
  );
  const look = useRef(new THREE.Vector3(...KEYS[0].look));
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const { advance, camera } = useThree();
  const snap = useRef(false);

  // dev-only: lets tooling step the frame loop, read the camera and skip the
  // glide, since a hidden or throttled tab delivers no animation frames at all.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { __zeitJourney?: unknown }).__zeitJourney = { progress, camera, advance, snap };
  }, [progress, camera, advance]);

  useFrame(({ camera }, dt) => {
    const t = paramAt(progress.current);
    posCurve.getPoint(t, tmpPos);
    lookCurve.getPoint(t, tmpLook);
    if (reduce || snap.current) {
      camera.position.copy(tmpPos);
      look.current.copy(tmpLook);
    } else {
      // Frame-rate independent exponential approach: the glide after the wheel stops.
      const k = 1 - Math.exp(-Math.min(dt, 0.1) * 7);
      camera.position.lerp(tmpPos, k);
      look.current.lerp(tmpLook, k);
    }
    camera.lookAt(look.current);
  });
  return null;
}

type CutoutProps = {
  url: string;
  /** Width in metres; height follows the image. */
  width: number;
  /** Base point: the figure stands on this. */
  at: [number, number, number];
  /** Face the camera about the vertical axis. */
  billboard?: boolean;
  rotationY?: number;
  /** Opacity over progress. */
  fade?: (p: number) => number;
  /** Scale from the base over progress — a figure growing out of the ground. */
  grow?: (p: number) => number;
  progress: JourneyProgress;
  renderOrder?: number;
};

function Cutout({ url, width, at, billboard, rotationY = 0, fade, grow, progress, renderOrder = 0 }: CutoutProps) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const img = tex.image as { width: number; height: number };
  const height = width / (img.width / img.height);
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ camera }) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current;
    if (billboard) g.rotation.y = Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z);
    const s = grow ? Math.max(0.0001, grow(p)) : 1;
    g.scale.set(s, s, s);
    const o = fade ? fade(p) : 1;
    if (mat.current) mat.current.opacity = o;
    g.visible = o > 0.005 && s > 0.002;
  });

  return (
    <group ref={group} position={at} rotation-y={rotationY}>
      <mesh position={[0, height / 2, 0]} renderOrder={renderOrder}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={mat} map={tex} transparent alphaTest={0.02} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

const TILES = 7;
const TILE_W = 185;
const TILE_D = 123.5;

function Ground() {
  // boden-tile is the meadow painting with its white paper margin cropped off
  // (boden-aerial, 8 % each side). Mirrored repeat makes every tile meet its
  // neighbour on the same painted edge, so the floor runs seamlessly out to
  // the horizon, where the fog takes it — no edge is ever in view.
  const tex = useTexture("/zeit-v4/boden-tile.webp");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
  // An odd count of 185 × 123.5 m tiles, offset by one, puts the centre of an
  // un-mirrored tile — where the painted track ends — at (10, -8), in front
  // of the house footprint at (14, -18).
  tex.repeat.set(TILES, TILES);
  tex.offset.set(1, 1);
  tex.needsUpdate = true;
  return (
    <mesh rotation-x={-Math.PI / 2} position={[10, 0, -8]}>
      <planeGeometry args={[TILE_W * TILES, TILE_D * TILES]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/** The orchard: five rows of six, planted west of the house, nearer the eye. */
const ORCHARD: [number, number][] = [];
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 6; c++) {
    // deterministic jitter so the rows read as planted by hand, not by a grid
    const jx = (((r * 7 + c * 13) % 10) - 5) * 0.12;
    const jz = (((r * 11 + c * 5) % 10) - 5) * 0.12;
    ORCHARD.push([-16 - r * 6 + jx, -8 + c * 6 + jz]);
  }
}

function World({ progress }: { progress: JourneyProgress }) {
  return (
    <>
      <Ground />

      {/* backdrop and wings — the ridge is drawn first, the forest always over it */}
      <Cutout url="/zeit-v4/kaiser.webp" width={360} at={[20, -6, -170]} progress={progress} renderOrder={-20} />
      <Cutout url="/zeit-v4/wald.webp" width={70} at={[-70, 0, -60]} billboard progress={progress} renderOrder={-10} />
      <Cutout url="/zeit-v4/wald.webp" width={64} at={[-20, 0, -95]} billboard progress={progress} renderOrder={-10} />
      <Cutout url="/zeit-v4/wald.webp" width={60} at={[78, 0, -70]} billboard progress={progress} renderOrder={-10} />
      <Cutout url="/zeit-v4/wald.webp" width={55} at={[-66, 0, -25]} billboard progress={progress} renderOrder={-10} />
      <Cutout url="/zeit-v4/wald.webp" width={50} at={[-62, 0, 10]} billboard progress={progress} renderOrder={-10} />
      <Cutout url="/zeit-v4/wald.webp" width={46} at={[-58, 0, 40]} billboard progress={progress} renderOrder={-10} />
      <Cutout url="/zeit-v4/wald.webp" width={44} at={[60, 0, 24]} billboard progress={progress} renderOrder={-10} />

      {/* the Hof, old to new, on one footprint */}
      <Cutout
        url="/zeit-v4/hof-alt.webp"
        width={24}
        at={[14, 0, -18]}
        rotationY={0.35}
        fade={(p) => ease(span(p, 0.1, 0.16, 0.3, 0.34))}
        progress={progress}
      />
      <Cutout
        url="/zeit-v4/hof-rohbau.webp"
        width={26}
        at={[14, 0, -18]}
        rotationY={0.35}
        grow={(p) => ease(ramp(p, 0.31, 0.4))}
        fade={(p) => 1 - ease(ramp(p, 0.47, 0.5))}
        progress={progress}
      />
      <Cutout
        url="/zeit-v4/hof-neu.webp"
        width={28}
        at={[14, 0, -18]}
        rotationY={0.35}
        grow={(p) => 0.6 + 0.4 * ease(ramp(p, 0.47, 0.54))}
        fade={(p) => ease(ramp(p, 0.47, 0.54))}
        progress={progress}
      />

      {/* the tree that already stood — right of the Hof and behind it, out of the foreground */}
      <Cutout url="/zeit-v4/apfelbaum-frucht.webp" width={11} at={[22, 0, -34]} billboard progress={progress} />

      {/* the orchard grows as the camera comes down to it; nothing shows before it is planted */}
      {ORCHARD.map(([x, z], i) => (
        <Cutout
          key={i}
          url="/zeit-v4/jungbaum.webp"
          width={3.2 + ((i * 7) % 5) * 0.12}
          at={[x, 0, z]}
          billboard
          fade={(p) => ramp(p, 0.57, 0.6)}
          grow={(p) => 0.05 + 0.95 * ease(ramp(p, 0.58 + (i % 6) * 0.012, 0.7 + (i % 6) * 0.012))}
          progress={progress}
        />
      ))}

      {/* the branch, at the end of the path */}
      <Cutout
        url="/zeit-v4/apfelzweig.webp"
        width={2.6}
        at={BRANCH}
        billboard
        fade={(p) => ease(ramp(p, 0.86, 0.93))}
        progress={progress}
        renderOrder={10}
      />
    </>
  );
}

export default function ZeitJourneyScene({
  progress,
  active,
  reduce,
}: {
  progress: JourneyProgress;
  /** Render only while the stage is on screen. */
  active: boolean;
  reduce: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.2, far: 700, position: KEYS[0].pos }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={[CREAM]} />
      {/* light enough that the ridge at 180 m still reads as rock, not as a wall of haze */}
      <fog attach="fog" args={[CREAM, 150, 460]} />
      <Suspense fallback={null}>
        <World progress={progress} />
      </Suspense>
      <CameraRig progress={progress} reduce={reduce} />
      <WetPaint reduce={reduce} />
    </Canvas>
  );
}
