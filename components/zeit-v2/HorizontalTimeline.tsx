"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";

export type TimelineItem = {
  id: string;
  year: string;
  title: string;
  text: string;
  image?: string;
  source?: string;
  kupfer?: boolean;
};

export type TimelineHandle = {
  /** Feed a vertical wheel delta; true if the timeline moved, false at its ends. */
  consumeWheel: (delta: number) => boolean;
  reset: () => void;
};

// Mutable tuple: `animate()`'s options type rejects a readonly bezier.
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * The Longines "Meilensteine" rail: slides side by side, a compact date rail
 * that travels in parallax above them, and a 2px scrubber with a draggable
 * knob and the two range years at its ends. Three ways to move — drag the
 * slides, drag the knob, or wheel — all writing the same motion value.
 *
 * `mode="scroll"` is the touch fallback: native overflow with snap points,
 * no scrubber, no hijack.
 */
export const HorizontalTimeline = forwardRef<
  TimelineHandle,
  {
    items: TimelineItem[];
    heading: string;
    range: [string, string];
    mode?: "drag" | "scroll";
  }
>(function HorizontalTimeline({ items, heading, range, mode = "drag" }, ref) {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const anim = useRef<AnimationPlaybackControls | null>(null);

  const x = useMotionValue(0);
  const [maxX, setMaxX] = useState(1);
  const [railRatio, setRailRatio] = useState(0);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const c = container.current;
    const t = track.current;
    const r = rail.current;
    if (!c || !t) return;
    const m = Math.max(1, t.scrollWidth - c.clientWidth);
    setMaxX(m);
    setRailRatio(r ? Math.max(0, r.scrollWidth - c.clientWidth) / m : 0);
    if (x.get() < -m) x.set(-m);
  }, [x]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (container.current) ro.observe(container.current);
    return () => ro.disconnect();
  }, [measure]);

  const progress = useTransform(x, (v) => Math.min(1, Math.max(0, -v / maxX)));
  const railX = useTransform(x, (v) => v * railRatio);
  const fill = useTransform(progress, (p) => `${p * 100}%`);
  const knob = useTransform(progress, (p) => `${p * 100}%`);

  useMotionValueEvent(progress, "change", (p) => {
    setActive(Math.round(p * (items.length - 1)));
  });

  const glide = useCallback(
    (to: number) => {
      anim.current?.stop();
      anim.current = animate(x, Math.min(0, Math.max(-maxX, to)), {
        duration: 0.7,
        ease: EASE,
      });
    },
    [x, maxX],
  );

  useImperativeHandle(
    ref,
    () => ({
      consumeWheel: (delta) => {
        const cur = x.get();
        if (delta > 0 && cur <= -maxX + 2) return false;
        if (delta < 0 && cur >= -2) return false;
        glide(cur - delta * 1.35);
        return true;
      },
      reset: () => glide(0),
    }),
    [x, maxX, glide],
  );

  // Scrubber: click or drag anywhere on the bar.
  const scrubbing = useRef(false);
  const scrubTo = (clientX: number) => {
    const b = bar.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    anim.current?.stop();
    x.set(-p * maxX);
  };

  const grab = (on: boolean) => document.documentElement.classList.toggle("cursor-grabbing", on);

  useEffect(
    () => () => {
      grab(false);
    },
    [],
  );

  if (mode === "scroll") {
    return (
      <div className="flex h-full flex-col">
        <Head heading={heading} active={active} total={items.length} />
        <div
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const p = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth);
            setActive(Math.round(p * (items.length - 1)));
          }}
        >
          {items.map((it, i) => (
            <Slide key={it.id} item={it} active={i === active} narrow />
          ))}
        </div>
        <Range range={range} active={active} total={items.length} />
      </div>
    );
  }

  return (
    <div ref={container} className="flex h-full min-h-0 flex-col">
      <Head heading={heading} active={active} total={items.length} />

      {/* The date rail — packed tight, travelling in parallax over the slides */}
      <div className="relative mb-5 h-6 overflow-hidden">
        <motion.div ref={rail} style={{ x: railX }} className="absolute left-0 top-0 flex whitespace-nowrap">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              data-cursor
              onClick={() => glide(-(i / (items.length - 1)) * maxX)}
              className={`min-w-[5.5rem] pr-6 text-left font-body text-[0.7rem] font-semibold uppercase tabular-nums tracking-[0.2em] transition-colors duration-300 ${
                i === active ? "text-terrakotta" : "text-night/35 hover:text-night/70"
              }`}
            >
              {it.year}
            </button>
          ))}
        </motion.div>
      </div>

      {/* The slides */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          ref={track}
          drag="x"
          dragConstraints={{ left: -maxX, right: 0 }}
          dragElastic={0.05}
          dragTransition={{ power: 0.22, timeConstant: 240 }}
          onDragStart={() => {
            anim.current?.stop();
            grab(true);
          }}
          onDragEnd={() => grab(false)}
          style={{ x }}
          data-cursor
          className="flex h-full cursor-grab select-none items-stretch gap-10 active:cursor-grabbing"
        >
          {items.map((it, i) => (
            <Slide key={it.id} item={it} active={i === active} />
          ))}
          {/* trailing room so the last slide can sit where the first did */}
          <div aria-hidden className="w-[22vw] shrink-0" />
        </motion.div>
      </div>

      {/* The scrubber */}
      <div className="mt-6 flex items-center gap-5">
        <span className="hidden font-body text-[0.62rem] uppercase tracking-[0.24em] text-night/50 md:inline">
          Ziehen &amp; entdecken
        </span>
        <span className="font-body text-[0.7rem] font-semibold uppercase tabular-nums tracking-[0.2em] text-night">
          {range[0]}
        </span>
        <div
          ref={bar}
          role="slider"
          aria-label={heading}
          aria-valuemin={0}
          aria-valuemax={items.length - 1}
          aria-valuenow={active}
          aria-valuetext={items[active]?.year}
          tabIndex={0}
          data-cursor
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") glide(x.get() - maxX / (items.length - 1));
            if (e.key === "ArrowLeft") glide(x.get() + maxX / (items.length - 1));
          }}
          onPointerDown={(e) => {
            scrubbing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            grab(true);
            scrubTo(e.clientX);
          }}
          onPointerMove={(e) => scrubbing.current && scrubTo(e.clientX)}
          onPointerUp={(e) => {
            scrubbing.current = false;
            e.currentTarget.releasePointerCapture(e.pointerId);
            grab(false);
          }}
          className="relative h-6 flex-1 cursor-pointer"
        >
          <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-night/15" />
          <motion.div style={{ width: fill }} className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-terrakotta" />
          <motion.div
            style={{ left: knob }}
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-terrakotta bg-cream"
          />
        </div>
        <span className="font-body text-[0.7rem] font-semibold uppercase tabular-nums tracking-[0.2em] text-night">
          {range[1]}
        </span>
      </div>
    </div>
  );
});

