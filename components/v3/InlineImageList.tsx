"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export type InlineListItem = {
  label: string;
  image: { src: string; alt: string };
  /** small data line revealed on hover (e.g. "760 m · Kalkalpen") */
  data?: string;
  href?: string;
};

/**
 * Fortress's amenity list: big centred text lines, each carrying a small
 * inline thumbnail before the word. Hovering a line breathes the thumbnail
 * wide and surfaces the item's data line.
 */
export function InlineImageList({ items, tone = "cream" }: { items: InlineListItem[]; tone?: "cream" | "kalk" }) {
  const [active, setActive] = useState<number | null>(null);
  const bg = tone === "cream" ? "bg-cream" : "bg-kalk";

  return (
    <div className={`${bg} text-night`}>
      <ul className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 px-6 py-4 lg:gap-4">
        {items.map((it, i) => {
          const hovered = active === i;
          const Row = (
            <span
              className="inline-flex items-center gap-4 lg:gap-6"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span
                className={`relative inline-block h-[2.6rem] overflow-hidden transition-all duration-500 ease-deep lg:h-[3.4rem] ${
                  hovered ? "w-[5.6rem] lg:w-[7.5rem]" : "w-[3.6rem] lg:w-[4.8rem]"
                }`}
              >
                <Image src={it.image.src} alt={it.image.alt} fill className="object-cover" sizes="120px" />
              </span>
              <span
                className={`font-body text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-none transition-colors duration-500 ${
                  hovered ? "text-copper" : "text-night"
                }`}
              >
                {it.label}
              </span>
              {it.data && (
                <span
                  className={`hidden text-[0.65rem] uppercase tracking-[0.2em] text-copper transition-opacity duration-500 sm:inline ${
                    hovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {it.data}
                </span>
              )}
            </span>
          );
          return (
            <Reveal key={it.label} delay={i * 0.05}>
              <li>
                {it.href ? (
                  <Link href={it.href} data-cursor className="block">
                    {Row}
                  </Link>
                ) : (
                  Row
                )}
              </li>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
