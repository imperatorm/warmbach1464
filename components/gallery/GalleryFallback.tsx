"use client";

import { useState } from "react";
import Image from "next/image";
import { sectionOrder, warmbachGallery } from "@/lib/gallery";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";

/**
 * The complete gallery with no motion in it at all — four sections, every
 * photograph, the same lightbox. This is what stands in wherever a direction's
 * effect cannot or should not run: reduced motion, or a browser without the
 * APIs the effect needs. It is not a degraded version of the page; it is the
 * whole set, laid out plainly.
 */
export function GalleryFallback() {
  const [index, setIndex] = useState<number | null>(null);
  const { open, close } = useLightbox(warmbachGallery, setIndex);

  return (
    <>
      <div className="mx-auto max-w-[1500px] px-6 pb-32 lg:px-10">
        {sectionOrder.map(({ key, label }) => {
          const items = warmbachGallery.filter((i) => i.section === key);
          if (!items.length) return null;
          return (
            <section key={key} className="mb-20">
              <h2 className="t-hero mb-8 text-[clamp(1.5rem,3vw,2.2rem)] text-night">{label}</h2>
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {items.map((img) => (
                  <button
                    key={img.src}
                    data-cursor
                    onClick={(e) =>
                      open(
                        warmbachGallery.findIndex((i) => i.src === img.src),
                        e.currentTarget.querySelector("img"),
                      )
                    }
                    aria-label={`${label} — Aufnahme öffnen`}
                    className="mb-4 block w-full break-inside-avoid overflow-hidden bg-cream p-2"
                  >
                    <Image
                      src={img.src}
                      width={img.width}
                      height={img.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt=""
                      className="h-auto w-full"
                    />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <GalleryLightbox
        images={warmbachGallery}
        index={index}
        onClose={close}
        onPage={(d) =>
          setIndex((i) => (i === null ? i : (i + d + warmbachGallery.length) % warmbachGallery.length))
        }
      />
    </>
  );
}
