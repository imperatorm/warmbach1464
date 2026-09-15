"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { warmbachGallery } from "@/lib/gallery";
import { buildPrints, regions, WORLD, type Print } from "./layout";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";
import { GalleryFallback } from "./GalleryFallback";
import { beginProgrammaticScroll, endProgrammaticScroll } from "@/lib/smoothScroll";
import { Pan } from "./icons";

/** Below this the pointer travel is a click, not a pan. */
const DRAG_THRESHOLD = 6;
/** Velocity decay per frame while coasting, and the point we call it stopped. */
const FRICTION = 0.94;
const REST = 0.05;
/** How much of a viewport of slack the table keeps past its own edges. */
const EDGE_SLACK = 0.35;

/**
 * Der Tisch — the whole estate laid out as loose prints on one table.
 *
 * There is no grid and no page: a single plane you drag in any direction,
 * with the twenty-six photographs scattered across four quarters. Prints sit
 * at different depths, so the near ones travel further than the far ones as
 * you pan and the table reads as a surface rather than a wallpaper. Addressing
 * a print lifts it off the sheet and straightens it out of its tilt; opening
 * one morphs that exact print into the full-screen frame.
 *
 * The pan is written straight to the DOM in a rAF loop — React never
 * re-renders while the table moves. Every print is still a real button in
 * source order, so Tab walks the estate quarter by quarter and the table
 * follows the focus.
 *
 * The table is an instrument for a fine pointer. Under prefers-reduced-motion,
 * on touch, and before the browser has told us which we have, the sectioned
 * gallery stands in its place — complete, not degraded.
 */
/**
 * One photograph on one print. It holds its own arrival state because a
 * cached image can finish decoding before React attaches a load handler —
 * the ref checks `complete` on mount so a warm print is never left invisible.
 */
