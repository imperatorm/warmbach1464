"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Environment, Html, Lightformer, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { createAppleTree } from "./createAppleTree";

const GOLD = "#c57e5b";
const COPPER = "#8c5438";
const CREAM = "#f0efeb";
const NIGHT = "#1d291d";
const STEEL = "#cdd2d8";

const TREE_X = 0;
const STILL_X = 3.6;

type Vec3 = [number, number, number];

type Element = {
  id: string;
  no: string;
  label: string;
  fact: string;
  marker: Vec3;
  cam: Vec3;
  look: Vec3;
};

const ELEMENTS: Element[] = [
  {
    id: "erde",
    no: "I",
    label: "Erde",
    fact: "Osthang am Wilden Kaiser, 100 m² je Baum. Ein über 100 Jahre alter Apfelbaum als Herz.",
    marker: [TREE_X, 0.5, 1.1],
    cam: [2, 1.6, 6.5],
    look: [TREE_X, 0.7, 0],
  },
  {
    id: "wasser",
    no: "II",
    label: "Wasser",
    fact: "Eine artesische Quelle, natürlich gefiltert: weichste Wasserqualität — sie steigt durch die Wurzeln in den Baum.",
    marker: [TREE_X, -2.5, 0.6],
    cam: [1.6, -1.1, 6],
    look: [TREE_X, -2.6, 0],
  },
  {
    id: "apfel",
    no: "III",
    label: "Apfel",
    fact: "Apfel Brand · 42 % vol · 0,75 l, von Hand nummeriert. Hohe Süße — trotz kühlem Obstbaugebiet.",
    marker: [0, 5.4, 0.6],
    cam: [1.9, 5.4, 5.6],
    look: [-0.3, 5.2, 0],
  },
  {
    id: "feuer",
    no: "IV",
    label: "Feuer",
    fact: "Schonend doppelt gebrannt, handverlesen, filtriert — ohne Methylalkohol.",
    marker: [STILL_X, 0.7, 0.7],
    cam: [STILL_X, 1.4, 4],
    look: [STILL_X, 0.8, -0.3],
  },
  {
    id: "kupfer",
    no: "V",
    label: "Kupfer",
    fact: "Kupferblase mit katalytischer Kupferschicht von 2,0 m² — feinste Destillation, made by Kothe.",
    marker: [STILL_X, 2.4, 0.6],
    cam: [STILL_X, 2.6, 4.4],
    look: [STILL_X, 2.1, -0.3],
  },
];

// The tree is the pivot — auto-rotate + drag orbit around its centre, so the
// still and spring revolve around it.
const OVERVIEW: { cam: Vec3; look: Vec3 } = {
  cam: [3.2, 3, 19.5],
  look: [0, 2.6, 0],
};

/* -------------------------------------------------------------------------- */

function makeGeo(positions: Float32Array) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

function radialTexture(stops: Array<[number, string]>) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [o, col] of stops) g.addColorStop(o, col);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeRoots(baseX: number): Float32Array {
  const seg: number[] = [];
  const down = new THREE.Vector3(0, -1, 0);
  let s = 1464;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  (function grow(p: THREE.Vector3, d: THREE.Vector3, len: number, depth: number) {
    const e = p.clone().addScaledVector(d, len);
    seg.push(p.x, p.y, p.z, e.x, e.y, e.z);
    if (depth >= 5) return;
    const n = depth < 1 ? 7 : depth < 2 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const axis = new THREE.Vector3(
        rand() - 0.5,
        rand() - 0.5,
        rand() - 0.5,
      ).normalize();
      const ang = (depth < 1 ? 0.66 : 0.4) + rand() * 0.5;
      const nd = d
        .clone()
        .applyAxisAngle(axis, ang)
        .lerp(down, depth < 1 ? 0.08 : 0.16)
        .normalize();
      grow(e, nd, len * (0.79 + rand() * 0.1), depth + 1);
    }
  })(new THREE.Vector3(baseX, 0, 0), down.clone(), 0.95, 0);
  return new Float32Array(seg);
}

/* -------------------------------------------------------------------------- */

function TreePrimitive({ tree }: { tree: THREE.Object3D }) {
  useFrame((s) => {
    try {
      // ez-tree wind
      (tree as unknown as { update: (t: number) => void }).update(
        s.clock.elapsedTime,
      );
    } catch {
      /* optional */
    }
  });
  return <primitive object={tree} />;
}

