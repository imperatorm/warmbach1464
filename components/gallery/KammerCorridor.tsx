"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { sectionOrder, warmbachGallery } from "@/lib/gallery";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";
import { GalleryFallback } from "./GalleryFallback";

/** Viewport-heights of scroll per photograph. */
const PER_FRAME = 0.72;
/** Depth of the corridor, in px of translateZ. */
const DEPTH = 2600;
/** How far ahead a frame is still drawn. Beyond this it is not rendered at all. */
const VISIBLE_AHEAD = 5.2;
const VISIBLE_BEHIND = 0.9;

const labelOf = (i: number) =>
  sectionOrder.find((s) => s.key === warmbachGallery[i].section)?.label ?? "";

/** The index of the first photograph in each room. */
const ROOM_START = sectionOrder.map(({ key, label }) => ({
  label,
  index: warmbachGallery.findIndex((i) => i.section === key),
}));

/**
 * Die Kammer — the estate as four rooms you move through.
 *
 * Photographs stand in depth along a corridor; scrolling walks you down it,
 * and each frame grows past you and leaves over your shoulder. Every room is
 * announced by its name at the scale the display face is built for, arriving
 * out of the same depth as the pictures.
 *
 * All of it is CSS 3D on the compositor — no canvas, no library, one
 * scroll-position read per frame. Under prefers-reduced-motion the corridor is
 * never built and the plain set stands in its place.
 */
export function KammerCorridor() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState<number | null>(null);
  const [room, setRoom] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const markers = useRef<(HTMLDivElement | null)[]>([]);
  const raf = useRef<number | null>(null);

  const { open, close } = useLightbox(warmbachGallery, setIndex);

  const travelTo = useCallback((i: number) => {
    const el = railRef.current;
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop + i * PER_FRAME * window.innerHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (reduce) return;

    const paint = () => {
      raf.current = requestAnimationFrame(paint);
      const el = railRef.current;
      if (!el) return;

      const vh = window.innerHeight;
      // Which frame the viewer is standing at, fractionally.
      const at = Math.max(0, (window.scrollY - el.offsetTop) / (PER_FRAME * vh));

      for (let i = 0; i < warmbachGallery.length; i += 1) {
        const node = frames.current[i];
        if (!node) continue;
        const d = i - at; // frames ahead (positive) or passed (negative)

        if (d > VISIBLE_AHEAD || d < -VISIBLE_BEHIND) {
          if (node.style.visibility !== "hidden") node.style.visibility = "hidden";
          continue;
        }
        node.style.visibility = "visible";

        const z = -d * (DEPTH / VISIBLE_AHEAD);
        // Alternating sides, so the corridor has two walls rather than one
        // tunnel of pictures dead ahead.
        const side = i % 2 === 0 ? -1 : 1;
        // Percent of the frame's own width — enough to stand it against the
        // corridor wall rather than in the middle of the floor.
        const x = side * (62 + d * 5);
        // Fade in from the far end, and out as it passes the shoulder.
        const arrive = Math.min(1, Math.max(0, (VISIBLE_AHEAD - d) / 1.8));
        const leave = Math.min(1, Math.max(0, (d + VISIBLE_BEHIND) / 0.75));

        node.style.transform = `translate3d(${x}%, ${-d * 3}%, ${z}px)`;
        node.style.opacity = String(Math.min(arrive, leave));
        node.style.zIndex = String(100 - i);
      }

      // Room names ride the same depth as the pictures they introduce.
      for (let r = 0; r < ROOM_START.length; r += 1) {
        const node = markers.current[r];
        if (!node) continue;
        const d = ROOM_START[r].index - 0.5 - at;
        if (d > VISIBLE_AHEAD || d < -VISIBLE_BEHIND) {
          node.style.visibility = "hidden";
          continue;
        }
        node.style.visibility = "visible";
        node.style.transform = `translate3d(-50%, -50%, ${-d * (DEPTH / VISIBLE_AHEAD)}px)`;
        node.style.opacity = String(
          Math.min(1, Math.max(0, (VISIBLE_AHEAD - d) / 2)) *
            Math.min(1, Math.max(0, (d + VISIBLE_BEHIND) / 0.8)),
        );
      }

      const current = ROOM_START.reduce((acc, r, i) => (at + 0.5 >= r.index ? i : acc), 0);
      setRoom((prev) => (prev === current ? prev : current));
    };

    raf.current = requestAnimationFrame(paint);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduce]);

  if (reduce) return <GalleryFallback />;

  return (
    <>
      <div
        ref={railRef}
        className="relative bg-night"
        style={{ height: `${(warmbachGallery.length + 1) * PER_FRAME * 100}svh` }}
      >
        <div
          className="sticky top-0 h-[100svh] w-full overflow-hidden"
          style={{ perspective: "1100px", perspectiveOrigin: "50% 46%" }}
        >
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {ROOM_START.map((r, i) => (
              <div
                key={r.label}
                ref={(el) => {
                  markers.current[i] = el;
                }}
                aria-hidden
                className="absolute left-1/2 top-1/2 whitespace-nowrap will-change-transform"
                style={{ visibility: "hidden" }}
              >
                <span className="t-poster block text-[clamp(3rem,13vw,11rem)] uppercase text-cream/[0.16]">
                  {r.label}
                </span>
              </div>
            ))}

            {warmbachGallery.map((img, i) => {
              const portrait = img.height > img.width;
              return (
                <div
                  key={img.src}
                  ref={(el) => {
                    frames.current[i] = el;
                  }}
                  className="absolute left-1/2 top-1/2 -ml-[27vw] -mt-[19vh] will-change-transform sm:-ml-[17vw]"
                  style={{ visibility: "hidden" }}
                >
                  <button
                    type="button"
                    data-cursor
                    onClick={(e) => open(i, e.currentTarget.querySelector("img"))}
                    onFocus={() => travelTo(i)}
                    aria-label={`${labelOf(i)} — Aufnahme ${i + 1} von ${warmbachGallery.length} öffnen`}
                    className={`block overflow-hidden ${
                      portrait ? "w-[38vw] sm:w-[24vw]" : "w-[54vw] sm:w-[34vw]"
                    }`}
                  >
                    <Image
                      src={img.src}
                      width={img.width}
                      height={img.height}
                      sizes="40vw"
                      priority={i < 3}
                      alt=""
                      className="h-auto w-full"
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute left-0 top-0 px-6 pt-24 lg:px-10 lg:pt-28">
            <h1 className="t-hero text-[clamp(1.6rem,2.6vw,2.4rem)] text-cream">Der Warmbachhof</h1>
            <p aria-live="polite" className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-gold">
              {ROOM_START[room].label}
            </p>
          </div>

          {/* The four rooms, and how far through them you are. */}
          <nav
            aria-label="Räume"
            className="absolute inset-x-4 bottom-6 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 overflow-x-auto rounded-full border border-cream/15 bg-night/70 p-1 backdrop-blur-md lg:inset-x-auto lg:right-10 lg:mx-0"
          >
            {ROOM_START.map((r, i) => (
              <button
                key={r.label}
                type="button"
                data-cursor
                onClick={() => travelTo(r.index)}
                aria-current={room === i ? "true" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  room === i ? "bg-cream text-night" : "text-cream/55 hover:text-cream"
                }`}
              >
                {r.label}
              </button>
            ))}
          </nav>
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
