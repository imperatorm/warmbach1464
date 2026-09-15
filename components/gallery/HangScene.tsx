"use client";

import * as THREE from "three";
import { warmbachGallery } from "@/lib/gallery";

/**
 * Der Hang — the photographs pinned along the east-facing slope.
 *
 * Written straight against three.js rather than through a React reconciler:
 * this is one render loop over twenty-six planes, and it has no business
 * re-rendering a component tree sixty times a second. It also keeps the
 * gallery's payload to three plus this file.
 *
 * Each frame sits on a slow arc that falls away as it goes, the way the
 * orchard runs down off the ridge. Scroll travels the camera along it; the
 * speed of that travel bends the planes and pulls a chromatic separation
 * through them which resolves to clean the moment the slope stops. The frame
 * under the cursor lifts toward the viewer, squares up, and ripples from the
 * point being touched.
 */

const CURVE_RADIUS = 13;
/** Radians between neighbouring frames along the slope. */
const ARC_STEP = 0.165;
const DROP_PER_FRAME = 0.2;
/** Frames stand off the path to either side; the camera walks between them. */
const SIDE_OFFSET = 3.1;

const vertexShader = /* glsl */ `
  uniform float uBend;
  uniform float uHover;
  uniform vec2  uPointer;
  varying vec2  vUv;
  varying float vLift;

  void main() {
    vUv = uv;
    vec3 p = position;

    // Travel bends the sheet about its own centre — a held photograph flexing
    // as it is carried, not a wobble laid on top of it.
    p.z += sin(uv.x * 3.14159) * uBend * 1.6;
    p.y += cos(uv.x * 3.14159) * uBend * 0.35;

    // Under the cursor the surface swells out from the point being touched.
    float d = distance(uv, uPointer * 0.5 + 0.5);
    float ripple = smoothstep(0.62, 0.0, d) * uHover;
    p.z += ripple * 0.42;
    vLift = ripple;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uBend;
  uniform float uDim;
  uniform float uFade;
  uniform float uFar;
  varying vec2  vUv;
  varying float vLift;

  void main() {
    float shift = clamp(abs(uBend), 0.0, 1.0) * 0.0045;
    float r = texture2D(uMap, vUv + vec2(shift, 0.0)).r;
    vec4  g = texture2D(uMap, vUv);
    float b = texture2D(uMap, vUv - vec2(shift, 0.0)).b;

    vec3 col = vec3(r, g.g, b);
    // A frame nobody is addressing sits back into the slope's own light.
    col = mix(col, col * 0.62 + vec3(0.07, 0.10, 0.07), uDim);
    // Distance falls into the bronze-green ground rather than to black.
    col = mix(col, vec3(0.114, 0.161, 0.114), uFar);
    col += vLift * 0.10;

    gl_FragColor = vec4(col, uFade);
  }
`;

export type HangHandle = {
  /** 0 → 1 along the slope. */
  setProgress: (p: number) => void;
  dispose: () => void;
};

