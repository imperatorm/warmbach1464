# 3D Architecture — Hero Decanter (Phase 1)

Implementation notes for the `HeroBottleScene` and its parts. Source of truth for
materials, lighting, post-processing, and the fallback strategy. Update when the
scene changes (briefing §8.9).

## Component map

```
components/three/
  HeroBottleScene.tsx   Canvas + composition + onReady signal (default export, dynamic ssr:false)
  CrystalDecanter.tsx   the bottle group: glass, amber, plaque, capsule, wax, base + idle motion
  SceneLighting.tsx     three-point key/fill/rim rig + ambient
  StudioEnvironment.tsx procedural "alpine night" IBL via drei <Environment>/<Lightformer>
  GoldDust.tsx          ~800 additive point motes (maath inSphere)
  PostFX.tsx            EffectComposer: Bloom · ACES · ChromaticAberration · Noise · Vignette
lib/three/
  bottle.ts             lathe profile (kept from prototype), edition variants, Hof coordinates
  engraving.ts          canvas → bumpMap text textures (no external font fetch)
components/sections/
  HeroSection.tsx       WebP still (LCP) → cross-fade to live scene; reduced-motion fallback
app/
  fonts.ts              next/font (Fraunces + Hanken Grotesk), swap-ready for GT Sectra/Söhne
  api/devshot/route.ts  DEV-ONLY: regenerate public/hero-still.webp from the live canvas
```

## Geometry

The bottle is the real **Vetroelite "Capri"** flask, built procedurally in
`lib/three/capri.ts` (it isn't round, so a lathe can't make it). A superellipse
(rounded-rectangle) cross-section is lofted up the height: a rounded rectangle through
the body, morphing — squareness → 2, size → neck radius — across a smoothstepped shoulder
into a circular bar-top neck. Proportions match the 700 mL Capri (168 × 113 × 65 mm →
~3.4 units tall, the wide flat-flask aspect). The amber spirit reuses the body
cross-section, inset from the wall and capped at a fill line below the shoulder.

The previous parametric lathe (`lib/three/bottle.ts`) is retained only for reference/tests
and is no longer rendered.

## A note on units

The briefing's §4.1 material numbers were calibrated for a metre-scale model. The Capri
geometry is built in **scene units** (~3.4 tall), so attenuation, plaque size, light
intensities, and camera distance are tuned to preserve the intended **look** at this scale.
The glass is **clear flint** (not dark-tinted) because that is what the Capri is — the amber
spirit carries the colour, which reads closer to the Macallan / Louis XIII references than a
smoked bottle would.

## Materials (as built)

| Part | Material | Key values |
|---|---|---|
| Glass (clear crystal) | `MeshTransmissionMaterial` | transmission 1, ior 1.5, thickness 0.7, roughness 0.05, chromaticAberration 0.015, no distortion, color `#f4f3ee`, attenuationColor `#eef1ee`, attenuationDistance 6, backside **off** (cleaner refraction), samples 6, resolution 256 |
| Spirit (amber) | `MeshPhysicalMaterial` | color `#b8782a`, emissive `#5e3310` @ 0.6, transmission 0.4, ior 1.36, thickness 1.3, attenuation `#7e4518` @ 2.5; one inner warm pointLight for a luminous core |
| Copper nameplate (flat front) | `MeshPhysicalMaterial` | color `#9a6531`, metalness 0.55, roughness 0.4, emissive `#2a1808` @ 0.25 (so it reads against clear glass), **bumpMap = engraved `N° 017 / 300`** |
| Gold capsule | `MeshPhysicalMaterial` | color `#B8893A`, metalness 1, roughness 0.2; top cap bumpMap = `W//` |
| Wax seal | `MeshPhysicalMaterial` | color `#5a1f1f`, roughness 0.6, sheen 1 (`#7a2a2a`) |
| Base emboss | `MeshStandardMaterial` | bumpMap = `47.4486° N · 12.3936° E`, visible only from below |

**Engraving** (`lib/three/engraving.ts`): text is drawn to an offscreen 2D canvas
(black glyphs on mid-grey) and used as a `bumpMap`, reading as a recessed engraving on
the metal. Done this way so nothing fetches a default font from a CDN at runtime — the
decanter stays fully self-contained. The briefing's "Normal-Map" intent is satisfied via
bump; a true normal map can replace it with the partner asset.

## Lighting

Three-point rig (`SceneLighting.tsx`): directional **key** (top-left, warm `#fff1d6`),
soft **fill** spot (right, cool), gold **rim** spot (behind), plus a low **front fill**
pointLight so the flat front face + nameplate read against the clear glass. Spots use
`decay={0}`. Intensities are in three r155+ physical units.

Base illumination is image-based: `StudioEnvironment.tsx` builds a procedural night
environment from **large soft `<Lightformer>` panels** (key, fill, wide gold back-glow,
top) — like a photographer's softbox tent. This matters for clear curved glass: narrow
bright sources streak ("tiger-stripe") through it, big soft ones give clean gradient
reflections. Baked once (`frames={1}`); no external `.hdr` (swap →
`useEnvironment({ files: "/alpine-night.hdr" })`).

One warm inner `pointLight` inside the bottle gives the spirit a luminous core.

## Post-processing (`PostFX.tsx`)

`EffectComposer` (multisampling 4), order: **Bloom** (intensity 0.45, threshold 0.7,
mipmapBlur) → **ToneMapping** ACES_FILMIC → **ChromaticAberration** (0.0008) → **Noise**
(0.04, overlay) → **Vignette** (darkness 0.55, offset 0.3). Canvas is mounted `flat`
(NoToneMapping on the renderer) so ACES is applied exactly once. No LensFlare, no GodRays.

## Idle motion

Continuous Y-rotation (0.05 rad/s) + sine float (0.4 Hz) on the decanter group.

## Fallback & cross-fade (`HeroSection.tsx`)

- LCP element is `/hero-still.webp` (~11 KB), painted instantly with `fetchPriority="high"`.
- The R3F scene is `dynamic(ssr:false)`; when its suspended resources mount, `onReady`
  flips a state that cross-fades the live canvas over the still (800 ms).
- `prefers-reduced-motion`: the Canvas is **never mounted** — the still is the whole hero,
  no GSAP/R3F motion (briefing §6, §4.4).

## Performance

- Home First Load JS **135 kB** (budget ≤240 kB); 3D loads as a separate lazy chunk.
- `dpr={[1,2]}`, transmission `samples 5 / resolution 256` to bound fragment cost.
- `preserveDrawingBuffer: true` is currently on to allow WebP capture via `toDataURL`;
  **drop it in the Phase 5 perf pass** if mobile fps needs headroom (it has a cost).
- Open Phase-2 perf item: gate the Canvas mount behind age confirmation so 3D doesn't
  initialise behind the Age Gate modal on first visit.

## Swap paths (when real assets arrive)

| Asset | Change |
|---|---|
| GT Sectra / Söhne (licensed) | `app/fonts.ts` → `next/font/local` at `/public/fonts`, same CSS var names |
| Alpine-night `.hdr` | `StudioEnvironment.tsx` → `useEnvironment({ files })` |
| Glass `.glb` (Riedel) | `CrystalDecanter.tsx` → `useGLTF`, drop the lathe; re-shoot the still via `/api/devshot` |
