"use client";

/**
 * Three-point rig (briefing §4.1). Intensities are scaled into three r155+
 * physical units and the accent spots use decay={0} so the briefing's
 * key:fill:rim ratio holds regardless of distance. The Environment (see
 * StudioEnvironment) supplies the base image-based light for the glass/metal;
 * these lights carve the silhouette and the gold rim.
 */
export function SceneLighting() {
  return (
    <>
      {/* Key — top-left, ~4500 K sunset warmth */}
      <directionalLight position={[-4, 5, 3]} intensity={3.0} color="#fff1d6" />

      {/* Fill — soft, from the right, wide penumbra */}
      <spotLight
        position={[5, 1.5, 3.5]}
        angle={0.9}
        penumbra={1}
        decay={0}
        intensity={0.9}
        color="#3a2818"
      />

      {/* Rim — from behind, narrow gold cone tracing the bottle's edge */}
      <spotLight
        position={[0, 2.5, -5]}
        angle={0.45}
        penumbra={0.6}
        decay={0}
        intensity={1.8}
        color="#c57e5b"
      />

      {/* Floor of light so the deepest shadows aren't pure void */}
      <ambientLight intensity={0.18} />

      {/* Front fill — lets the flat front face + copper nameplate read (clear glass) */}
      <pointLight position={[0.6, -0.2, 4.5]} intensity={0.5} decay={0} color="#ffe9c8" />
    </>
  );
}
