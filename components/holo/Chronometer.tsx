"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useInView, useReducedMotion } from "framer-motion";
import {
  daysSince1464,
  timeToNextYear,
  formatInt,
  pad2,
  type Countdown,
} from "@/lib/time";

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/* ---- Decorative rotating ring (thin conic arc, masked to a 1.5px stroke) -- */
function HoloRing({
  size,
  arc,
  reverse,
}: {
  size: number;
  arc: string;
  reverse?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={reverse ? "holo-ring-rev" : "holo-ring"}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: 9999,
        background: arc,
        WebkitMask:
          "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
      }}
    />
  );
}

const ARC_OUTER =
  "conic-gradient(from 0deg, transparent 0deg, rgba(197,126,91,0.5) 38deg, transparent 92deg, transparent 188deg, rgba(197,126,91,0.22) 224deg, transparent 268deg, transparent 360deg)";
const ARC_INNER =
  "conic-gradient(from 120deg, transparent 0deg, rgba(237,230,212,0.34) 30deg, transparent 78deg, transparent 360deg)";

/* ---- The holographic panel: floats, tilts toward the cursor --------------- */
type PanelProps = {
  label: string;
  caption: string;
  children: ReactNode;
  reduce: boolean;
};

const HoloPanel = forwardRef<HTMLDivElement, PanelProps>(function HoloPanel(
  { label, caption, children, reduce },
  ref,
) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 7, y: px * 9 });
  };

  return (
    <div
      ref={ref}
      data-cursor
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
      }}
      className="group relative flex min-h-[20rem] flex-col items-center justify-center overflow-hidden rounded-[2px] border border-hairline/15 bg-soot/30 px-6 py-14 backdrop-blur-sm md:min-h-[22rem]"
    >
      {/* radial glow seat */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(197,126,91,0.12),_transparent_62%)]"
      />
      {/* rotating rings */}
      <div className="pointer-events-none absolute inset-0">
        <HoloRing size={360} arc={ARC_OUTER} />
        <HoloRing size={250} arc={ARC_INNER} reverse />
      </div>

      <div
        className={`relative flex flex-col items-center ${reduce ? "" : "holo-float"}`}
      >
        <div className="scanlines relative px-2">{children}</div>
        <p className="t-label mt-7">{label}</p>
        <p className="mt-2 max-w-[15rem] text-center text-[0.78rem] leading-relaxed text-stone">
          {caption}
        </p>
      </div>

      {/* top sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
    </div>
  );
});

/* ---- Left panel: days since 1464, rolling up when scrolled into view ------ */
function SinceCounter({ mounted, reduce }: { mounted: boolean; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const target = useRef(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    target.current = daysSince1464();
    if (reduce) setDays(target.current);
  }, [mounted, reduce]);

  useEffect(() => {
    if (!mounted || reduce || !inView || target.current === 0) return;
    let raf = 0;
    let start = 0;
    const dur = 2300;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      setDays(Math.round(easeOutExpo(p) * target.current));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduce, inView]);

  return (
    <HoloPanel
      ref={ref}
      reduce={reduce}
      label="Tage seit 1464"
      caption="Ununterbrochen bewirtschaftet — vom Salbuch bis zu diesem Augenblick."
    >
      <div className="holo-num text-[clamp(2.7rem,7.5vw,5rem)] font-semibold leading-none">
        {mounted ? formatInt(days) : "—"}
      </div>
    </HoloPanel>
  );
}

/* ---- Right panel: live countdown to the next New Year --------------------- */
function CountdownCounter({
  mounted,
  reduce,
}: {
  mounted: boolean;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cd, setCd] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    if (!mounted) return;
    const update = () => setCd(timeToNextYear());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [mounted]);

  const units: Array<{ v: string; l: string }> = [
    { v: mounted ? String(cd.days) : "––", l: "Tage" },
    { v: mounted ? pad2(cd.hours) : "––", l: "Std" },
    { v: mounted ? pad2(cd.minutes) : "––", l: "Min" },
    { v: mounted ? pad2(cd.seconds) : "––", l: "Sek" },
  ];

  return (
    <HoloPanel
      ref={ref}
      reduce={reduce}
      label="Bis zum Jahreswechsel"
      caption="Countdown bis zur Mitternacht des 31. Dezember."
    >
      <div className="flex items-start justify-center gap-3 md:gap-5">
        {units.map((u, i) => (
          <div key={u.l} className="flex items-start">
            <div className="flex flex-col items-center">
              <span className="holo-num text-[clamp(1.9rem,5.4vw,3.6rem)] font-semibold leading-none tabular-nums">
                {u.v}
              </span>
              <span className="mt-2.5 text-[0.6rem] uppercase tracking-[0.24em] text-stone">
                {u.l}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="holo-num px-1 text-[clamp(1.5rem,4vw,2.6rem)] font-light leading-none opacity-50 md:px-2">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </HoloPanel>
  );
}

/**
 * The hologram chronometer pair — "Tage seit 1464" (rolls up on first view)
 * and a live countdown to the next New Year. Both float, tilt toward the
 * cursor, and carry rotating holographic rings. Honours reduced-motion.
 */
export function Chronometer() {
  const reduce = !!useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <SinceCounter mounted={mounted} reduce={reduce} />
      <CountdownCounter mounted={mounted} reduce={reduce} />
    </div>
  );
}
