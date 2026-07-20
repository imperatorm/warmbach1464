import Image from "next/image";
import Link from "next/link";
import { pillars } from "@/lib/content";
import { ChapterHead } from "./ChapterHead";
import { Reveal } from "@/components/ui/Reveal";

type CardTheme = {
  src: string;
  alt: string;
  /** floating card background — one brand tone per Säule */
  bg: string;
  /** card ink: dark background ⇒ light type, light background ⇒ night type */
  ink: "light" | "dark";
};

// One texture frame + one palette tone per Säule, in pillar order.
const THEMES: Record<string, CardTheme> = {
  zeit: {
    src: "/gallery/warmbach/img_0059.jpg",
    alt: "Der Warmbachhof in der Winterdämmerung",
    bg: "#F0EFEB",
    ink: "dark",
  },
  boden: {
    src: "/gallery/warmbach/img_0024.jpg",
    alt: "Wiese und Wilder Kaiser hinter dem Hof",
    bg: "#8B543B",
    ink: "light",
  },
  baeume: {
    src: "/gallery/warmbach/img_0030.jpg",
    alt: "Der Osthang mit Hof und Wald über Kitzbühel",
    bg: "#3B5C3F",
    ink: "light",
  },
  manufaktur: {
    src: "/gallery/warmbach/img_0080.jpg",
    alt: "Die kupferne Kothe-Brennblase mit der Prägung 1464",
    bg: "#C57E5B",
    ink: "dark",
  },
  flasche: {
    src: "/flasche/shot-front.jpg",
    alt: "Die Warmbach-Flasche vor dunklem Grund",
    bg: "#713940",
    ink: "light",
  },
};

/**
 * Chapter 02 — die Säulen als Registerkarten. Five tall texture cards cut
 * from the house itself, each carrying a floating index card with the
 * Säule's numeral, tagline and chapters. Hovering a card lets it breathe
 * wider; clicking opens the Säule.
 */
export function PillarIndex() {
  return (
    <section className="bg-night px-6 py-24 text-cream lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <ChapterHead no="02" title="Die Säulen" aside="Fünf Kapitel der Marke — Klick öffnet die Säule" tone="dark" />

        <div className="flex flex-col gap-4 lg:h-[74vh] lg:min-h-[540px] lg:flex-row">
          {pillars.map((p, i) => {
            const t = THEMES[p.slug];
            const inkText = t.ink === "light" ? "text-cream" : "text-night";
            const inkRule = t.ink === "light" ? "border-cream/25" : "border-night/25";
            const inkDim = t.ink === "light" ? "text-cream/70" : "text-night/60";
            return (
              <Reveal
                key={p.slug}
                delay={i * 0.07}
                y={36}
                className="group relative h-[62vh] min-h-[420px] overflow-hidden lg:h-auto lg:flex-[1] lg:transition-[flex-grow] lg:duration-700 lg:ease-deep lg:hover:flex-[1.85]"
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-deep group-hover:scale-[1.06]"
                  sizes="(min-width: 1024px) 26vw, 100vw"
                />
                <div className="absolute inset-0 bg-night/15 transition-colors duration-700 group-hover:bg-night/0" />

                {/* Card index — top-left folio mark */}
                <span className="absolute left-4 top-4 text-[0.6rem] uppercase tracking-[0.28em] text-cream/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
                  S·{String(i + 1).padStart(2, "0")}
                </span>

                {/* Floating index card — the register of this Säule */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <Link
                    href={`/${p.slug}`}
                    data-cursor
                    aria-label={`Säule ${p.no} — ${p.name} entdecken`}
                    className="w-[78%] max-w-[248px] min-h-[240px] p-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-deep group-hover:-translate-y-1.5 flex flex-col justify-between"
                    style={{ backgroundColor: t.bg }}
                  >
                    <div>
                      <span className={`block font-display text-2xl leading-tight ${inkText}`}>
                        {p.name}
                      </span>
                      <span className={`mt-2 block font-display text-[0.8rem] italic leading-snug ${inkDim}`}>
                        {p.tagline}
                      </span>
                      {p.sub && p.sub.length > 0 && (
                        <div className={`mt-4 border-t pt-3 ${inkRule}`}>
                          {p.sub.map((s) => (
                            <span
                              key={s.title}
                              className={`mt-1 block font-mono text-[0.62rem] tracking-[0.08em] first:mt-0 ${inkDim}`}
                            >
                              {s.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`mt-4 block text-[0.6rem] uppercase tracking-[0.22em] opacity-0 transition-opacity duration-300 group-hover:opacity-70 ${inkDim}`}>
                      Säule entdecken &rarr;
                    </span>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-cream/55">
            Fünf Säulen, ein Haus. Zeit, Boden, Bäume, Manufaktur und Flasche —
            die Kapitel, aus denen die Marke gebaut ist.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
