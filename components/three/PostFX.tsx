"use client";

import { useMemo } from "react";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Vector2 } from "three";

/**
 * Post-processing stack (briefing §4.3). Order matters: Bloom works in HDR,
 * then ACES tone-maps to display range, then the display-space grain/CA/vignette.
 * The Canvas is mounted `flat` (NoToneMapping on the renderer) so ACES is applied
 * exactly once, here. Deliberately NO LensFlare and NO GodRays — Bloom carries it.
 */
export function PostFX() {
  const caOffset = useMemo(() => new Vector2(0.0008, 0.0008), []);
  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <ChromaticAberration
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise opacity={0.04} premultiply blendFunction={BlendFunction.OVERLAY} />
      <Vignette darkness={0.55} offset={0.3} />
    </EffectComposer>
  );
}
