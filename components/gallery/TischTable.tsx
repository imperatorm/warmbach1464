"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { warmbachGallery } from "@/lib/gallery";
import { buildPrints, regions, WORLD, type Print } from "./layout";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";
import { GalleryFallback } from "./GalleryFallback";
import { Pan } from "./icons";

/** Below this the drag is a click, not a pan. */
const DRAG_THRESHOLD = 6;
/** Velocity decay per frame while coasting, and the point we call it stopped. */
const FRICTION = 0.94;
const REST = 0.05;

/**
 * Der Tisch — the whole estate laid out as loose prints on one table.
 *
 * There is no grid and no page: a single plane you drag in any direction,
 * with the twenty-six photographs scattered across four quarters. Prints sit
 * at different depths, so the near ones travel further than the far ones as
 * you pan and the table reads as a surface rather than a wallpaper. Touching
 * a print lifts it and straightens it out of its tilt; opening one morphs
 * that exact print into the full-screen frame.
 *
 * The pan is written straight to the DOM in a rAF loop — React never
 * re-renders while the table moves. Every print is still a real button in
 * source order, so Tab walks the estate quarter by quarter and the table
 * follows the focus. Under prefers-reduced-motion the table is not built at
 * all and the sectioned gallery stands in its place, complete.
 */
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
  // Säulen specimen already follows — fine pointers only.
  const [fine, setFine] = useState<boolean | null>(null);

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

  const { open, close } = useLightbox(warmbachGallery, setIndex);

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
    const measure = () => {
      const w = stageRef.current?.clientWidth ?? 1600;
      setZoom(Math.min(1, Math.max(0.42, w / 1700)));
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
    if (reduce) return;
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

      // Clamp so the table can never be dragged entirely off the viewport.
      const el = stageRef.current;
      if (el) {
        const padX = el.clientWidth * 0.35;
        const padY = el.clientHeight * 0.35;
        pan.current.x = Math.min(padX, Math.max(el.clientWidth - WORLD.w * zoom - padX, pan.current.x));
        pan.current.y = Math.min(padY, Math.max(el.clientHeight - WORLD.h * zoom - padY, pan.current.y));
      }

      for (let i = 0; i < prints.length; i += 1) {
        const node = nodes.current[i];
        if (!node) continue;
        const p = prints[i];
        const x = p.x * zoom + pan.current.x * p.depth - (p.w * zoom) / 2;
        const y = p.y * zoom + pan.current.y * p.depth - (p.h * zoom) / 2;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [prints, reduce, zoom]);

  // Never leave the grabbing ring behind if the table unmounts mid-drag.
  useEffect(() => () => document.documentElement.classList.remove("cursor-grabbing"), []);

  /** Which quarter is under the middle of the viewport right now. */
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const el = stageRef.current;
      if (!el) return;
      const cx = (el.clientWidth / 2 - pan.current.x) / zoom;
      const cy = (el.clientHeight / 2 - pan.current.y) / zoom;
      const near = regions.reduce((a, b) =>
        Math.hypot(a.cx - cx, a.cy - cy) < Math.hypot(b.cx - cx, b.cy - cy) ? a : b,
      );
      setActiveRegion((prev) => (prev === near.key ? prev : near.key));
    }, 220);
    return () => window.clearInterval(id);
  }, [reduce, zoom]);

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
    pan.current.x += dx;
    pan.current.y += dy;
    vel.current = { x: dx, y: dy };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    document.documentElement.classList.remove("cursor-grabbing");
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const onWheel = (e: React.WheelEvent) => {
    easing.current = false;
    pan.current.x -= e.deltaX;
    pan.current.y -= e.deltaY;
    vel.current = { x: 0, y: 0 };
  };

  if (reduce || fine === false) return <GalleryFallback />;

  const openPrint = (p: Print, el: HTMLElement | null) => {
    if (moved.current > DRAG_THRESHOLD) return; // that was a drag, not a click
    open(warmbachGallery.findIndex((i) => i.src === p.src), el);
  };

  return (
    <>
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
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
            aria-label={`${regions.find((r) => r.key === p.region)?.label} — Aufnahme öffnen`}
            className="group absolute left-0 top-0 origin-center will-change-transform focus:outline-none"
            style={{ width: p.w * zoom, height: p.h * zoom, zIndex: Math.round(p.depth * 10) }}
          >
            {/* The tilt and the lift live on an inner layer, so the rAF loop
                owns the outer transform alone and never fights the hover. */}
            <span
              className="block h-full w-full bg-cream p-2 shadow-[0_18px_40px_-28px_rgba(29,41,29,0.55)] transition-[transform,box-shadow] duration-500 ease-deep group-hover:shadow-[0_34px_70px_-30px_rgba(29,41,29,0.65)] group-focus-visible:shadow-[0_34px_70px_-30px_rgba(29,41,29,0.65)]"
              style={{ transform: `rotate(${p.rot}deg)` }}
              data-print
            >
              <Image
                src={p.src}
                alt=""
                width={p.width}
                height={p.height}
                sizes="420px"
                priority={p.featured}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </span>
          </button>
        ))}

        {/* The page's own name, set into the corner of the table rather than
            on a band above it: the photographs lead, the interface sits down. */}
        <div className="pointer-events-none absolute left-0 top-0 z-[60] max-w-[22rem] bg-[radial-gradient(120%_120%_at_0%_0%,_theme(colors.kalk)_38%,_transparent_72%)] px-6 pb-16 pr-20 pt-6 lg:px-10 lg:pt-10">
          <h1 className="t-hero text-[clamp(1.6rem,2.6vw,2.4rem)] text-night">
            Der Warmbachhof
          </h1>
          <p className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-night/45">
            <span className="tabular-nums">{warmbachGallery.length}</span> Aufnahmen
            <span className="mx-2 text-night/20">·</span>
            Kitzbühel
          </p>
        </div>

        {/* The compass — which quarter you are standing in, and the way to
            the other three. */}
        <nav
          aria-label="Bereiche des Hofs"
          className="pointer-events-auto absolute inset-x-4 bottom-6 z-[60] mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 overflow-x-auto rounded-full border border-night/10 bg-cream/85 p-1 backdrop-blur-md"
        >
          <span className="hidden min-h-11 shrink-0 items-center gap-2 pl-4 pr-2 text-[0.58rem] uppercase tracking-[0.24em] text-night/40 sm:flex">
            <Pan className="h-3 w-3" />
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
                activeRegion === r.key
                  ? "bg-night text-cream"
                  : "text-night/60 hover:text-night"
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
