"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * "Zeitstaub" — the loader background as a single point cloud, no meshes.
 *
 * Everything on screen is one <points> draw call whose vertex shader derives each
 * particle's position analytically from (seed, uTime, uProgress). Four populations
 * share the buffer:
 *
 *   kind 0  Sand — grains that drain from the upper bulb, funnel through the neck
 *           and pile into a cone below. A grain's seed IS its place in the queue:
 *           early seeds rest low (they leave first, so the upper surface sinks) and
 *           land wide at the floor; late seeds rest high and land on the cone tip.
 *           uProgress is therefore literally readable as sand level = load state.
 *   kind 1  Glass — the Sanduhr silhouette as a surface of revolution sampled by
 *           points only. Slowly turns, so the form reads as volume without geometry.
 *   kind 2  Plates — the top and bottom rings of the frame.
 *   kind 3  Zeitstaub — free motes that ignore the hourglass and drift out of time.
 *
 * Interaction is a soft push + swirl around the pointer: you can stir the falling
 * column and it re-forms, because no state is stored — the analytic position always
 * pulls the grain back onto its path.
 */

const NECK = 0.055;
const BULB = 0.86;
const TOP = 1.46;

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uDpr;
  uniform float uStir;
  uniform vec2  uPointer;

  attribute vec4  aSeed;
  attribute float aKind;

  varying float vAlpha;
  varying float vKind;
  varying float vGlow;

  const float NECK = ${NECK.toFixed(3)};
  const float BULB = ${BULB.toFixed(3)};
  const float TOP  = ${TOP.toFixed(3)};
  const float TAU  = 6.2831853;

  // Half-width of the hourglass at height y — the only "geometry" in the scene.
  float halfWidth(float y) {
    float k = clamp(abs(y) / TOP, 0.0, 1.0);
    return mix(NECK, BULB, pow(k, 0.72));
  }

  void main() {
    float s0 = aSeed.x;   // queue position of a grain / parameter of a shell point
    vec3  p;
    float alpha = 1.0;
    float glow  = 0.0;
    float sizeMul = 1.0;
    float grip = 1.0;     // how strongly the pointer moves this particle

    if (aKind < 0.5) {
      // ---- sand ------------------------------------------------------------
      float tr = s0 * 0.90;                              // release moment
      float f  = clamp((uProgress - tr) / 0.16, 0.0, 1.0); // 0 resting, 1 landed

      // A — rest in the upper bulb; early grains sit low, so the surface sinks.
      float ay = mix(0.10, TOP - 0.08, s0);
      float aw = halfWidth(ay) * 0.94;
      vec3 A = vec3((aSeed.y * 2.0 - 1.0) * aw, ay, (aSeed.z * 2.0 - 1.0) * 0.12);

      // C — the neck, the single point every grain has to pass.
      vec3 C = vec3((aSeed.w * 2.0 - 1.0) * NECK * 0.8, 0.0, (aSeed.y * 2.0 - 1.0) * 0.04);

      // B — landing spot in the cone; it fills bottom-up and narrows as it grows.
      float by = -TOP + 0.05 + s0 * 0.84;
      float spread = min(halfWidth(by) * 0.92, 0.80) * (1.0 - s0 * 0.86);
      vec3 B = vec3((aSeed.z * 2.0 - 1.0) * spread, by, (aSeed.w * 2.0 - 1.0) * 0.12);

      // ease-in-out cubic: gravity into the neck, deceleration into the heap.
      float u = f < 0.5 ? 4.0 * f * f * f : 1.0 - pow(-2.0 * f + 2.0, 3.0) / 2.0;
      p = mix(mix(A, C, u), mix(C, B, u), u);

      float flight = sin(3.14159265 * f);   // 0 at both ends, 1 mid-fall
      p.x += sin(uTime * 2.3 + s0 * 41.0) * 0.013 * flight;
      p.z += cos(uTime * 1.9 + s0 * 27.0) * 0.013 * flight;
      // grains still waiting tremble almost imperceptibly
      p.x += sin(uTime * 1.1 + s0 * 90.0) * 0.0025 * (1.0 - flight);

      glow = flight;
      sizeMul = 1.0 + flight * 0.45;
      alpha = 1.0;
    } else if (aKind < 1.5) {
      // ---- glass shell ------------------------------------------------------
      float y = mix(-TOP - 0.02, TOP + 0.02, aSeed.y);
      float a = aSeed.z * TAU + uTime * 0.05;
      float r = halfWidth(y) * (1.0 + sin(uTime * 0.6 + aSeed.w * 30.0) * 0.006);
      p = vec3(cos(a) * r, y, sin(a) * r);
      // The profile edge (|cos a| → 1) is where the shell turns away from the
      // camera; concentrating light there draws the silhouette as a hard rim,
      // while the rest of the wall stays a dim body. That contrast — bright
      // outline over near-black — is what lifts the form off the background.
      float rim = pow(abs(cos(a)), 5.0);
      alpha = 0.30 + 0.46 * smoothstep(-1.0, 1.0, sin(a)) + 1.35 * rim;
      sizeMul = 0.70 + rim * 0.62;
      // Hand the rim to the fragment stage as "glow": the outline burns toward
      // cream while the wall behind it stays copper, so the edge reads as drawn.
      glow = rim;
      grip = 0.22;
    } else if (aKind < 2.5) {
      // ---- frame plates -----------------------------------------------------
      float y = aSeed.y < 0.5 ? -TOP - 0.10 : TOP + 0.10;
      float a = aSeed.z * TAU + uTime * 0.05;
      float r = mix(0.42, 0.98, aSeed.w);
      p = vec3(cos(a) * r, y, sin(a) * r);
      alpha = 0.52;
      sizeMul = 0.6;
      grip = 0.15;
    } else {
      // ---- Zeitstaub --------------------------------------------------------
      float drift = uTime * 0.02 + s0;
      p = vec3(
        (aSeed.y * 2.0 - 1.0) * 2.6,
        mod(aSeed.z + drift * 0.35, 1.0) * 4.0 - 2.0,
        (aSeed.w * 2.0 - 1.0) * 1.6
      );
      p.x += sin(uTime * 0.25 + s0 * 20.0) * 0.14;
      // Deliberately faint: the dust is atmosphere, not competition for the form.
      alpha = 0.04 + aSeed.w * 0.07;
      sizeMul = 0.8;
      grip = 0.5;
    }

    // ---- pointer: a soft push with a little swirl in it ----------------------
    vec2 d = p.xy - uPointer;
    float infl = exp(-dot(d, d) / 0.10) * uStir * grip;
    p.xy += normalize(d + vec2(1e-4)) * infl * 0.13;
    p.xy += vec2(-d.y, d.x) * infl * 0.30;
    glow += infl * 0.5;

    // The waist is where the monogram sits, so the field thins out toward the
    // centre — a wide, gradual falloff that bottoms out at 18% rather than
    // clearing, so the neck still reads as glass and the sand still visibly
    // passes through. Radius reaches past the bulbs' pinch so the ramp is long
    // enough to read as depth rather than a vignette punched in the middle.
    alpha *= mix(0.18, 1.0, smoothstep(0.0, 1.6, length(p.xy)));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * sizeMul * uDpr / max(0.001, -mv.z);

    vAlpha = alpha;
    vKind = aKind;
    vGlow = clamp(glow, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  uniform vec3 uGold;
  uniform vec3 uCream;
  uniform vec3 uCopper;

  varying float vAlpha;
  varying float vKind;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.04, d);
    a *= a;
    a += smoothstep(0.18, 0.0, d) * 0.9 * vGlow;

    vec3 col = mix(uGold, uCream, vGlow * 0.75);
    // Additive blending, so these multipliers are the whole exposure control.
    // Sand stays the subject; the glass sits a stop under it but still reads lit.
    if (vKind < 0.5) col *= 3.4;
    // Glass: copper wall, cream rim (vGlow carries the rim term for kinds 1–2).
    if (vKind > 0.5 && vKind < 2.5) col = mix(uCopper * 2.9, uCream * 3.3, vGlow);
    if (vKind > 2.5) col *= 0.55;

    gl_FragColor = vec4(col, a * vAlpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

export function SanduhrField({
  progress = 0,
  grains = 9000,
  interactive = true,
  frozen = false,
}: {
  /** 0 → all sand up top, 1 → all of it fallen. Drives the whole scene. */
  progress?: number;
  grains?: number;
  interactive?: boolean;
  /** prefers-reduced-motion: hold time still, keep the sand level readable. */
  frozen?: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const { viewport, size } = useThree();

  // A denser shell buys a continuous rim line instead of a dotted one.
  const glass = Math.round(grains * 0.6);
  const plates = Math.round(grains * 0.05);
  const dust = Math.round(grains * 0.07);
  const total = grains + glass + plates + dust;

  const geometry = useMemo(() => {
    const pos = new Float32Array(total * 3); // unused, the shader owns position
    const seed = new Float32Array(total * 4);
    const kind = new Float32Array(total);

    for (let i = 0; i < total; i++) {
      // Stratified queue: grain i gets slot i/grains, so the drain is even in time
      // instead of clumping the way pure random would.
      const stratum = i < grains ? (i + Math.random()) / grains : Math.random();
      seed[i * 4 + 0] = stratum;
      seed[i * 4 + 1] = Math.random();
      seed[i * 4 + 2] = Math.random();
      seed[i * 4 + 3] = Math.random();
      kind[i] =
        i < grains ? 0 : i < grains + glass ? 1 : i < grains + glass + plates ? 2 : 3;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    g.setAttribute("aKind", new THREE.BufferAttribute(kind, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    return g;
  }, [total, grains, glass, plates]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSize: { value: 3.4 },
          uDpr: { value: 1 },
          uStir: { value: 0 },
          uPointer: { value: new THREE.Vector2(99, 99) },
          uGold: { value: new THREE.Color("#c57e5b") },
          uCream: { value: new THREE.Color("#f0efeb") },
          uCopper: { value: new THREE.Color("#8c5438") },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Fit the 3-unit-tall Sanduhr into whatever viewport we get (×1.1 presence bump).
  const scale = Math.min(viewport.height / 3.4, viewport.width / 2.4, 1.15) * 1.1;

  const shown = useRef(0);
  // Pointer is tracked on window rather than through r3f's event system: there is
  // no mesh to raycast against, and the loader overlay is pointer-events:none.
  const ndc = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!interactive || frozen) return;
    const onMove = (e: PointerEvent) => {
      ndc.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        active: true,
      };
    };
    const onLeave = () => {
      ndc.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, frozen]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    if (!frozen) u.uTime.value += delta;

    // Ease toward the requested progress so a jumpy loader signal still pours smoothly.
    shown.current += (progress - shown.current) * Math.min(1, delta * 3.2);
    u.uProgress.value = frozen ? progress : shown.current;
    u.uDpr.value = Math.min(2, state.gl.getPixelRatio());

    if (interactive && !frozen) {
      const { x, y, active } = ndc.current;
      // NDC → the point cloud's local space, so the push lands under the cursor.
      const px = ((x * viewport.width) / 2) / scale;
      const py = ((y * viewport.height) / 2) / scale;
      const p = u.uPointer.value as THREE.Vector2;
      p.set(p.x + (px - p.x) * 0.12, p.y + (py - p.y) * 0.12);
      u.uStir.value += ((active ? 1 : 0) - u.uStir.value) * Math.min(1, delta * 2.5);
    }

    // Point size in device pixels should not balloon on very small canvases.
    u.uSize.value = 3.74 * Math.min(1.6, Math.max(0.7, size.height / 900));
  });

  return (
    <points ref={points} frustumCulled={false} scale={scale} geometry={geometry}>
      <primitive object={material} attach="material" />
    </points>
  );
}