function Apples({ anchors }: { anchors: Vec3[] }) {
  return (
    <group>
      {anchors.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial
            color="#b23a22"
            emissive="#7a1d10"
            emissiveIntensity={0.7}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Lines({
  positions,
  color,
  opacity,
}: {
  positions: Float32Array;
  color: string;
  opacity: number;
}) {
  const geo = useMemo(() => makeGeo(positions), [positions]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </lineSegments>
  );
}

/* Rising particles — the spring drawn up through the roots */
function RisingParticles({
  count,
  spreadX,
  spreadZ,
  height,
  speed,
  size,
  color,
  jitter = 0,
}: {
  count: number;
  spreadX: number;
  spreadZ: number;
  height: number;
  speed: number;
  size: number;
  color: string;
  jitter?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const speeds = useRef<Float32Array | null>(null);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spreadX;
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;
      sp[i] = speed * (0.5 + Math.random());
    }
    speeds.current = sp;
    return makeGeo(pos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, spreadX, spreadZ, height, speed]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((_, dt) => {
    if (!ref.current || !speeds.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds.current[i] * d;
      if (jitter) arr[i * 3] += Math.sin((arr[i * 3 + 1] + i) * 3) * jitter * d;
      if (arr[i * 3 + 1] > height) {
        arr[i * 3 + 1] = 0;
        arr[i * 3] = (Math.random() - 0.5) * spreadX;
        arr[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* The spring — a luminous source welling up out of the ground */
function Spring() {
  const pool = useRef<THREE.Mesh>(null);
  const tex = useMemo(
    () =>
      radialTexture([
        [0, "rgba(237,230,212,0.95)"],
        [0.4, "rgba(237,230,212,0.35)"],
        [1, "rgba(237,230,212,0)"],
      ]),
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((s) => {
    if (!pool.current) return;
    const k = 1 + Math.sin(s.clock.elapsedTime * 0.8) * 0.06;
    pool.current.scale.set(k, k, 1);
  });
  return (
    <group position={[TREE_X, -3, 0]}>
      <mesh ref={pool} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 48]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <RisingParticles
        count={110}
        spreadX={2.6}
        spreadZ={2.6}
        height={3.1}
        speed={0.55}
        size={0.05}
        color={CREAM}
      />
      <pointLight position={[0, 0.6, 0]} color={CREAM} intensity={5} distance={9} decay={2} />
    </group>
  );
}

function GoldMotes() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 220;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return makeGeo(pos);
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.05}
        color={GOLD}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function GroundGlow() {
  const tex = useMemo(
    () =>
      radialTexture([
        [0, "rgba(197,126,91,0.28)"],
        [0.5, "rgba(197,126,91,0.07)"],
        [1, "rgba(197,126,91,0)"],
      ]),
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[TREE_X, 0.01, 0]}>
      <circleGeometry args={[6.5, 64]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* The Kothe still — copper gleaming in the dark, fire at the furnace */
function SightGlass({ y }: { y: number }) {
  return (
    <group position={[0, y, 0.25]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 20]} />
        <meshStandardMaterial color="#0e120c" metalness={0.4} roughness={0.08} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.082, 0.016, 10, 24]} />
        <meshStandardMaterial color={COPPER} metalness={1} roughness={0.26} />
      </mesh>
    </group>
  );
}

function FireLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.intensity =
      (0.72 + Math.sin(t * 9) * 0.13 + Math.sin(t * 23) * 0.08) * 6;
  });
  return (
    <pointLight ref={ref} position={[0, 0.5, 0.3]} color={GOLD} distance={5} decay={2} intensity={5} />
  );
}

function CopperStill() {
  const helmGeo = useMemo(() => {
    const ctrl: Vec3[] = [
      [0.46, 1.25, 0],
      [0.5, 1.42, 0],
      [0.5, 1.8, 0],
      [0.44, 2.02, 0],
      [0.31, 2.24, 0],
      [0.185, 2.48, 0],
      [0.155, 2.62, 0],
      [0.22, 2.78, 0],
      [0.305, 2.92, 0],
      [0.315, 3.04, 0],
      [0.26, 3.18, 0],
      [0.16, 3.32, 0],
      [0.095, 3.46, 0],
      [0.07, 3.6, 0],
    ];
    const curve = new THREE.CatmullRomCurve3(
      ctrl.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    );
    const pts = curve
      .getPoints(60)
      .map((p) => new THREE.Vector2(Math.max(0.004, p.x), p.y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  useEffect(() => () => helmGeo.dispose(), [helmGeo]);
  const swanGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.58, 0),
      new THREE.Vector3(0, 3.86, 0),
      new THREE.Vector3(-0.42, 3.78, -0.05),
      new THREE.Vector3(-0.82, 3.25, -0.12),
      new THREE.Vector3(-0.95, 2.92, -0.15),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.042, 10, false);
  }, []);
  useEffect(() => () => swanGeo.dispose(), [swanGeo]);
  const fireGlow = useMemo(
    () =>
      radialTexture([
        [0, "rgba(197,126,91,0.95)"],
        [0.45, "rgba(140,84,56,0.4)"],
        [1, "rgba(140,84,56,0)"],
      ]),
    [],
  );
  useEffect(() => () => fireGlow.dispose(), [fireGlow]);

  const copper = (
    <meshStandardMaterial color={COPPER} metalness={1} roughness={0.24} emissive={COPPER} emissiveIntensity={0.1} />
  );
  const steel = <meshStandardMaterial color={STEEL} metalness={1} roughness={0.34} />;

  return (
    <group position={[STILL_X, 0, -0.3]}>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.54, 0.56, 1.25, 40]} />
        {steel}
      </mesh>
      <mesh geometry={helmGeo}>{copper}</mesh>
      <mesh geometry={swanGeo}>{copper}</mesh>
      <group position={[-0.95, 0, -0.15]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.8, 32]} />
          {steel}
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 1.9, 36]} />
          {copper}
        </mesh>
        <mesh position={[0, 2.78, 0]}>
          <cylinderGeometry args={[0.18, 0.23, 0.2, 28]} />
          {steel}
        </mesh>
        {[1.15, 1.55, 1.95, 2.35].map((y) => (
          <SightGlass key={y} y={y} />
        ))}
      </group>
      <FireLight />
      <Billboard position={[0, 0.2, 0.1]}>
        <mesh>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            map={fireGlow}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
      <RisingParticles
        count={50}
        spreadX={0.6}
        spreadZ={0.55}
        height={1.1}
        speed={0.75}
        size={0.05}
        color={GOLD}
        jitter={0.18}
      />
    </group>
  );
}

