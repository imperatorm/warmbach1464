"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  buildChronikRows,
  parallelen,
  parallelsFor,
  type ChronikEvent,
  type ChronikRow,
  type Parallel,
} from "@/lib/chronik";

/** Position eines Elements relativ zu einem Container (layout-basiert, ignoriert Transforms). */
function offsetWithin(el: HTMLElement, container: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

type Segment = { id: string; x1: number; y1: number; x2: number; y2: number; theme?: string };

const EASE = [0.16, 1, 0.3, 1] as const;

export function ParallelChronik() {
  const reduce = useReducedMotion();
  const rows: ChronikRow[] = buildChronikRows();

  const [active, setActive] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [segments, setSegments] = useState<Segment[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // Mitlaufender Kupfer-Balken auf der Mittelachse.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const axisFill = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });

  const measure = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    setDims({ w: c.offsetWidth, h: c.offsetHeight });
    const segs: Segment[] = [];
    for (const p of parallelen) {
      const a = nodeRefs.current.get(p.kitzbuehel);
      const b = nodeRefs.current.get(p.warmbach);
      if (!a || !b) continue;
      const pa = offsetWithin(a, c);
      const pb = offsetWithin(b, c);
      segs.push({
        id: p.id,
        x1: pa.x + a.offsetWidth, // rechte Kante der Kitzbühel-Karte (zur Achse hin)
        y1: pa.y + a.offsetHeight / 2,
        x2: pb.x, // linke Kante der Warmbach-Karte
        y2: pb.y + b.offsetHeight / 2,
        theme: p.theme,
      });
    }
    setSegments(segs);
  }, []);

  useEffect(() => {
    measure();
    const t1 = setTimeout(measure, 350);
    const t2 = setTimeout(measure, 900);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [measure]);

  // Esc schließt die aktive Parallele.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeParallel = parallelen.find((p) => p.id === active) ?? null;
  const litIds = activeParallel
    ? new Set([activeParallel.kitzbuehel, activeParallel.warmbach])
    : null;

  const selectParallel = useCallback(
    (id: string, scrollToId?: string) => {
      setActive((cur) => (cur === id ? null : id));
      if (scrollToId) {
        const el = nodeRefs.current.get(scrollToId);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
      }
    },
    [],
  );

  /** Klick auf eine Resonanz-Karte: durch ihre Parallelen wechseln (warmbach-heute hat zwei). */
  const cycleCard = useCallback((eventId: string) => {
    const ps = parallelsFor(eventId);
    if (ps.length === 0) return;
    setActive((cur) => {
      const idx = ps.findIndex((p) => p.id === cur);
      return ps[(idx + 1) % ps.length].id;
    });
  }, []);

  return (
    <div className="select-none">
      {/* — Kopf: Resonanz-Chips + aktive Note ————————————————————————— */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="t-label mr-1 text-stone">Resonanzen</span>
          {parallelen.map((p) => {
            const on = active === p.id;
            const isCopper = p.theme === "kupfer";
            return (
              <button
                key={p.id}
                data-cursor
                onClick={() => selectParallel(p.id, p.kitzbuehel)}
                aria-pressed={on}
                className={[
                  "rounded-full border px-3 py-1 text-xs tracking-wide transition-all duration-300",
                  on
                    ? isCopper
                      ? "border-copper bg-copper/20 text-cream"
                      : "border-gold bg-gold/15 text-cream"
                    : "border-hairline/25 text-stone hover:border-gold/60 hover:text-cream",
                ].join(" ")}
              >
                {isCopper ? "◆ " : ""}
                {p.label}
              </button>
            );
          })}
          <AnimatePresence>
            {active && (
              <motion.button
                key="clear"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActive(null)}
                className="ml-1 text-xs text-stone underline-offset-4 hover:text-cream hover:underline"
              >
                zurücksetzen
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 min-h-[3.25rem]">
          <AnimatePresence mode="wait">
            {activeParallel ? (
              <motion.p
                key={activeParallel.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-cream/85"
              >
                <span
                  className={
                    "text-gold"
                  }
                >
                  {activeParallel.label} —{" "}
                </span>
                {activeParallel.note}
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-stone"
              >
                Wähle eine Resonanz — oder klicke eine markierte Station — um die
                Querverbindung zwischen Stadt und Hof zu sehen.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* — Spalten-Köpfe (Desktop) ————————————————————————————————————— */}
      <div className="mb-6 hidden grid-cols-[1fr_5.5rem_1fr] lg:grid">
        <p className="t-label text-right text-stone">Kitzbühel · Stadt</p>
        <span />
        <p className="t-label text-stone">Warmbach · Hof</p>
      </div>

      {/* — Zeitstrahl-Körper ——————————————————————————————————————————— */}
      <div ref={containerRef} className="relative">
        {/* Mittelachse */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-0 hidden w-px -translate-x-1/2 bg-hairline/15 lg:block" />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 z-0 hidden w-px -translate-x-1/2 origin-top bg-copper/70 lg:block"
          style={{ height: "100%", scaleY: reduce ? 1 : axisFill }}
        />

        {/* SVG-Brücken (nur Desktop) */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
          width={dims.w}
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          {segments.map((s) => {
            const cx = dims.w / 2;
            const d = `M ${s.x1} ${s.y1} C ${cx} ${s.y1}, ${cx} ${s.y2}, ${s.x2} ${s.y2}`;
            const on = active === s.id;
            const stroke = s.theme === "kupfer" ? "#6f4f34" : "#c0916a";
            return (
              <g key={s.id}>
                {/* immer sichtbarer, zarter Faden — lädt zum Erkunden ein */}
                <path d={d} fill="none" stroke={stroke} strokeWidth={1} opacity={on ? 0 : 0.16} />
                {on && (
                  <>
                    <motion.path
                      key={`${s.id}-on`}
                      d={d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={2}
                      strokeLinecap="round"
                      initial={reduce ? { opacity: 0.95 } : { pathLength: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 0.95 } : { pathLength: 1, opacity: 0.95 }}
                      transition={{ duration: 0.85, ease: EASE }}
                      style={{ filter: "drop-shadow(0 0 6px rgba(111,79,52,0.55))" }}
                    />
                    <circle cx={s.x1} cy={s.y1} r={4} fill={stroke} />
                    <circle cx={s.x2} cy={s.y2} r={4} fill={stroke} />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Zeilen */}
        <div className="relative z-10 flex flex-col">
          {rows.map((row, i) => (
            <Row
              key={row.year}
              row={row}
              index={i}
              active={active}
              litIds={litIds}
              reduce={!!reduce}
              registerNode={(id, el) => {
                if (el) nodeRefs.current.set(id, el);
                else nodeRefs.current.delete(id);
              }}
              onCardClick={cycleCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// — Eine Zeile: Achsen-Marke + (optional) Kitzbühel-Karte links / Warmbach-Karte rechts —

function Row({
  row,
  index,
  active,
  litIds,
  reduce,
  registerNode,
  onCardClick,
}: {
  row: ChronikRow;
  index: number;
  active: string | null;
  litIds: Set<string> | null;
  reduce: boolean;
  registerNode: (id: string, el: HTMLElement | null) => void;
  onCardClick: (id: string) => void;
}) {
  return (
    <div className="relative grid items-center gap-x-8 gap-y-3 py-7 lg:grid-cols-[1fr_5.5rem_1fr]">
      {/* Achsen-Marke (im DOM zuerst → auf Mobil die Trennlinie oben) */}
      <div className="flex items-center gap-3 lg:col-start-2 lg:row-start-1 lg:flex-col lg:gap-1">
        <span className="relative z-10 inline-block rounded-full bg-night px-2 py-0.5 font-display text-base tabular-nums text-gold lg:text-lg">
          {row.yearLabel}
        </span>
        <span className="h-px flex-1 bg-hairline/15 lg:hidden" />
      </div>

      {/* Kitzbühel — links */}
      <div className="lg:col-start-1 lg:row-start-1 lg:flex lg:justify-end">
        {row.kitz && (
          <EventCard
            ev={row.kitz}
            align="right"
            active={active}
            litIds={litIds}
            reduce={reduce}
            index={index}
            registerNode={registerNode}
            onCardClick={onCardClick}
          />
        )}
      </div>

      {/* Warmbach — rechts */}
      <div className="lg:col-start-3 lg:row-start-1 lg:flex lg:justify-start">
        {row.warmbach && (
          <EventCard
            ev={row.warmbach}
            align="left"
            active={active}
            litIds={litIds}
            reduce={reduce}
            index={index}
            registerNode={registerNode}
            onCardClick={onCardClick}
          />
        )}
      </div>
    </div>
  );
}

function EventCard({
  ev,
  align,
  active,
  litIds,
  reduce,
  index,
  registerNode,
  onCardClick,
}: {
  ev: ChronikEvent;
  align: "left" | "right";
  active: string | null;
  litIds: Set<string> | null;
  reduce: boolean;
  index: number;
  registerNode: (id: string, el: HTMLElement | null) => void;
  onCardClick: (id: string) => void;
}) {
  const myParallels = parallelsFor(ev.id);
  const isAnchor = myParallels.length > 0;
  const lit = litIds?.has(ev.id) ?? false;
  const dimmed = !!active && !lit;
  const isKupfer = ev.theme === "kupfer";

  const fromX = align === "right" ? 24 : -24;

  const inner = (
    <>
      <div
        className={[
          "flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em]",
          align === "right" ? "justify-start lg:justify-end" : "justify-start",
        ].join(" ")}
      >
        <span className="text-stone">
          {ev.track === "kitzbuehel" ? "Kitzbühel" : "Warmbach"}
        </span>
        {isAnchor && (
          <span className={"text-gold"}>
            ◆ {myParallels.map((p) => p.label).join(" · ")}
          </span>
        )}
      </div>

      <h3 className="mt-2 font-display text-xl leading-snug text-cream lg:text-2xl">
        {ev.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-stone">{ev.body}</p>
      <p className="mt-3 text-[0.68rem] italic leading-snug text-stone/55">
        {ev.source}
      </p>
    </>
  );

  const base =
    "block w-full max-w-xl rounded-sm border p-5 transition-all duration-500 text-left " +
    (align === "right" ? "lg:text-right " : "");
  const skin = lit
    ? (isKupfer ? "border-copper/70 bg-copper/10 " : "border-gold/60 bg-gold/[0.06] ")
    : "border-hairline/12 bg-soot/30 hover:border-hairline/30 ";
  const dim = dimmed ? "opacity-35 " : "opacity-100 ";

  const className = base + skin + dim;

  return (
    <motion.div
      ref={(el) => registerNode(ev.id, el)}
      initial={reduce ? false : { opacity: 0, x: fromX }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.015, 0.2), ease: EASE }}
    >
      {isAnchor ? (
        <button
          type="button"
          data-cursor
          onClick={() => onCardClick(ev.id)}
          className={className + " cursor-pointer"}
        >
          {inner}
        </button>
      ) : (
        <div className={className}>{inner}</div>
      )}
    </motion.div>
  );
}
