"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { warmbachGallery, sectionOrder } from "@/lib/gallery";

/**
 * Warmbachhof gallery — a flowing hero strip of the strongest shots up top
 * (auto-drifting, hover to pause), then sectioned (Der Hof → Die Bar → Die
 * Brennerei → Warmbach Lounge). "Der Hof" uses an even, flush grid (equal cells);
 * the portrait-rich sections stay masonry so nothing is cropped. One shared
 * full-screen lightbox over all images (click to open, ←/→ to page, Esc to close).
 *
 * Sits on the light kalk ground (Fassade): edge-fades blend into kalk, section
 * labels are terracotta, cells get a copper hairline. The lightbox stays dark.
 */
export function HofGallery() {
  const images = warmbachGallery;
  const featured = images.filter((i) => i.featured);
  const [open, setOpen] = useState<number | null>(null);

  const openSrc = useCallback(
    (src: string) => setOpen(images.findIndex((i) => i.src === src)),
    [images],
  );
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, go]);

  return (
    <>
      {/* Flowing hero strip — full-bleed, auto-drifting, hover to pause */}
      {featured.length > 0 && (
        <div className="relative mb-24 w-full overflow-hidden py-1">
          <div className="gallery-flow flex w-max gap-4">
            {[...featured, ...featured].map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                data-cursor
                onClick={() => openSrc(img.src)}
                aria-label="Foto öffnen"
                className="h-[19rem] shrink-0 overflow-hidden border border-copper/15 lg:h-[26rem]"
              >
                <Image
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  sizes="45vw"
                  className="h-full w-auto object-cover"
                  alt=""
                  priority={i < 4}
                />
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-kalk to-transparent lg:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-kalk to-transparent lg:w-28" />
        </div>
      )}

      {/* Sections */}
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        {sectionOrder.map(({ key, label }) => {
          const items = images.filter((i) => i.section === key);
          if (!items.length) return null;
          const even = key === "haus"; // Der Hof: flush, equal-cell grid

          return (
            <section key={key} className="mb-20">
              <p className="mb-7 text-center font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta">
                {label}
              </p>

              {even ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {items.map((img) => (
                    <button
                      key={img.src}
                      data-cursor
                      onClick={() => openSrc(img.src)}
                      aria-label={`${label} — Foto öffnen`}
                      className="group relative aspect-[4/3] overflow-hidden border border-copper/15 bg-night/5"
                    >
                      <Image
                        src={img.src}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        alt=""
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                  {items.map((img) => (
                    <button
                      key={img.src}
                      data-cursor
                      onClick={() => openSrc(img.src)}
                      aria-label={`${label} — Foto öffnen`}
                      className="group mb-4 block w-full break-inside-avoid overflow-hidden border border-copper/15 bg-night/5"
                    >
                      <Image
                        src={img.src}
                        width={img.width}
                        height={img.height}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        alt=""
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Lightbox — stays dark over the page */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-night/95 backdrop-blur-sm"
          >
            <button onClick={close} aria-label="Schließen" className="absolute right-5 top-5 z-10 text-2xl text-cream/70 transition-colors hover:text-gold">✕</button>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Vorheriges" className="absolute left-2 z-10 px-4 py-6 text-3xl text-cream/60 transition-colors hover:text-gold sm:left-4">‹</button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Nächstes" className="absolute right-2 z-10 px-4 py-6 text-3xl text-cream/60 transition-colors hover:text-gold sm:right-4">›</button>
            <motion.div
              key={images[open].src}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center"
            >
              <Image
                src={images[open].src}
                width={images[open].width}
                height={images[open].height}
                sizes="92vw"
                priority
                className="h-auto max-h-[86vh] w-auto max-w-[92vw] object-contain"
                alt=""
              />
              <p className="mt-3 text-xs tracking-wide text-stone">{open + 1} / {images.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
