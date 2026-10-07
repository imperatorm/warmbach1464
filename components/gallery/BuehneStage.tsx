"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { sectionOrder, warmbachGallery } from "@/lib/gallery";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";
import { ChevronLeft, ChevronRight } from "./icons";

const N = warmbachGallery.length;
const pad = (n: number) => String(n).padStart(2, "0");
const labelOf = (i: number) =>
  sectionOrder.find((s) => s.key === warmbachGallery[i].section)?.label ?? "";

/** Where each part of the estate begins in the set, and how long it runs. */
const ACTS = sectionOrder.map(({ key, label }) => ({
  key,
  label,
  start: warmbachGallery.findIndex((i) => i.section === key),
  count: warmbachGallery.filter((i) => i.section === key).length,
}));

/** A touch has to travel this far sideways before it counts as a swipe. */
const SWIPE = 48;

const control =
  "inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 bg-night/70 text-cream/80 backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-gold";

/**
 * Die Bühne — the gallery as a viewer, not a grid.
 *
 * One photograph holds the stage at a time, sized from its own proportions so
 * the frame never collapses around a loading image. Beneath it, every print in
 * the set runs along a filmstrip with the four parts of the estate marked off
 * between them; above it, the four parts are the chips that jump the stage to
 * their first frame. Arrow keys page, a sideways swipe pages on touch, and the
 * frame on stage opens full-screen the way every other print in the house
 * does.
 *
 * The neighbours of the frame on stage are already in the DOM, so a step in
 * either direction is a crossfade and never a wait. Nothing here needs a
 * fallback: without motion the fade is a cut, and the page is otherwise the
 * same everywhere.
 *
 * After the photo viewers on Navan and KAYAK, and Airbnb's counter-and-caption
 * lightbox (Mobbin).
 */