function Head({ heading, active, total }: { heading: string; active: number; total: number }) {
  return (
    <div className="mb-6 flex items-baseline justify-between border-b border-night/15 pb-4">
      <p className="font-body text-[0.8rem] font-bold text-night">{heading}</p>
      <p className="font-body text-[0.65rem] uppercase tabular-nums tracking-[0.22em] text-night/50">
        {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}

function Range({ range, active, total }: { range: [string, string]; active: number; total: number }) {
  return (
    <div className="mt-2 flex items-center gap-4">
      <span className="font-body text-[0.7rem] font-semibold uppercase tabular-nums tracking-[0.2em] text-night">{range[0]}</span>
      <div className="relative h-[2px] flex-1 bg-night/15">
        <div className="absolute left-0 top-0 h-full bg-terrakotta" style={{ width: `${(active / Math.max(1, total - 1)) * 100}%` }} />
      </div>
      <span className="font-body text-[0.7rem] font-semibold uppercase tabular-nums tracking-[0.2em] text-night">{range[1]}</span>
    </div>
  );
}

function Slide({ item, active, narrow = false }: { item: TimelineItem; active: boolean; narrow?: boolean }) {
  return (
    <article
      className={`grid shrink-0 snap-start grid-cols-1 content-start gap-5 transition-opacity duration-500 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:gap-8 ${
        narrow ? "w-[84vw] sm:w-[70vw]" : "w-[min(62vw,880px)]"
      } ${active ? "opacity-100" : "opacity-45"}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-kalk">
        {item.image ? (
          <Image src={item.image} alt="" fill draggable={false} className="object-cover" sizes="(min-width: 1024px) 30vw, 80vw" />
        ) : (
          <div className="grid h-full place-items-center">
            <span className={`t-poster text-[clamp(2.6rem,6vw,5rem)] leading-none ${item.kupfer ? "text-copper" : "text-night/80"}`}>
              {item.year}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className={`font-body text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${item.kupfer ? "text-copper" : "text-terrakotta"}`}>
          {item.kupfer ? "◆ " : ""}
          {item.year}
        </p>
        <h3 className="mt-3 font-body text-[0.95rem] font-bold leading-snug text-night">{item.title}</h3>
        <p className="mt-3 text-[0.8rem] leading-[1.7] text-night/75">{item.text}</p>
        {item.source && <p className="mt-3 text-[0.65rem] italic leading-snug text-night/45">{item.source}</p>}
      </div>
    </article>
  );
}
