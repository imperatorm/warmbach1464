"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Billboard,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { generateAppleTree, type Limb } from "@/lib/three/tree";

const GOLD = "#c0916a";
const COPPER = "#6f4f34";
const CREAM = "#ece4d2";
const NIGHT = "#1b261f";
const SOOT = "#232f26";
const STEEL = "#9C9489";

type Vec3 = [number, number, number];

/* -------------------------------------------------------------------------- */
/*  Elements — single source of truth (markers, camera framing, cited facts)   */
/* -------------------------------------------------------------------------- */

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
    marker: [-1.25, 0.06, 0.7],
    cam: [1.4, 0.8, 5.2],
    look: [-0.2, 0.4, 0],
  },
  {
    id: "wasser",
    no: "II",
    label: "Wasser",
    fact: "Eine artesische Quelle, natürlich gefiltert: weichste Wasserqualität.",
    marker: [-0.25, -2.95, 0.3],
    cam: [0.8, -1.9, 5.4],
    look: [0, -2.7, 0],
  },
  {
    id: "apfel",
    no: "III",
    label: "Apfel",
    fact: "Apfel Brand · 42 % vol · 0,75 l, von Hand nummeriert. Hohe Süße — trotz kühlem Obstbaugebiet.",
    marker: [0.6, 2.7, 0.55],
    cam: [1.8, 2.9, 4.7],
    look: [0.2, 2.5, 0],
  },
  {
    id: "feuer",
    no: "IV",
    label: "Feuer",
    fact: "Schonend doppelt gebrannt, handverlesen, filtriert — ohne Methylalkohol.",
    marker: [2.8, 0.5, 0.6],
    cam: [2.7, 0.85, 3.0],
    look: [2.8, 0.5, 0.15],
  },
  {
    id: "kupfer",
    no: "V",
    label: "Kupfer",
    fact: "Kupferblase mit katalytischer Kupferschicht von 2,0 m² — feinste Destillation, made by Kothe.",
    marker: [2.82, 1.5, 0.55],
    cam: [2.7, 1.55, 3.5],
    look: [2.82, 1.45, 0.15],
  },
];

const OVERVIEW: { cam: Vec3; look: Vec3 } = {
  cam: [3.0, 0.7, 11.6],
  look: [0, 0.3, 0],
};

/* -------------------------------------------------------------------------- */
/*  Materials + helpers                                                        */
/* -------------------------------------------------------------------------- */

function CopperMat() {
  return (
    <meshStandardMaterial
      color={COPPER}
      metalness={1}
      roughness={0.24}
      emissive={COPPER}
      emissiveIntensity={0.14}
    />
  );
}

function SteelMat() {
  return <meshStandardMaterial color={STEEL} metalness={1} roughness={0.34} />;
}

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

/* -------------------------------------------------------------------------- */
/*  Glowing line tree + roots, fruit, leaf motes                               */
/* -------------------------------------------------------------------------- */

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
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </lineSegments>
  );
}

/** Woody trunk + scaffold limbs as tapered tubes, merged to one draw call. */
function Limbs({ limbs }: { limbs: Limb[] }) {
  const geo = useMemo(() => {
    const geos = limbs.map((l) => {
      const curve = new THREE.CatmullRomCurve3(
        l.pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
      );
      return new THREE.TubeGeometry(curve, 12, (l.r0 + l.r1) / 2, 7, false);
    });
    const merged = mergeGeometries(geos, false);
    geos.forEach((g) => g.dispose());
    return merged ?? new THREE.BufferGeometry();
  }, [limbs]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial
        color="#5b3f20"
        emissive={GOLD}
        emissiveIntensity={0.5}
        roughness={0.55}
        metalness={0.35}
      />
    </mesh>
  );
}