export function BuehneStage() {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [index, setIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const { open, close } = useLightbox(warmbachGallery, setIndex);

  const go = useCallback((d: number) => setCurrent((c) => (c + d + N) % N), []);

  // The arrow keys page the stage — unless the lightbox is up, which owns them.
  useEffect(() => {
    if (index !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      go(e.key === "ArrowRight" ? 1 : -1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, go]);

  // The strip follows the stage: the frame on stage is kept under the middle
  // of the strip. The strip scrolls; the page never does.
  useEffect(() => {
    const strip = stripRef.current;
    const t = thumbs.current[current];
    if (!strip || !t) return;
    strip.scrollTo({
      left: t.offsetLeft - strip.clientWidth / 2 + t.offsetWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [current, reduce]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    touch.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const t = touch.current;
    touch.current = null;
    if (!t || e.pointerType !== "touch") return;
    const dx = e.clientX - t.x;
    const dy = e.clientY - t.y;
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      // A swipe is not a tap; the click that may follow it must not open the
      // lightbox. The flag clears itself in case no click follows at all.
      window.setTimeout(() => {
        swiped.current = false;
      }, 300);
      go(dx < 0 ? 1 : -1);
    }
  };

  const img = warmbachGallery[current];
  const ratio = img.width / img.height;
  const around = [-1, 0, 1].map((d) => (current + d + N) % N);

  return (
    <>
      {/* Four rows: the acts, the stage, the caption, the strip. A grid rather
          than a flex column because a grid row is a definite height even when
          the section itself is only a min-height — and the stage below sizes
          its frame from that height. */}
      <section className="grid min-h-[100svh] grid-rows-[auto_minmax(14rem,1fr)_auto_auto] px-6 pb-6 pt-24 lg:px-10 lg:pt-28">
        {/* The name of the page and the four acts. */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <h1 className="t-hero text-[clamp(1.6rem,2.6vw,2.4rem)] text-cream">Der Warmbachhof</h1>
            <p className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-cream/45">
              <span className="tabular-nums">{N}</span> Aufnahmen
              <span className="mx-2 text-cream/25">·</span>
              Kitzbühel
            </p>
          </div>
          <nav
            aria-label="Bereiche des Hofs"
            className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-cream/15 bg-night/70 p-1 backdrop-blur-md [scrollbar-width:none]"
          >
            {ACTS.map((a) => {
              const on = a.key === img.section;
              return (
                <button
                  key={a.key}
                  type="button"
                  data-cursor
                  onClick={() => setCurrent(a.start)}
                  aria-current={on ? "true" : undefined}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    on ? "bg-cream text-night" : "text-cream/55 hover:text-cream"
                  }`}
                >
                  {a.label}
                  <span className={`tabular-nums ${on ? "text-night/50" : "text-cream/30"}`}>
                    {pad(a.count)}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* The stage. It takes whatever height the acts, the caption and the
            filmstrip leave it, so the whole instrument always fits one
            screen; the frame inside is sized from the photograph's own
            proportions before a byte of it arrives, and its neighbours wait
            underneath it. */}
        <div className="flex min-h-0 min-w-0 items-center justify-center py-5 [container-type:size] lg:py-7">
          <button
            type="button"
            data-cursor
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              touch.current = null;
            }}
            onClick={(e) => {
              if (swiped.current) {
                swiped.current = false;
                return;
              }
              open(current, e.currentTarget.querySelector("img[data-current]"));
            }}
            aria-label={`${labelOf(current)} — Aufnahme ${current + 1} von ${N} öffnen`}
            className="relative block w-full max-w-full touch-pan-y bg-soot/40 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            style={{
              aspectRatio: `${img.width} / ${img.height}`,
              // As wide as the stage allows, but never taller than the stage
              // is — the height is the container's own, so the frame follows
              // the room it has rather than a guess at the viewport.
              width: `min(100%, calc(100cqh * ${ratio}))`,
            }}
          >
            {around.map((i) => {
              const t = warmbachGallery[i];
              const on = i === current;
              return (
                <Image
                  key={t.src}
                  src={t.src}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  quality={82}
                  priority={on}
                  alt={on ? `${labelOf(i)}, Warmbachhof` : ""}
                  aria-hidden={!on}
                  data-current={on ? "" : undefined}
                  className={`object-contain transition-opacity duration-500 ease-deep ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                />
              );
            })}
          </button>
        </div>

        {/* Which part of the estate, where in the set, and the way to the next. */}
        <div className="flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-[0.62rem] uppercase tracking-[0.24em] text-cream/60">
            {labelOf(current)}
            <span className="mx-2 text-cream/25">·</span>
            <span className="tabular-nums text-cream/85">
              {pad(current + 1)}/{pad(N)}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button type="button" data-cursor onClick={() => go(-1)} aria-label="Vorherige Aufnahme" className={control}>
              <ChevronLeft />
            </button>
            <button type="button" data-cursor onClick={() => go(1)} aria-label="Nächste Aufnahme" className={control}>
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* The filmstrip — the whole set in one row, the acts marked off along it. */}
        <nav
          ref={stripRef}
          aria-label="Alle Aufnahmen"
          className="relative mt-5 flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {warmbachGallery.map((t, i) => {
            const act = ACTS.find((a) => a.start === i);
            const on = i === current;
            return (
              <Fragment key={t.src}>
                {act && (
                  <span
                    aria-hidden
                    className={`shrink-0 whitespace-nowrap text-[0.5rem] uppercase tracking-[0.22em] text-cream/35 ${
                      i > 0 ? "ml-3 border-l border-cream/15 pl-4 pr-2" : "pr-2"
                    }`}
                  >
                    {act.label}
                  </span>
                )}
                <button
                  ref={(el) => {
                    thumbs.current[i] = el;
                  }}
                  type="button"
                  data-cursor
                  onClick={() => setCurrent(i)}
                  aria-label={`${labelOf(i)} — Aufnahme ${i + 1} von ${N}`}
                  aria-current={on ? "true" : undefined}
                  className={`relative h-14 shrink-0 overflow-hidden bg-soot transition-opacity duration-300 lg:h-[4.5rem] ${
                    on ? "opacity-100 outline outline-1 outline-offset-2 outline-gold" : "opacity-40 hover:opacity-80"
                  }`}
                  style={{ aspectRatio: `${t.width} / ${t.height}` }}
                >
                  <Image src={t.src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              </Fragment>
            );
          })}
        </nav>
      </section>

      <GalleryLightbox
        images={warmbachGallery}
        index={index}
        onClose={close}
        onPage={(d) => setIndex((i) => (i === null ? i : (i + d + N) % N))}
      />
    </>
  );
}
