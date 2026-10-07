"use client";

import { CraftPanorama } from "@/components/home-variants/VariantC";
import { BottleAnnotated } from "@/components/home-variants/VariantA";

/**
 * 03 Manufaktur + 04 Flasche as one pinned horizontal run: the Panorama
 * chapter panels (variant C), ending on the annotated bottle (variant A) as
 * the final panel.
 */
export function CraftPanoramaBand() {
  return <CraftPanorama tail={<BottleAnnotated asPanel />} />;
}