function WarmEnv() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={1.4} color={CREAM} position={[0, 4, 3]} scale={[7, 7, 1]} />
      <Lightformer intensity={2.2} color={GOLD} position={[5, 1.5, 3]} scale={[3, 5, 1]} />
      <Lightformer intensity={1.4} color={COPPER} position={[-5, 0.5, 2]} scale={[3, 5, 1]} />
    </Environment>
  );
}

/* -------------------------------------------------------------------------- */

function Hotspot({
  el,
  active,
  onSelect,
}: {
  el: Element;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Html position={el.marker} center zIndexRange={[16, 0]} className="select-none">
      <button
        type="button"
        onClick={() => onSelect(el.id)}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        aria-label={el.label}
        className="relative grid h-7 w-7 place-items-center"
      >
        <span
          className={`absolute inline-flex h-6 w-6 rounded-full bg-gold/40 ${active ? "animate-ping" : ""}`}
        />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(197,126,91,0.7)]" />
        <span
          className={`pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap rounded bg-night/80 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-cream transition-opacity duration-200 ${
            hover && !active ? "opacity-100" : "opacity-0"
          }`}
        >
          {el.label}
        </span>
      </button>
    </Html>
  );
}

function CameraRig({
  focusEl,
  controlsRef,
}: {
  focusEl: Element | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.MutableRefObject<any>;
}) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(...OVERVIEW.look));
  const dPos = useRef(new THREE.Vector3());
  const dLook = useRef(new THREE.Vector3());
  const settling = useRef(false);
  useFrame(() => {
    const controls = controlsRef.current;
    if (focusEl) {
      if (controls && controls.enabled) controls.enabled = false;
      dPos.current.set(...focusEl.cam);
      dLook.current.set(...focusEl.look);
      camera.position.lerp(dPos.current, 0.055);
      look.current.lerp(dLook.current, 0.055);
      camera.lookAt(look.current);
      settling.current = true;
    } else if (settling.current) {
      dPos.current.set(...OVERVIEW.cam);
      dLook.current.set(...OVERVIEW.look);
      camera.position.lerp(dPos.current, 0.055);
      look.current.lerp(dLook.current, 0.055);
      camera.lookAt(look.current);
      if (camera.position.distanceTo(dPos.current) < 0.25) {
        settling.current = false;
        if (controls) {
          controls.target.set(...OVERVIEW.look);
          controls.enabled = true;
          controls.update();
        }
      }
    }
  });
  return null;
}

