import type { Metadata } from "next";
import Link from "next/link";
import { BottleAnnotated, CraftIndex } from "@/components/home-variants/VariantA";
import { BottleStudyGallery, CraftGallery } from "@/components/home-variants/VariantB";
import { BottleSplit, CraftPanorama } from "@/components/home-variants/VariantC";

export const metadata: Metadata = {
  title: "03 / 04 — Varianten",
  robots: { index: false, follow: false },
};

const VARIANTS = {
  a: { name: "A · Index", craft: CraftIndex, bottle: BottleAnnotated },
  b: { name: "B · Gallery", craft: CraftGallery, bottle: BottleStudyGallery },
  c: { name: "C · Panorama", craft: CraftPanorama, bottle: BottleSplit },
} as const;

type Key = keyof typeof VARIANTS;

/** Staging route (noindex): /design/sections?v=a|b|c — one direction at a time. */
export default function SectionVariants({ searchParams }: { searchParams: { v?: string } }) {
  const key: Key = (["a", "b", "c"] as const).includes(searchParams.v as Key) ? (searchParams.v as Key) : "a";
  const { craft: Craft, bottle: Bottle } = VARIANTS[key];

  return (
    <div className="pt-[77px]">
      <nav aria-label="Varianten" className="sticky top-[77px] z-30 flex justify-center gap-2 border-b border-cream/10 bg-night/85 py-3 backdrop-blur-md">
        {(Object.keys(VARIANTS) as Key[]).map((k) => (
          <Link
            key={k}
            href={`/design/sections?v=${k}`}
            data-cursor
            aria-current={k === key ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-5 text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${
              k === key ? "bg-cream text-night" : "text-cream/70 hover:text-cream"
            }`}
          >
            {VARIANTS[k].name}
          </Link>
        ))}
      </nav>
      <Craft />
      <Bottle />
    </div>
  );
}
