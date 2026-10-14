"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { FilmGradeEffect, PhysicalDofEffect, loadLutStrip } from "./bar/barEffects";

/**
 * The bar, built from "Bottle_table test scene.blend".
 *
 * Every surface but the glass carries its Cycles lighting baked into a texture
 * (diffuse direct + indirect + emission, OIDN-denoised), stored cube-root
 * encoded so 8 bits hold the dark room. Those surfaces are unlit here and
 * output the baked scene-linear radiance; the bar top, the counter and the
 * bottle body add a real specular sheen from the three lights that matter in
 * close-up, and the glass is transmissive over an environment captured from
 * the bottle's own position.
 *
 * The camera travels from the Blender `Camera` (frontal, f/2.4, focus 5.19 m,
 * EV 3.11) to `Camera.001` (the bottle, f/1.4, focus 2.11 m, EV 2.95). Between
 * them focus follows the bottle, racks to the man behind the bar for a beat,
 * and comes back; aperture opens and exposure settles on the way. The frame is
 * then graded with the same LUT the .blend's compositor uses.
 */

const BASE = "/hero-bar";

export type BarProgress = { current: number };

type SceneJson = {
  lut: { size: number; lo: number; hi: number };
  vignette: [number, number, number];
  cameras: Record<
    "Camera" | "Camera.001",
    {
      position: [number, number, number];
      quaternion: [number, number, number, number];
      lensMm: number;
      sensorMm: number;
      fStop: number;
      focusM: number;
      exposureEv: number;
    }
  >;
  lights: Record<
    string,
    {
      type: string;
      color: [number, number, number];
      watts: number;
      position: [number, number, number];
      quaternion: [number, number, number, number];
      size: number | null;
      spot: number | null;
      blend: number | null;
    }
  >;
  textures: Record<string, { range: number; size: number }>;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Unlit: the texel, decoded from its cube-root storage, is the radiance. */
function bakedMaterial(map: THREE.Texture, range: number) {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, range: { value: range } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform float range; varying vec2 vUv;
      void main() { vec3 t = texture2D(map, vUv).rgb; gl_FragColor = vec4(t * t * t * range, 1.0); }`,
  });
}

/** The bake as emission under a black dielectric: only the lights' sheen is live. */
function bakedGlossMaterial(map: THREE.Texture, range: number, roughness: number) {
  const m = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness,
    metalness: 0,
    emissive: new THREE.Color(range, range, range),
    emissiveMap: map,
  });
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `#ifdef USE_EMISSIVEMAP
        vec3 eT = texture2D( emissiveMap, vEmissiveMapUv ).rgb;
        totalEmissiveRadiance *= eT * eT * eT;
      #endif`,
    );
  };
  return m;
}

/**
 * Clear glass. In Cycles the glass reads by the light it catches at grazing
 * angles from the panel and the lamp above; transmission alone over a dark
 * room cannot find that, so a Fresnel rim in the panel's colour stands in.
 */