function Scene({
  focusEl,
  controlsRef,
  onSelect,
}: {
  focusEl: Element | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.MutableRefObject<any>;
  onSelect: (id: string) => void;
}) {
  const { tree, apples } = useMemo(() => createAppleTree(7, TREE_X), []);
  const roots = useMemo(() => makeRoots(TREE_X), []);

  return (
    <>
      <color attach="background" args={[NIGHT]} />
      <fog attach="fog" args={[NIGHT, 14, 34]} />
      <ResponsiveFov />

      <ambientLight intensity={0.35} color={CREAM} />
      {/* cool moonlight key so the realistic tree reads against the dark */}
      <directionalLight position={[4, 12, 7]} intensity={2.3} color="#dfe6ee" />
      <WarmEnv />

      <GroundGlow />
      <TreePrimitive tree={tree} />
      <Apples anchors={apples} />
      <Lines positions={roots} color={COPPER} opacity={0.7} />
      <Spring />
      <CopperStill />
      <GoldMotes />

      {ELEMENTS.map((el) => (
        <Hotspot key={el.id} el={el} active={focusEl?.id === el.id} onSelect={onSelect} />
      ))}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        autoRotate
        autoRotateSpeed={0.25}
        target={[OVERVIEW.look[0], OVERVIEW.look[1], OVERVIEW.look[2]]}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.6}
      />
      <CameraRig focusEl={focusEl} controlsRef={controlsRef} />

      <EffectComposer multisampling={2}>
        <Bloom intensity={0.85} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette darkness={0.62} offset={0.22} />
      </EffectComposer>
    </>
  );
}

function Register({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const activeEl = ELEMENTS.find((e) => e.id === activeId) ?? null;
  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden items-center md:flex">
        <div className="pointer-events-auto m-6 w-[12.5rem] border border-hairline/15 bg-night/55 backdrop-blur-md">
          <p className="t-label px-4 pb-3 pt-4">Fünf Elemente</p>
          <ul>
            {ELEMENTS.map((el) => {
              const active = el.id === activeId;
              return (
                <li key={el.id} className="border-t border-hairline/10">
                  <button
                    type="button"
                    onClick={() => onSelect(active ? null : el.id)}
                    className="group flex w-full items-baseline gap-3 px-4 py-3 text-left"
                  >
                    <span className={`text-[0.62rem] tracking-[0.18em] ${active ? "text-gold" : "text-stone"}`}>
                      {el.no}
                    </span>
                    <span
                      className={`flex-1 font-display text-[1.05rem] leading-none transition-colors ${
                        active ? "text-cream" : "text-cream/70 group-hover:text-cream"
                      }`}
                    >
                      {el.label}
                    </span>
                    <span className={`mt-0.5 h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-gold" : "bg-transparent"}`} />
                  </button>
                  {active && (
                    <p className="px-4 pb-4 text-[0.78rem] leading-relaxed text-cream/80">{el.fact}</p>
                  )}
                </li>
              );
            })}
          </ul>
          {activeId && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="t-label block w-full border-t border-hairline/10 px-4 py-3 text-left text-stone transition-colors hover:text-gold"
            >
              ← Gesamtansicht
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 md:hidden">
        <div className="pointer-events-auto bg-gradient-to-t from-night via-night/85 to-transparent px-3 pb-3 pt-12">
          {activeEl && (
            <p className="mx-auto mb-3 max-w-sm px-1 text-center text-[0.74rem] leading-snug text-cream/85">
              {activeEl.fact}
            </p>
          )}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {ELEMENTS.map((el) => {
              const active = el.id === activeId;
              return (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => onSelect(active ? null : el.id)}
                  className={`whitespace-nowrap border px-3.5 py-2 font-display text-[0.95rem] leading-none transition-colors ${
                    active ? "border-gold/70 text-gold" : "border-hairline/25 text-cream/75"
                  }`}
                >
                  {el.label}
                </button>
              );
            })}
            {activeId && (
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="whitespace-nowrap px-3 py-2 text-[0.6rem] uppercase tracking-[0.18em] text-stone"
              >
                ↺ Ansicht
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Widen the field of view on portrait / phones so the scene sits further back. */
function ResponsiveFov() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = aspect < 0.7 ? 52 : aspect < 1.1 ? 44 : 38;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function ElementalScene() {
  const [focus, setFocus] = useState<string | null>(null);
  const controlsRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const focusEl = ELEMENTS.find((e) => e.id === focus) ?? null;

  return (
    <div className="relative h-full w-full">
      <Canvas
        flat
        dpr={[1, 1.8]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: OVERVIEW.cam, fov: 38 }}
      >
        <Scene focusEl={focusEl} controlsRef={controlsRef} onSelect={(id) => setFocus(id)} />
      </Canvas>
      <Register activeId={focus} onSelect={setFocus} />
    </div>
  );
}