function PrintImage({ print: p }: { print: Print }) {
  const [loaded, setLoaded] = useState(false);
  return (
    // A print that has not arrived yet is a placed print waiting for its
    // photograph, not a blank card.
    <span className="relative block h-full w-full bg-night/[0.07]">
      <Image
        ref={(el) => {
          if (el?.complete) setLoaded(true);
        }}
        src={p.src}
        alt=""
        fill
        sizes="(max-width: 1280px) 240px, 320px"
        priority={p.featured}
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-700 ease-deep ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

export function TischTable() {
  const reduce = useReducedMotion();
  const prints = useMemo(() => buildPrints(), []);
  const [index, setIndex] = useState<number | null>(null);
  const [activeRegion, setActiveRegion] = useState(regions[0].key);
  // The table is composed at a reference width; on a narrower viewport the
  // whole composition scales down together rather than reflowing, so the
  // arrangement a visitor learns is the same arrangement everywhere.
  const [zoom, setZoom] = useState(1);
  // A table you drag is a pointer instrument: on touch the stage would have to
  // claim the gesture to pan at all, which would trap the page. Same rule the
  // Säulen specimen already follows. Null until the browser has answered.
  const [fine, setFine] = useState<boolean | null>(null);
  // The drag hint has one job. Once it has been obeyed it stops asking.
  const [hinted, setHinted] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);

  // Pan state lives in refs: the loop writes transforms, React stays still.
  const pan = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const easing = useRef(false);
  const regionRef = useRef(regions[0].key);
  /** True while the page, not the table, owns the wheel. */
  const released = useRef(true);

  const { open, close } = useLightbox(warmbachGallery, setIndex);

  /** How far the pan may travel before the table would leave the viewport. */
  const bounds = useCallback(() => {
    const el = stageRef.current;
    if (!el) return null;
    const padX = el.clientWidth * EDGE_SLACK;
    const padY = el.clientHeight * EDGE_SLACK;
    return {
      maxX: padX,
      minX: el.clientWidth - WORLD.w * zoom - padX,
      maxY: padY,
      minY: el.clientHeight - WORLD.h * zoom - padY,
    };
  }, [zoom]);

  /** Centre the given world point in the viewport. */
  const panTo = useCallback((wx: number, wy: number, immediate = false) => {
    const el = stageRef.current;
    if (!el) return;
    target.current = { x: el.clientWidth / 2 - wx, y: el.clientHeight / 2 - wy };
    vel.current = { x: 0, y: 0 };
    easing.current = !immediate;
    if (immediate) pan.current = { ...target.current };
  }, []);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    // Measured from the window, not the stage: the stage does not exist until
    // the pointer question is answered, and it is full-width regardless.
    const measure = () => {
      setZoom(Math.min(1, Math.max(0.42, window.innerWidth / 1700)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Start on the Hof, the estate's own front door.
  useEffect(() => {
    panTo(regions[0].cx * zoom, regions[0].cy * zoom, true);
  }, [panTo, zoom]);

  /** The render loop — one write per print per frame, no React involved. */
  useEffect(() => {
    if (reduce || !fine) return;
    const step = () => {
      raf.current = requestAnimationFrame(step);

      if (easing.current) {
        pan.current.x += (target.current.x - pan.current.x) * 0.09;
        pan.current.y += (target.current.y - pan.current.y) * 0.09;
        if (Math.hypot(target.current.x - pan.current.x, target.current.y - pan.current.y) < 0.5) {
          pan.current = { ...target.current };
          easing.current = false;
        }
      } else if (!dragging.current && (Math.abs(vel.current.x) > REST || Math.abs(vel.current.y) > REST)) {
        pan.current.x += vel.current.x;
        pan.current.y += vel.current.y;
        vel.current.x *= FRICTION;
        vel.current.y *= FRICTION;
      }

      const b = bounds();
      if (b) {
        pan.current.x = Math.min(b.maxX, Math.max(b.minX, pan.current.x));
        pan.current.y = Math.min(b.maxY, Math.max(b.minY, pan.current.y));
      }

      for (let i = 0; i < prints.length; i += 1) {
        const node = nodes.current[i];
        if (!node) continue;
        const p = prints[i];
        const x = p.x * zoom + pan.current.x * p.depth - (p.w * zoom) / 2;
        const y = p.y * zoom + pan.current.y * p.depth - (p.h * zoom) / 2;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }

      // Which quarter is under the middle of the viewport. Read on the frame
      // that already knows the answer rather than polled on a timer.
      const el = stageRef.current;
      if (el) {
        const cx = (el.clientWidth / 2 - pan.current.x) / zoom;
        const cy = (el.clientHeight / 2 - pan.current.y) / zoom;
        const near = regions.reduce((a, b2) =>
          Math.hypot(a.cx - cx, a.cy - cy) < Math.hypot(b2.cx - cx, b2.cy - cy) ? a : b2,
        );
        if (near.key !== regionRef.current) {
          regionRef.current = near.key;
          setActiveRegion(near.key);
        }
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [prints, reduce, fine, zoom, bounds]);

  /**
   * The wheel pans the table — but only while the table still has somewhere to
   * go. At its edge the table lets go and the page scrolls on to the footer; a
   * full-viewport instrument that swallowed the wheel outright would strand
   * everything below it.
   *
   * preventDefault alone is not enough to hold the page still: Lenis owns the
   * scroll position for the whole app and drives it from its own listener. So
   * the table stands Lenis down while it is the one moving, and hands it back
   * the moment there is nowhere left to pan — the same borrow the Boden tour
   * makes through lib/smoothScroll.
   */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduce || !fine) return;

    const release = () => {
      if (released.current) return;
      released.current = true;
      endProgrammaticScroll();
    };
    const claim = () => {
      if (!released.current) return;
      released.current = false;
      beginProgrammaticScroll();
    };

    const onWheel = (e: WheelEvent) => {
      const b = bounds();
      if (!b) return;
      const canX =
        (e.deltaX < 0 && pan.current.x < b.maxX) || (e.deltaX > 0 && pan.current.x > b.minX);
      const canY =
        (e.deltaY < 0 && pan.current.y < b.maxY) || (e.deltaY > 0 && pan.current.y > b.minY);
      if (!canX && !canY) {
        release();
        return; // at the edge — the page takes it from here
      }

      claim();
      e.preventDefault();
      easing.current = false;
      pan.current.x -= e.deltaX;
      pan.current.y -= e.deltaY;
      vel.current = { x: 0, y: 0 };
      setHinted(false);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerleave", release);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerleave", release);
      // The page must never be left unable to scroll because the table went away.
      release();
    };
  }, [reduce, fine, bounds]);

  // Never leave the grabbing ring behind if the table unmounts mid-drag.
  useEffect(() => () => document.documentElement.classList.remove("cursor-grabbing"), []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    easing.current = false;
    document.documentElement.classList.add("cursor-grabbing");
    moved.current = 0;
    last.current = { x: e.clientX, y: e.clientY };
    vel.current = { x: 0, y: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    moved.current += Math.hypot(dx, dy);
    if (moved.current > DRAG_THRESHOLD && hinted) setHinted(false);
    pan.current.x += dx;
    pan.current.y += dy;
    vel.current = { x: dx, y: dy };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    document.documentElement.classList.remove("cursor-grabbing");
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Until the browser has said what kind of pointer this is, and wherever the
  // table does not belong, the plain set is the page.
  if (reduce || fine !== true) return <GalleryFallback />;

  const openPrint = (p: Print, el: HTMLElement | null) => {
    if (moved.current > DRAG_THRESHOLD) return; // that was a drag, not a click
    open(
      warmbachGallery.findIndex((i) => i.src === p.src),
      el,
    );
  };

  return (
    <>
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-[calc(100svh-4.5rem)] w-full touch-none select-none overflow-hidden bg-kalk"
      >
        {prints.map((p, i) => (
          <button
            key={p.src}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            data-cursor
            onClick={(e) => openPrint(p, e.currentTarget.querySelector("img"))}
            onFocus={() => panTo(p.x * zoom, p.y * zoom)}
            aria-label={`${p.regionLabel} — Aufnahme ${p.index + 1} von ${prints.length} öffnen`}
            className="group absolute left-0 top-0 origin-center z-[var(--z)] will-change-transform focus:outline-none hover:z-50 focus-visible:z-50"
            style={
              {
                width: p.w * zoom,
                height: p.h * zoom,
                "--z": Math.round(p.depth * 10),
              } as React.CSSProperties
            }
          >
            {/* The tilt, the lift and the focus ring live on this inner layer,
                so the rAF loop owns the outer transform alone and never fights
                the hover. Addressing a print squares it up and picks it off
                the sheet; letting go lays it back down at its own angle. */}
            <span
              data-print
              style={{ "--rot": `${p.rot}deg` } as React.CSSProperties}
              className="block h-full w-full bg-cream p-2 shadow-[0_18px_40px_-28px_rgba(29,41,29,0.55)] transition-[transform,box-shadow,outline-color] duration-500 ease-deep [outline:2px_solid_transparent] [outline-offset:4px] [transform:rotate(var(--rot))] group-hover:shadow-[0_34px_70px_-26px_rgba(29,41,29,0.6)] group-hover:[transform:rotate(0deg)_translateY(-8px)_scale(1.035)] group-focus-visible:shadow-[0_34px_70px_-26px_rgba(29,41,29,0.6)] group-focus-visible:[outline-color:var(--color-copper)] group-focus-visible:[transform:rotate(0deg)_translateY(-8px)_scale(1.035)]"
            >
              <PrintImage print={p} />
            </span>
          </button>
        ))}

        {/* The page's own name, set into the corner of the table rather than
            on a band above it: the photographs lead, the interface sits down. */}
        <div className="pointer-events-none absolute left-0 top-0 z-[60] max-w-[22rem] bg-[radial-gradient(120%_120%_at_0%_0%,_theme(colors.kalk)_38%,_transparent_72%)] px-6 pb-16 pr-20 pt-6 lg:px-10 lg:pt-10">
          <h1 className="t-hero text-[clamp(1.6rem,2.6vw,2.4rem)] text-night">Der Warmbachhof</h1>
          <p className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-night/70">
            <span className="tabular-nums">{warmbachGallery.length}</span> Aufnahmen
            <span className="mx-2 text-night/40">·</span>
            Kitzbühel
          </p>
        </div>

        {/* The compass — which quarter you are standing in, and the way to
            the other three. */}
        <nav
          aria-label="Bereiche des Hofs"
          className="absolute inset-x-4 bottom-6 z-[60] mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 overflow-x-auto rounded-full border border-night/10 bg-cream/85 p-1 backdrop-blur-md"
        >
          <span
            aria-hidden
            className={`hidden min-h-11 shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[0.58rem] uppercase tracking-[0.24em] text-night/70 transition-[max-width,opacity,padding] duration-700 ease-deep sm:flex ${
              hinted ? "max-w-[9rem] pl-4 pr-2 opacity-100" : "max-w-0 px-0 opacity-0"
            }`}
          >
            <Pan className="h-3 w-3 shrink-0" />
            Ziehen
          </span>
          {regions.map((r) => (
            <button
              key={r.key}
              type="button"
              data-cursor
              onClick={() => panTo(r.cx * zoom, r.cy * zoom)}
              aria-current={activeRegion === r.key ? "true" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                activeRegion === r.key ? "bg-night text-cream" : "text-night/70 hover:text-night"
              }`}
            >
              {r.label}
            </button>
          ))}
        </nav>
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
