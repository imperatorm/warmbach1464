"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

/**
 * Wet paint, the finishing pass over the Zeit v5 diorama.
 *
 * Two things, after the painted world of davidwhyte.com/experience:
 *
 * 1. A liquid smear that follows the pointer. The pointer paints into a small
 *    off-screen trail canvas — each stamp carries the stroke's direction in
 *    red/green and its wetness in blue — and the trail evaporates a little
 *    every frame. The shader pushes the image along that direction where the
 *    trail is wet, so dragging across the meadow runs the paint the way a wet
 *    brush would, and lets it settle again behind. Where it is wet the colour
 *    is richer and a touch darker, as paint is before it dries.
 * 2. Colour where the hand is. The cut-outs stay the pale washes they are;
 *    only inside a blob around the pointer does the paint deepen — more
 *    saturation, more contrast — as if a wet brush had just gone over that
 *    patch. The blob is not a circle: its edge is pushed in and out by a
 *    slowly drifting noise field, so it reads as a bloom of pigment on damp
 *    paper. It trails the pointer a little, swells in when the pointer comes
 *    onto the scene and dries away when it rests or leaves. The smear trail
 *    feeds the same mask, so a stroke leaves colour behind it as it runs.
 *
 * Reduced motion keeps the colour blob, following the pointer directly, and
 * drops the smear.
 */

const FRAG = /* glsl */ `
uniform sampler2D uTrail;
uniform float uStrength;
uniform float uSaturation;
uniform float uContrast;
uniform vec2 uMouse;     // blob centre, uv
uniform float uAspect;   // width / height
uniform float uRadius;   // in units of screen height
uniform float uPresence; // 0 dry … 1 fully bloomed
uniform float uTime;

void mainUv(inout vec2 uv) {
  vec4 t = texture2D(uTrail, uv);
  vec2 dir = (t.rg - 0.5) * 2.0;
  uv -= dir * t.b * uStrength;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

/** The pigment bloom: a soft disc whose edge is pushed in and out by noise. */
float bloom(vec2 uv) {
  vec2 d = (uv - uMouse) * vec2(uAspect, 1.0);
  float r = length(d);
  // two noise scales: broad lobes, and a ragged fringe like pigment creeping into wet fibres
  float n = fbm(d * 3.2 + uTime * 0.06) - 0.5;
  float fringe = fbm(d * 14.0 - uTime * 0.04) - 0.5;
  float edge = uRadius * (1.0 + n * 0.9 + fringe * 0.25);
  return uPresence * (1.0 - smoothstep(edge * 0.45, edge, r));
}

vec3 saturate3(vec3 c, float s) {
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(l), c, s);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float wet = texture2D(uTrail, uv).b;
  float m = clamp(max(bloom(uv), wet * 0.85), 0.0, 1.0);
  vec3 c = inputColor.rgb;
  vec3 deep = (c - 0.5) * uContrast + 0.5;
  deep = saturate3(deep, uSaturation);
  deep *= 0.96; // wet paint sits a touch darker before it dries
  outputColor = vec4(clamp(mix(c, deep, m), 0.0, 1.0), inputColor.a);
}
`;

class WetPaintEffect extends Effect {
  constructor(trail: THREE.Texture) {
    super("WetPaintEffect", FRAG, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uTrail", new THREE.Uniform(trail)],
        ["uStrength", new THREE.Uniform(0.07)],
        ["uSaturation", new THREE.Uniform(1.6)],
        ["uContrast", new THREE.Uniform(1.22)],
        ["uMouse", new THREE.Uniform(new THREE.Vector2(0.5, 0.5))],
        ["uAspect", new THREE.Uniform(1.6)],
        ["uRadius", new THREE.Uniform(0.2)],
        ["uPresence", new THREE.Uniform(0)],
        ["uTime", new THREE.Uniform(0)],
      ]),
    });
  }
}

/** Trail canvas size; small on purpose — the smear should be soft. */
const SIZE = 256;