export function createHangScene(
  canvas: HTMLCanvasElement,
  opts: {
    onActive: (i: number | null) => void;
    onSelect: (i: number) => void;
  },
): HangHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(new THREE.Color("#1d291d"));

  const scene = new THREE.Scene();
  // Distance is carried in the shader, not by scene.fog — a ShaderMaterial
  // does not inherit it, and the falloff wants to be the same curve as uDim.

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 90);

  const loader = new THREE.TextureLoader();
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2(-2, -2);

  type FrameMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> & {
    userData: {
      index: number;
      angle: number;
      side: number;
      baseX: number;
      baseZ: number;
      hover: number;
      target: THREE.Vector2;
    };
  };

  const frames: FrameMesh[] = warmbachGallery.map((img, i) => {
    const portrait = img.height > img.width;
    const w = portrait ? 3.0 : 4.3;
    const h = portrait ? 4.3 : 2.87;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uMap: { value: null },
        uBend: { value: 0 },
        uHover: { value: 0 },
        uDim: { value: 0 },
        uFade: { value: 0 },
        uFar: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
      },
    });

    // Each photograph fades up as it arrives rather than popping in.
    loader.load(img.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      material.uniforms.uMap.value = tex;
    });

    // Alternating sides of the path, at varied stand-off, so the descent is
    // something you move through rather than a wall you face.
    const side = i % 2 === 0 ? 1 : -1;
    const stand = SIDE_OFFSET + ((i * 37) % 11) * 0.16;
    const angle = i * ARC_STEP;
    const radius = CURVE_RADIUS + side * stand;

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 28, 20), material) as FrameMesh;
    const baseX = Math.sin(angle) * radius;
    const baseZ = CURVE_RADIUS - Math.cos(angle) * radius;
    mesh.position.set(baseX, -i * DROP_PER_FRAME + (i % 3 === 0 ? 0.55 : -0.35), baseZ);
    // Each frame turns to face the path it stands beside.
    mesh.rotation.y = -angle + side * 0.26;
    mesh.userData = {
      index: i,
      angle,
      side,
      baseX,
      baseZ,
      hover: 0,
      target: new THREE.Vector2(),
    };
    scene.add(mesh);
    return mesh;
  });

  let active: number | null = null;
  let progress = 0;
  let travelled = 0;
  let bend = 0;
  let raf = 0;
  let running = true;

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Portrait viewports get a wider lens: the corridor is a horizontal thing,
    // and at 48° a phone would see one frame at a time.
    camera.fov = camera.aspect < 1 ? 74 : 48;
    camera.updateProjectionMatrix();
  };
  resize();

  const onPointerMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointerNdc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };
  const onPointerLeave = () => pointerNdc.set(-2, -2);
  const onClick = () => {
    if (active !== null) opts.onSelect(active);
  };

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("click", onClick);
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();

  const tick = () => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);

    const total = warmbachGallery.length - 1;
    const prev = travelled;
    travelled += (progress * total - travelled) * Math.min(1, dt * 3.4);

    const speed = (travelled - prev) / Math.max(dt, 0.001);
    bend += (THREE.MathUtils.clamp(speed * 0.05, -0.65, 0.65) - bend) * Math.min(1, dt * 5);

    // The camera rides the same arc, set back inside it and looking ahead
    // down the slope rather than straight at the next frame.
    const a = travelled * ARC_STEP;
    camera.position.set(
      Math.sin(a) * CURVE_RADIUS,
      -travelled * DROP_PER_FRAME + 0.35,
      CURVE_RADIUS - Math.cos(a) * CURVE_RADIUS,
    );
    // The camera looks along the path's own tangent, so the corridor opens
    // ahead of it. Aiming at a point further round the arc instead would turn
    // the frames beside it edge-on and leave the middle empty.
    camera.lookAt(
      camera.position.x + Math.cos(a) * 6,
      camera.position.y - DROP_PER_FRAME * 1.1,
      camera.position.z + Math.sin(a) * 6,
    );

    raycaster.setFromCamera(pointerNdc, camera);
    const hit = raycaster.intersectObjects(frames, false)[0];
    const hitIndex = hit ? (hit.object as FrameMesh).userData.index : null;
    if (hitIndex !== active) {
      active = hitIndex;
      opts.onActive(active);
    }
    if (hit?.uv) {
      const mesh = hit.object as FrameMesh;
      mesh.userData.target.set(hit.uv.x * 2 - 1, hit.uv.y * 2 - 1);
    }

    for (const mesh of frames) {
      const u = mesh.material.uniforms;
      const isActive = mesh.userData.index === active;
      mesh.userData.hover += ((isActive ? 1 : 0) - mesh.userData.hover) * Math.min(1, dt * 7);

      u.uBend.value = bend;
      u.uHover.value = mesh.userData.hover;
      u.uDim.value = active === null ? 0 : (1 - mesh.userData.hover) * 0.9;
      u.uPointer.value.lerp(mesh.userData.target, Math.min(1, dt * 8));
      if (u.uMap.value) u.uFade.value = Math.min(1, u.uFade.value + dt * 1.6);
      const dist = mesh.position.distanceTo(camera.position);
      u.uFar.value = THREE.MathUtils.clamp((dist - 7) / 13, 0, 1) * (1 - mesh.userData.hover);

      const lift = mesh.userData.hover;
      const wantX = mesh.userData.baseX - mesh.userData.side * lift * 2.2;
      const wantZ = mesh.userData.baseZ - mesh.userData.side * lift * 0.3;
      mesh.position.x += (wantX - mesh.position.x) * Math.min(1, dt * 6);
      mesh.position.z += (wantZ - mesh.position.z) * Math.min(1, dt * 6);
      const wantY = -mesh.userData.angle + mesh.userData.side * 0.26 * (1 - lift);
      mesh.rotation.y += (wantY - mesh.rotation.y) * Math.min(1, dt * 6);
    }

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    setProgress: (p) => {
      progress = p;
    },
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      for (const mesh of frames) {
        mesh.geometry.dispose();
        mesh.material.uniforms.uMap.value?.dispose?.();
        mesh.material.dispose();
      }
      renderer.dispose();
    },
  };
}