/** Dense crown — a glowing foliage volume clustered on the outer wood. */
function Foliage({
  positions,
  animate,
}: {
  positions: Float32Array;
  animate: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => makeGeo(positions), [positions]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((s) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.1) * 0.04;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.05}
        color={CREAM}
        transparent
        opacity={0.34}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function Apples({ anchors }: { anchors: [number, number, number][] }) {
  return (
    <group>
      {anchors.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={COPPER}
            emissiveIntensity={1.8}
            roughness={0.4}
            metalness={0.25}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Rising particles — spring droplets + fire embers                           */
/* -------------------------------------------------------------------------- */

function RisingParticles({
  count,
  spreadX,
  spreadZ,
  height,
  speed,
  size,
  color,
  jitter = 0,
  animate,
}: {
  count: number;
  spreadX: number;
  spreadZ: number;
  height: number;
  speed: number;
  size: number;
  color: string;
  jitter?: number;
  animate: boolean;
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
    if (!animate || !ref.current || !speeds.current) return;
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

/* -------------------------------------------------------------------------- */
/*  Underground spring                                                         */
/* -------------------------------------------------------------------------- */

function Spring({ animate }: { animate: boolean }) {
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
    if (!animate || !pool.current) return;
    const k = 1 + Math.sin(s.clock.elapsedTime * 0.8) * 0.06;
    pool.current.scale.set(k, k, 1);
  });

  return (
    <group position={[0, -3.2, 0]}>
      <mesh ref={pool} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.3, 48]} />
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
        spreadX={3}
        spreadZ={3}
        height={3.1}
        speed={0.5}
        size={0.05}
        color={CREAM}
        animate={animate}
      />
      <pointLight
        position={[0, 0.6, 0]}
        color={CREAM}
        intensity={4.6}
        distance={9}
        decay={2}
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  The Kothe still — modelled from the Warmbachhof reference photos            */
/*  (hammered-steel water-bath base, waisted copper helm, rectifying column     */
/*   with sight glasses, swan-neck lyne arm, manhole, fire).                    */
/* -------------------------------------------------------------------------- */

function FireLight({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    const f = animate
      ? 0.72 + Math.sin(t * 9) * 0.13 + Math.sin(t * 23) * 0.08
      : 0.8;
    ref.current.intensity = f * 6.5;
  });
  return (
    <pointLight
      ref={ref}
      position={[0, 0.5, 0.3]}
      color={GOLD}
      distance={5.5}
      decay={2}
      intensity={5}
    />
  );
}

function SightGlass({ y }: { y: number }) {
  return (
    <group position={[0, y, 0.21]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.03, 20]} />
        <meshStandardMaterial
          color={NIGHT}
          metalness={0.5}
          roughness={0.08}
          emissive={GOLD}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.072, 0.014, 10, 24]} />
        <CopperMat />
      </mesh>
    </group>
  );
}

function KotheStill({ animate }: { animate: boolean }) {
  const fireGlow = useMemo(
    () =>
      radialTexture([
        [0, "rgba(192,145,106,0.95)"],
        [0.45, "rgba(111,79,52,0.4)"],
        [1, "rgba(111,79,52,0)"],
      ]),
    [],
  );
  useEffect(() => () => fireGlow.dispose(), [fireGlow]);

  // Revolved profile of the waisted copper helm (radius, height).
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

  // Swan-neck lyne arm: helm top → up → arc over to the column head.
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

  // Scale the ~3.9-tall rig down to sit beside the tree.
  return (
    <group position={[2.8, 0, 0.15]} scale={0.62}>
      {/* hammered-steel water-bath base */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.52, 0.54, 1.25, 40]} />
        <SteelMat />
      </mesh>
      <mesh position={[0, 0.86, 0.5]}>
        <boxGeometry args={[0.34, 0.16, 0.04]} />
        <meshStandardMaterial color={SOOT} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* waisted copper helm */}
      <mesh geometry={helmGeo}>
        <CopperMat />
      </mesh>

      {/* manhole door on the lower belly */}
      <group position={[0, 1.6, 0.47]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.04, 28]} />
          <meshStandardMaterial
            color={NIGHT}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.18, 0.022, 12, 28]} />
          <CopperMat />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[0.07, 0.014, 10, 20]} />
          <SteelMat />
        </mesh>
      </group>

      {/* swan-neck lyne arm */}
      <mesh geometry={swanGeo}>
        <CopperMat />
      </mesh>

      {/* rectifying column with four sight glasses */}
      <group position={[-0.95, 0, -0.15]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.27, 0.29, 0.8, 32]} />
          <SteelMat />
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 1.9, 36]} />
          <CopperMat />
        </mesh>
        <mesh position={[0, 2.78, 0]}>
          <cylinderGeometry args={[0.17, 0.22, 0.2, 28]} />
          <SteelMat />
        </mesh>
        {[1.15, 1.55, 1.95, 2.35].map((y) => (
          <SightGlass key={y} y={y} />
        ))}
      </group>

      {/* fire at the furnace */}
      <FireLight animate={animate} />
      <Billboard position={[0, 0.2, 0.1]}>
        <mesh>
          <planeGeometry args={[1.6, 1.6]} />
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
        count={60}
        spreadX={0.7}
        spreadZ={0.6}
        height={1.15}
        speed={0.75}
        size={0.05}
        color={GOLD}
        jitter={0.18}
        animate={animate}
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ambient gold dust + ground horizon                                         */
/* -------------------------------------------------------------------------- */