function glassMaterial(env: THREE.Texture | null, rim = new THREE.Color(0.05, 0.13, 0.09)) {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0,
    transmission: 1,
    thickness: 0.006,
    ior: 1.5,
    envMap: env,
    envMapIntensity: 2.5,
    specularIntensity: 1,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.rimColor = { value: rim };
    shader.fragmentShader = shader.fragmentShader
      .replace("void main() {", "uniform vec3 rimColor;\nvoid main() {")
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float rimF = 1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0);
        totalEmissiveRadiance += rimColor * pow(rimF, 2.2);`,
      );
  };
  return m;
}

const GLOSS: Record<string, number> = {
  "wooden-bench": 0.32,
  "marble-kitchen-counter": 0.28,
  "liquor-bottle": 0.22,
};

function Bar({
  data,
  progress,
  reduce,
  onReady,
}: {
  data: SceneJson;
  progress: BarProgress;
  reduce: boolean;
  onReady?: () => void;
}) {
  const gltf = useGLTF(`${BASE}/bar-scene.glb`, "/draco/");
  const slugs = useMemo(() => Object.keys(data.textures), [data]);
  const textures = useLoader(
    THREE.TextureLoader,
    slugs.map((s) => `${BASE}/tex/${s}.webp`),
  );
  const { gl, scene, camera, size } = useThree();

  // the environment the glass sees: the baked room, captured from the bottle
  const cube = useMemo(() => {
    const rt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: true });
    return { rt, cam: new THREE.CubeCamera(0.03, 40, rt) };
  }, []);

  const bottle = useRef(new THREE.Vector3());
  const man = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    RectAreaLightUniformsLib.init();
    const tex: Record<string, THREE.Texture> = {};
    slugs.forEach((s, i) => {
      const t = textures[i];
      t.flipY = false; // glTF UV convention
      t.colorSpace = THREE.NoColorSpace; // cube-root data, decoded in the shader
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
      tex[s] = t;
    });
    const glass: THREE.Mesh[] = [];
    gltf.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      let owner: THREE.Object3D | null = mesh;
      while (owner && !data.textures[owner.name] && owner.name !== "drinking-glass") owner = owner.parent;
      const slug = owner?.name ?? "";
      const matName = (mesh.material as THREE.Material).name;
      if (slug === "drinking-glass" || matName.startsWith("glass_v3")) {
        mesh.material = glassMaterial(cube.rt.texture);
        glass.push(mesh);
        return;
      }
      const t = tex[slug];
      if (!t) return;
      const range = data.textures[slug].range;
      mesh.material = GLOSS[slug] ? bakedGlossMaterial(t, range, GLOSS[slug]) : bakedMaterial(t, range);
    });

    const box = new THREE.Box3();
    const b = gltf.scene.getObjectByName("liquor-bottle");
    if (b) box.setFromObject(b).getCenter(bottle.current);
    const m = gltf.scene.getObjectByName("businessman-in-suit");
    if (m) {
      box.setFromObject(m);
      // focus on the shoulders, not the hips
      man.current.set((box.min.x + box.max.x) / 2, box.min.y + (box.max.y - box.min.y) * 0.8, (box.min.z + box.max.z) / 2);
    }

    // capture the room for the glass, with the glass itself out of the picture
    cube.cam.position.copy(bottle.current);
    glass.forEach((g) => (g.visible = false));
    if (b) b.visible = false;
    scene.add(cube.cam);
    cube.cam.update(gl, scene);
    cube.rt.texture.needsPMREMUpdate = true;
    scene.remove(cube.cam);
    glass.forEach((g) => (g.visible = true));
    if (b) b.visible = true;
  }, [gltf, textures, slugs, data, gl, scene, cube]);

  // lights for the live sheen and the glass — values from the .blend
  const lights = useMemo(() => {
    const out: THREE.Light[] = [];
    const L = data.lights;
    const area = L["bottle light"];
    if (area) {
      const s = area.size ?? 0.9;
      const l = new THREE.RectAreaLight(new THREE.Color(...area.color), area.watts / (Math.PI * s * s), s, s);
      l.position.set(...area.position);
      out.push(l);
    }
    for (const name of ["bottle light.001", "Spot"]) {
      const sp = L[name];
      if (!sp) continue;
      const l = new THREE.SpotLight(
        new THREE.Color(...sp.color),
        sp.watts / (4 * Math.PI),
        0,
        (sp.spot ?? 1.2) / 2,
        sp.blend ?? 0.5,
        2,
      );
      l.position.set(...sp.position);
      const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(...sp.quaternion));
      l.target.position.copy(l.position).add(fwd);
      out.push(l);
    }
    return out;
  }, [data]);

  useEffect(() => {
    const area = lights.find((l) => (l as THREE.RectAreaLight).isRectAreaLight);
    area?.lookAt(bottle.current);
  });

  // camera keyframes
  const rig = useMemo(() => {
    const A = data.cameras.Camera;
    const B = data.cameras["Camera.001"];
    const P0 = new THREE.Vector3(...A.position);
    const P1 = new THREE.Vector3(...B.position);
    const f0 = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(...A.quaternion));
    const f1 = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(...B.quaternion));
    const T0 = P0.clone().addScaledVector(f0, A.focusM);
    const T1 = P1.clone().addScaledVector(f1, B.focusM);
    // in at height first, then down and round to the bottle
    const C1 = P0.clone().lerp(P1, 0.42).setY(P0.y - 0.02);
    const C2 = P1.clone().lerp(P0, 0.3).setY(P1.y + 0.22);
    const curve = new THREE.CubicBezierCurve3(P0, C1, C2, P1);
    const hfov = 2 * Math.atan(A.sensorMm / 2 / A.lensMm);
    return { A, B, curve, T0, T1, hfov };
  }, [data]);

  const effects = useMemo(() => {
    const dof = new PhysicalDofEffect();
    return { dof };
  }, []);
  const [grade, setGrade] = useState<FilmGradeEffect | null>(null);
  useEffect(() => {
    let live = true;
    loadLutStrip(`${BASE}/bar-grade-lut.png`, data.lut.size).then((lut) => {
      if (live) setGrade(new FilmGradeEffect(lut, { lutLo: data.lut.lo, lutHi: data.lut.hi, vignette: data.vignette }));
    });
    return () => {
      live = false;
    };
  }, [data]);

  const p = useRef(progress.current);
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), fwd: new THREE.Vector3(), d: new THREE.Vector3() }), []);
  const readyFired = useRef(false);

  // dev: jump the move to a point and render it, for checks without scrolling
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const w = window as unknown as { __barHero?: unknown };
    w.__barHero = {
      snap: (v: number) => {
        progress.current = v;
        p.current = v;
        advance(performance.now());
      },
    };
    return () => {
      delete w.__barHero;
    };
  }, [advance, progress]);

  useFrame((state, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    // a little inertia between the wheel and the lens; none when motion is reduced
    p.current = reduce ? progress.current : THREE.MathUtils.damp(p.current, progress.current, 5, Math.min(dt, 0.1));
    const t = p.current;

    // framing: the Blender sensor is fitted horizontally at 16:9; narrower
    // viewports keep the 16:9 height and crop the sides (portrait opens a touch)
    const aspect = size.width / Math.max(1, size.height);
    const tanH = Math.tan(rig.hfov / 2);
    let tanV = tanH / Math.max(aspect, 16 / 9);
    if (aspect < 1) tanV *= 1 + 0.3 * (1 - aspect);
    const vfov = 2 * Math.atan(tanV);
    if (Math.abs(cam.fov - THREE.MathUtils.radToDeg(vfov)) > 1e-4 || cam.near !== 0.05) {
      cam.fov = THREE.MathUtils.radToDeg(vfov);
      cam.near = 0.05;
      cam.far = 60;
      cam.updateProjectionMatrix();
    }

    const e = easeInOut(t);
    rig.curve.getPoint(e, tmp.pos);
    tmp.tgt.copy(rig.T0).lerp(rig.T1, smooth(0.08, 0.96, t));
    cam.position.copy(tmp.pos);
    cam.lookAt(tmp.tgt);
    cam.getWorldDirection(tmp.fwd);

    // focus: follow the bottle, rack to the man behind the bar mid-move, come back
    const dB = Math.max(0.2, tmp.d.copy(bottle.current).sub(tmp.pos).dot(tmp.fwd));
    const dM = Math.max(0.2, tmp.d.copy(man.current).sub(tmp.pos).dot(tmp.fwd));
    const rack = smooth(0.16, 0.32, t) * (1 - smooth(0.46, 0.66, t));
    const focus = 1 / THREE.MathUtils.lerp(1 / dB, 1 / dM, rack);
    const fStop = THREE.MathUtils.lerp(rig.A.fStop, rig.B.fStop, smooth(0.3, 0.95, t));
    const pxH = state.gl.getDrawingBufferSize(new THREE.Vector2()).y;
    effects.dof.setLens({
      focalM: rig.A.lensMm / 1000,
      fStop,
      focusM: focus,
      sensorHeightM: (2 * tanV * rig.A.lensMm) / 1000,
      heightPx: pxH,
    });

    if (grade) {
      grade.exposure = THREE.MathUtils.lerp(rig.A.exposureEv, rig.B.exposureEv, smooth(0.15, 1, t));
      if (!readyFired.current) {
        readyFired.current = true;
        // one frame later, so the first graded frame is on screen before the poster lifts
        requestAnimationFrame(() => onReady?.());
      }
    }
  });

  return (
    <>
      <primitive object={gltf.scene} />
      {lights.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      {lights.map((l, i) =>
        (l as THREE.SpotLight).isSpotLight ? <primitive key={`t${i}`} object={(l as THREE.SpotLight).target} /> : null,
      )}
      {grade && (
        <EffectComposer multisampling={4}>
          <primitive object={effects.dof} />
          <primitive object={grade} />
        </EffectComposer>
      )}
    </>
  );
}

export default function BarHeroScene({
  progress,
  active = true,
  reduce = false,
  onReady,
}: {
  progress: BarProgress;
  active?: boolean;
  reduce?: boolean;
  onReady?: () => void;
}) {
  const [data, setData] = useState<SceneJson | null>(null);
  useEffect(() => {
    let live = true;
    fetch(`${BASE}/scene.json`)
      .then((r) => r.json())
      .then((j) => live && setData(j));
    return () => {
      live = false;
    };
  }, []);

  return (
    <Canvas
      flat // linear frame; exposure, AgX and the grade happen once, in FilmGradeEffect
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ fov: 21, near: 0.05, far: 60, position: [0.146, 1.327, 7.608] }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 1)}
    >
      <Suspense fallback={null}>
        {data && <Bar data={data} progress={progress} reduce={reduce} onReady={onReady} />}
      </Suspense>
    </Canvas>
  );
}
