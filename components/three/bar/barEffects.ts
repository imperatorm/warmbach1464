import { Effect, EffectAttribute, BlendFunction } from "postprocessing";
import * as THREE from "three";

/**
 * The two post effects of the bar hero. Both work on the scene-linear frame
 * the composer renders (half float, no tone mapping on the renderer):
 *
 *   PhysicalDofEffect  thin-lens depth of field from the Blender camera's own
 *                      numbers — focal length, f-stop, focus distance, sensor —
 *                      so f/2.4 at 5.2 m and f/1.4 at 2.1 m blur exactly as much
 *                      as Cycles did. A scatter-as-gather disc, one pass.
 *
 *   FilmGradeEffect    exposure → Blender's AgX → the Warmbach grade, all baked
 *                      into one 33³ LUT (generated from the .blend's compositor
 *                      grade), then the fitted vignette and a fine grain.
 *
 * They are merged into one EffectPass; DOF has to come first because it is the
 * convolution that samples `inputBuffer`.
 */

const dofFragment = /* glsl */ `
uniform float focusDist;   // metres along the view axis
uniform float cocK;        // px · m: radius = cocK * |d - s| / d
uniform float maxRadius;   // px

float cocAt(const in float d) {
  return min(cocK * abs(d - focusDist) / max(d, 1e-3), maxRadius);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  float d0 = -getViewZ(depth);
  float c0 = cocAt(d0);
  // The search disc follows this pixel's own blur, with a floor so out-of-focus
  // foreground can still bleed a little over what is sharp behind it.
  float R = max(c0, 3.0);
  if (R < 0.75) { outputColor = inputColor; return; }

  vec3 acc = inputColor.rgb;
  float wsum = 1.0;
  float rot = hash12(uv * resolution) * 6.2831853;
  for (int i = 0; i < DOF_SAMPLES; i++) {
    float fi = (float(i) + 0.5) / float(DOF_SAMPLES);
    float r = sqrt(fi) * R;
    float a = float(i) * 2.39996323 + rot;
    vec2 suv = uv + vec2(cos(a), sin(a)) * r * texelSize;
    float sd = -getViewZ(readDepth(suv));
    float sc = cocAt(sd);
    // what lies behind cannot blur over what is in front of it more than
    // this pixel itself is blurred
    float ec = sd > d0 ? min(sc, c0) : sc;
    float w = clamp(ec - r + 1.0, 0.0, 1.0);
    acc += texture2D(inputBuffer, suv).rgb * w;
    wsum += w;
  }
  outputColor = vec4(acc / wsum, inputColor.a);
}
`;

export class PhysicalDofEffect extends Effect {
  constructor({ samples = 56 }: { samples?: number } = {}) {
    super("PhysicalDofEffect", dofFragment, {
      attributes: EffectAttribute.DEPTH | EffectAttribute.CONVOLUTION,
      blendFunction: BlendFunction.NORMAL,
      defines: new Map([["DOF_SAMPLES", String(samples)]]),
      uniforms: new Map<string, THREE.Uniform>([
        ["focusDist", new THREE.Uniform(5)],
        ["cocK", new THREE.Uniform(0)],
        ["maxRadius", new THREE.Uniform(36)],
      ]),
    });
  }

  /**
   * Thin lens. `heightPx` is the drawing-buffer height and `sensorHeightM`
   * the sensor height the current vertical field of view corresponds to, so
   * the blur scales with whatever the viewport crops.
   */
  setLens(o: { focalM: number; fStop: number; focusM: number; sensorHeightM: number; heightPx: number }) {
    const { focalM: f, fStop: N, focusM: s, sensorHeightM, heightPx } = o;
    // diameter on the sensor = f² |d − s| / (N d (s − f)); halve for a radius
    const k = (0.5 * (f * f)) / (N * Math.max(s - f, 1e-3));
    this.uniforms.get("focusDist")!.value = s;
    this.uniforms.get("cocK")!.value = (k * heightPx) / sensorHeightM;
    // a ceiling relative to the frame keeps the gather sane on huge screens
    this.uniforms.get("maxRadius")!.value = Math.max(8, heightPx * 0.034);
  }
}

const gradeFragment = /* glsl */ `
precision highp sampler3D;
uniform sampler3D lut;
uniform float exposure;
uniform vec2 lutRange;     // log2 range the LUT's input axis covers
uniform float lutSize;
uniform vec3 vignette;     // amount, start radius, power
uniform float grain;

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = max(inputColor.rgb * exp2(exposure), vec3(1e-10));
  vec3 l = clamp((log2(c) - lutRange.x) / (lutRange.y - lutRange.x), 0.0, 1.0);
  vec3 t = l * ((lutSize - 1.0) / lutSize) + 0.5 / lutSize;
  vec3 dsp = texture(lut, t).rgb;            // display-referred, graded

  vec2 p = uv * 2.0 - 1.0;
  float r = length(p) * 0.70710678;
  float v = clamp((r - vignette.y) / (1.0 - vignette.y), 0.0, 1.0);
  v = v * v * (3.0 - 2.0 * v);
  dsp *= 1.0 - vignette.x * pow(v, vignette.z);

  // grain sits in the mids, as film grain does, and is fine enough to also
  // dither the 8-bit bakes
  float n = hash13(vec3(uv * resolution, fract(time * 7.3) * 113.0)) - 0.5;
  float lum = dot(dsp, vec3(0.2126, 0.7152, 0.0722));
  dsp += n * grain * (0.35 + 1.3 * lum * (1.0 - lum));

  outputColor = sRGBToLinear(vec4(clamp(dsp, 0.0, 1.0), inputColor.a));
}
`;

export class FilmGradeEffect extends Effect {
  constructor(lut: THREE.Data3DTexture, o: { lutLo: number; lutHi: number; vignette: [number, number, number] }) {
    super("FilmGradeEffect", gradeFragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, THREE.Uniform>([
        ["lut", new THREE.Uniform(lut)],
        ["exposure", new THREE.Uniform(3)],
        ["lutRange", new THREE.Uniform(new THREE.Vector2(o.lutLo, o.lutHi))],
        ["lutSize", new THREE.Uniform(lut.image.width)],
        ["vignette", new THREE.Uniform(new THREE.Vector3(...o.vignette))],
        ["grain", new THREE.Uniform(0.035)],
      ]),
    });
  }

  set exposure(ev: number) {
    this.uniforms.get("exposure")!.value = ev;
  }
}

/**
 * The LUT ships as an N²×N PNG strip: x = b·N + r, y = g (top row g = 0).
 * Read it through a canvas into a Data3DTexture (r fastest, then g, then b).
 */
export async function loadLutStrip(url: string, size: number): Promise<THREE.Data3DTexture> {
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const src = ctx.getImageData(0, 0, img.width, img.height).data;
  const n = size;
  const data = new Uint8Array(n * n * n * 4);
  for (let b = 0; b < n; b++)
    for (let g = 0; g < n; g++)
      for (let r = 0; r < n; r++) {
        const si = (g * img.width + b * n + r) * 4;
        const di = ((b * n + g) * n + r) * 4;
        data[di] = src[si];
        data[di + 1] = src[si + 1];
        data[di + 2] = src[si + 2];
        data[di + 3] = 255;
      }
  const tex = new THREE.Data3DTexture(data, n, n, n);
  tex.format = THREE.RGBAFormat;
  tex.type = THREE.UnsignedByteType;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.ClampToEdgeWrapping;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return tex;
}
