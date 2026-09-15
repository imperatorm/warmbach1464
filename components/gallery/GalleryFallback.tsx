"use client";

import { useState } from "react";
import Image from "next/image";
import { sectionOrder, warmbachGallery } from "@/lib/gallery";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";

/**
 * The complete gallery with no motion in it at all — four sections, every
 * photograph, the same lightbox. This is what stands in wherever a direction's
 * effect cannot or should not run: reduced motion, a touch device, or a
 * browser without the APIs the effect needs. It is not a degraded version of
 * the page; it is the whole set, laid out plainly, and it carries its own
 * heading and its own ground so it reads the same whichever study it stands
 * in for — two of the three sit on a night page its ink could not survive.
 */
export function GalleryFallback() {
  const [index, setIndex] = useState<number | null>(null);
  const { open, close } = useLightbox(warmbachGallery, setIndex);

  return (
    <>
      <div className="min-h-[60svh] bg-kalk text-night">
        <div className="mx-auto max-w-[1500px] px-6 pb-32 pt-16 lg:px-10 lg:pt-24">
          <header className="mb-14">
            <h1 className="t-hero text-[clamp(1.8rem,3.4vw,2.8rem)] text-night">Der Warmbachhof</h1>
            <p className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-night/70">
              <span className="tabular-nums">{warmbachGallery.length}</span> Aufnahmen
              <span className="mx-2 text-night/40">·</span>
              Kitzbühel
            </p>
          </header>
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