export function WetPaint({ reduce }: { reduce: boolean }) {
  const { gl } = useThree();

  const { ctx, texture, effect } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgb(128,128,0)";
    ctx.fillRect(0, 0, SIZE, SIZE);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    if (process.env.NODE_ENV !== "production") {
      // dev-only: lets tooling read the trail
      (window as unknown as { __wetPaint?: unknown }).__wetPaint = { canvas, ctx };
    }
    return { ctx, texture, effect: new WetPaintEffect(texture) };
  }, []);

  // The pointer, in 0–1 canvas coordinates, and how far it moved since the last frame.
  const pointer = useMemo(
    () => ({ x: -1, y: -1, px: -1, py: -1, moved: false, lastMove: -1e9, bx: 0.5, by: 0.5 }),
    [],
  );

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      pointer.x = x;
      pointer.y = y;
      pointer.moved = true;
      pointer.lastMove = performance.now();
    };
    const onLeave = () => {
      pointer.lastMove = -1e9;
    };
    // on window: captions and the hero sit above the canvas and must not swallow the brush
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, pointer]);

  useEffect(() => () => {
    texture.dispose();
    effect.dispose();
  }, [texture, effect]);

  useFrame((state, dt) => {
    // ── the colour bloom ──
    const u = effect.uniforms;
    const step = Math.min(dt, 0.1);
    if (pointer.x >= 0) {
      // the blob trails the hand, like pigment catching up with the brush
      const k = reduce ? 1 : 1 - Math.exp(-step * 9);
      pointer.bx += (pointer.x - pointer.bx) * k;
      pointer.by += (pointer.y - pointer.by) * k;
    }
    (u.get("uMouse")!.value as THREE.Vector2).set(pointer.bx, 1 - pointer.by);
    u.get("uAspect")!.value = gl.domElement.clientWidth / Math.max(1, gl.domElement.clientHeight);
    u.get("uTime")!.value = state.clock.elapsedTime;
    // blooms in while the hand moves, dries out over ~2 s after it rests or leaves
    const resting = (performance.now() - pointer.lastMove) / 1000;
    const target = resting < 1.2 ? 1 : 0;
    const pres = u.get("uPresence")!;
    pres.value += (target - (pres.value as number)) * (1 - Math.exp(-step * (target ? 5 : 1.4)));

    if (reduce) return;
    // evaporate: blend the whole trail a step back towards neutral (no direction, dry)
    ctx.globalCompositeOperation = "source-over";
    // ~0.6 s to half-dry at 60 fps, so a stroke leaves a run that settles visibly
    ctx.fillStyle = "rgba(128,128,0,0.02)";
    ctx.fillRect(0, 0, SIZE, SIZE);

    if (pointer.moved && pointer.px >= 0) {
      const dx = pointer.x - pointer.px;
      const dy = pointer.y - pointer.py;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.0005) {
        // direction into red/green around the neutral 128; canvas y runs down, uv y runs up
        // full direction once the hand is moving at all; speed goes into wetness instead
        const k = Math.min(1, speed * 220) / speed;
        const r = Math.round(128 + dx * k * 127);
        const g = Math.round(128 - dy * k * 127);
        const wet = Math.min(1, 0.55 + speed * 40);
        // the trail canvas is square and stretched over a wide screen: a stamp
        // squashed by the screen's aspect lands round
        const squash = gl.domElement.clientWidth / Math.max(1, gl.domElement.clientHeight);
        const rx = SIZE * (0.07 + Math.min(0.06, speed * 2));
        const steps = Math.max(1, Math.ceil((speed * SIZE) / (rx * 0.35)));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const cx = (pointer.px + dx * t) * SIZE;
          const cy = (pointer.py + dy * t) * SIZE;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(1, squash);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
          grad.addColorStop(0, `rgba(${r},${g},${Math.round(wet * 255)},0.55)`);
          grad.addColorStop(1, `rgba(${r},${g},0,0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, rx, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
    pointer.px = pointer.x;
    pointer.py = pointer.y;
    pointer.moved = false;
    texture.needsUpdate = true;
  });

  return (
    <EffectComposer multisampling={4}>
      <primitive object={effect} />
    </EffectComposer>
  );
}
