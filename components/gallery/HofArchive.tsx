"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { warmbachGallery, sectionOrder, type GallerySection } from "@/lib/gallery";

type Filter = GallerySection | "alle";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "alle", label: "Alle" },
  ...sectionOrder.map((s) => ({ key: s.key as Filter, label: s.label })),
];

/**
 * Das Bildarchiv — the filter IS the headline (MOUTHWASH Studio's pattern):
 * the four rooms of the house are set at poster scale, the chosen one in full
 * ink and the rest receded, so choosing a room is the same gesture as reading
 * the title. Below it a flush grid, and one shared lightbox with keyboard
 * paging over whatever is currently filtered.
 */
export function HofArchive() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(
    () => (filter === "alle" ? warmbachGallery : warmbachGallery.filter((i) => i.section === filter)),
    [filter],
  );

  const labelOf = useCallback(
    (s: GallerySection) => sectionOrder.find((x) => x.key === s)?.label ?? "",
    [],
  );

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length)),
    [shown.length],
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
      {/* The filter, set as the title */}
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <h1 className="t-poster flex flex-wrap items-baseline gap-x-[0.3em] gap-y-1 text-[clamp(1.9rem,6.4vw,4.6rem)] leading-[1.02]">
          {FILTERS.map((f, i) => {
            const on = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFilter(f.key);
                  setOpen(null);
                }}
                aria-pressed={on}
                data-cursor
                className={`transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terrakotta ${
                  on ? "text-night" : "text-night/25 hover:text-night/55"
                }`}
              >
                {f.label}
                {i < FILTERS.length - 1 && <span aria-hidden className="text-night/25">,</span>}
              </button>
            );
          })}
        </h1>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-night/20 pt-5">
          <p className="max-w-md text-sm leading-relaxed text-night/75">
            Hof, Bar, Brennerei und der kupferne Kothe-Kessel — am Osthang über Kitzbühel.
          </p>
          <p aria-live="polite" className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-terrakotta">
            {String(shown.length).padStart(2, "0")} {shown.length === 1 ? "Aufnahme" : "Aufnahmen"}
          </p>
        </div>
      </div>

      {/* The grid */}
      <div className="mx-auto mt-12 max-w-[1500px] px-6 lg:px-10">
        <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          <AnimatePresence mode="popLayout">
            {shown.map((img, i) => (
              <motion.li
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  data-cursor
                  onClick={() => setOpen(i)}
                  aria-label={`${labelOf(img.section)} — Aufnahme ${i + 1} von ${shown.length} öffnen`}
                  className="group relative block w-full overflow-hidden bg-night/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terrakotta"
                >
                  <span className="relative block aspect-[4/3]">
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  </span>
                  {/* Room label, revealed on hover/focus */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/85 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="text-[0.55rem] uppercase tracking-[0.22em] text-cream">
                      {labelOf(img.section)}
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && shown[open] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${labelOf(shown[open].section)} — Aufnahme ${open + 1} von ${shown.length}`}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-night/95 backdrop-blur-sm"
          >
            <button
              onClick={close}
              aria-label="Schließen"
              className="absolute right-5 top-5 z-10 text-2xl text-cream/70 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label="Vorherige Aufnahme"
              className="absolute left-2 z-10 px-4 py-6 text-3xl text-cream/60 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:left-4"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Nächste Aufnahme"
              className="absolute right-2 z-10 px-4 py-6 text-3xl text-cream/60 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:right-4"
            >
              ›
            </button>

            <motion.figure
              key={shown[open].src}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center"
            >
              <Image
                src={shown[open].src}
                width={shown[open].width}
                height={shown[open].height}
                sizes="92vw"
                priority
                className="h-auto max-h-[84vh] w-auto max-w-[92vw] object-contain"
                alt=""
              />
              <figcaption className="mt-4 flex items-baseline gap-4 text-[0.6rem] uppercase tracking-[0.22em] text-cream/70">
                <span className="text-gold">{labelOf(shown[open].section)}</span>
                <span className="tabular-nums">
                  {open + 1} / {shown.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