function GoldMotes({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 170;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 13;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return makeGeo(pos);
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((s) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.045}
        color={GOLD}
        transparent
        opacity={0.5}
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
        [0, "rgba(192,145,106,0.3)"],
        [0.5, "rgba(192,145,106,0.08)"],
        [1, "rgba(192,145,106,0)"],
      ]),
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
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

/* -------------------------------------------------------------------------- */
/*  Hotspot markers (click to focus) + camera rig                              */
/* -------------------------------------------------------------------------- */

function Hotspot({
  el,
  onSelect,
}: {
  el: Element;
  onSelect: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Html
      position={el.marker}
      center
      zIndexRange={[16, 0]}
      className="pointer-events-none select-none"
    >
      <button
        type="button"
        onClick={() => onSelect(el.id)}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        aria-label={el.label}
        className="pointer-events-auto relative grid h-7 w-7 place-items-center"
      >
        <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-gold/30" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(192,145,106,0.7)]" />
        <span
          className={`t-label pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap transition-opacity duration-200 ${
            hover ? "opacity-100" : "opacity-0"
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
  const look = useRef(
    new THREE.Vector3(OVERVIEW.look[0], OVERVIEW.look[1], OVERVIEW.look[2]),
  );
  const dPos = useRef(new THREE.Vector3());
  const dLook = useRef(new THREE.Vector3());
  const settling = useRef(false);

  useFrame(() => {
    const controls = controlsRef.current;
    if (focusEl) {
      if (controls && controls.enabled) controls.enabled = false;
      dPos.current.set(...focusEl.cam);
      dLook.current.set(...focusEl.look);
      camera.position.lerp(dPos.current, 0.06);
      look.current.lerp(dLook.current, 0.06);
      camera.lookAt(look.current);
      settling.current = true;
    } else if (settling.current) {
      dPos.current.set(...OVERVIEW.cam);
      dLook.current.set(...OVERVIEW.look);
      camera.position.lerp(dPos.current, 0.06);
      look.current.lerp(dLook.current, 0.06);
      camera.lookAt(look.current);
      if (camera.position.distanceTo(dPos.current) < 0.2) {
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

/* -------------------------------------------------------------------------- */
/*  Scene assembly                                                             */
/* -------------------------------------------------------------------------- */

function Scene({
  animate,
  focusEl,
  controlsRef,
  onSelect,
}: {
  animate: boolean;
  focusEl: Element | null;
  controlsRef: React.MutableRefObject<any>;
  onSelect: (id: string) => void;
}) {
  const tree = useMemo(() => generateAppleTree(7), []);

  return (
    <>
      <fog attach="fog" args={[NIGHT, 9.5, 24]} />
      <ResponsiveFov />
      <ambientLight intensity={0.35} color={CREAM} />
      <directionalLight position={[2, 6, 5]} intensity={0.85} color={CREAM} />

      {/* Warm studio reflections so the copper still gleams (metals need an env
          map or they render near-black). Lightformers — no network dependency. */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={1.6}
          color={CREAM}
          position={[0, 4, 3]}
          scale={[7, 7, 1]}
        />
        <Lightformer
          intensity={2.4}
          color={GOLD}
          position={[4, 1.5, 3]}
          scale={[3, 5, 1]}
        />
        <Lightformer
          intensity={1.6}
          color={COPPER}
          position={[-4, 0.5, 2]}
          scale={[3, 5, 1]}
        />
        <Lightformer
          intensity={1.1}
          color={CREAM}
          position={[0, -2, 4]}
          scale={[5, 3, 1]}
        />
      </Environment>

      <GroundGlow />

      <Limbs limbs={tree.limbs} />
      <Lines positions={tree.rootPositions} color={COPPER} opacity={0.74} />
      <Foliage positions={tree.foliage} animate={animate} />
      <Apples anchors={tree.apples} />

      <Spring animate={animate} />
      <KotheStill animate={animate} />
      <GoldMotes animate={animate} />

      {ELEMENTS.map((el) => (
        <Hotspot key={el.id} el={el} onSelect={onSelect} />
      ))}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        autoRotate={animate}
        autoRotateSpeed={0.4}
        target={[0, 0.3, 0]}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.62}
      />
      <CameraRig focusEl={focusEl} controlsRef={controlsRef} />

      <EffectComposer multisampling={2}>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette darkness={0.62} offset={0.26} />
      </EffectComposer>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Left register (DOM overlay)                                                 */
/* -------------------------------------------------------------------------- */

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
      {/* Desktop — left vertical panel */}
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
                    data-cursor
                    onClick={() => onSelect(active ? null : el.id)}
                    className="group flex w-full items-baseline gap-3 px-4 py-3 text-left"
                  >
                    <span
                      className={`text-[0.62rem] tracking-[0.18em] ${active ? "text-gold" : "text-stone"}`}
                    >
                      {el.no}
                    </span>
                    <span
                      className={`flex-1 font-display text-[1.05rem] leading-none transition-colors ${
                        active ? "text-cream" : "text-cream/70 group-hover:text-cream"
                      }`}
                    >
                      {el.label}
                    </span>
                    <span
                      className={`mt-0.5 h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-gold" : "bg-transparent"}`}
                    />
                  </button>
                  {active && (
                    <p className="px-4 pb-4 text-[0.78rem] leading-relaxed text-cream/75">
                      {el.fact}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          {activeId && (
            <button
              type="button"
              data-cursor
              onClick={() => onSelect(null)}
              className="t-label block w-full border-t border-hairline/10 px-4 py-3 text-left text-stone transition-colors hover:text-gold"
            >
              ← Gesamtansicht
            </button>
          )}
        </div>
      </div>

      {/* Mobile — bottom chip bar (keeps the tree centre clear) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 md:hidden">
        <div className="pointer-events-auto bg-gradient-to-t from-night via-night/85 to-transparent px-3 pb-3 pt-12">
          {activeEl && (
            <p className="mx-auto mb-3 max-w-sm px-1 text-center text-[0.74rem] leading-snug text-cream/80">
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
                    active
                      ? "border-gold/70 text-gold"
                      : "border-hairline/20 text-cream/70"
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

/** Widen the field of view on portrait / phone screens so the broad tree fits. */
function ResponsiveFov() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = aspect < 0.7 ? 50 : aspect < 1 ? 42 : 36;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function ElementalDiorama({
  animate = true,
}: {
  animate?: boolean;
}) {
  const [focus, setFocus] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);
  const focusEl = ELEMENTS.find((e) => e.id === focus) ?? null;

  return (
    <div className="relative h-full w-full">
      <Canvas
        flat
        dpr={[1, 1.7]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: OVERVIEW.cam, fov: 36 }}
      >
        <Scene
          animate={animate}
          focusEl={focusEl}
          controlsRef={controlsRef}
          onSelect={(id) => setFocus(id)}
        />
      </Canvas>
      <Register activeId={focus} onSelect={setFocus} />
    </div>
  );
}
