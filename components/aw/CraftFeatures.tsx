"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/ui/Monogram";

const CARDS = [
  {
    id: "boden",
    title: "Der Boden trägt alles",
    body:
      "Ein Osthang auf 760 Metern, eine Quelle mit ganzjährig sieben Grad. Wie beim Wein entscheidet der Untergrund: worauf die Bäume stehen, schmeckt man später im Glas.",
    src: "/gallery/warmbach/img_0024.jpg",
    alt: "Wiese und Wilder Kaiser hinter dem Warmbachhof",
  },
  {
    id: "kupfer",
    title: "Kupfer und Feuer",
    body:
      "Seit Mai 2026 arbeitet im Gewölbe die kupferne Kothe-Anlage — 100 und 400 Liter, katalytische Kupferschicht, Kolonne mit drei Umkehrkochböden. Schonender Zweifachbrand, Engschnitt im Herzstück.",
    src: "/gallery/warmbach/img_0080.jpg",
    alt: "Die kupferne Kothe-Brennblase mit der Prägung 1464",
  },
  {
    id: "reife",
    title: "Zeit ist die letzte Zutat",
    body:
      "Mindestens sechsunddreißig Monate. Nichts an diesem Haus ist beschleunigt worden — der Hof hat fünfhundertzweiundsechzig Jahre gebraucht, um zum ersten Mal selbst zu brennen.",
    src: "/gallery/warmbach/img_0096.jpg",
    alt: "Die geschwungene Holztreppe im Inneren des Hofs",
  },
];

/**
 * Manufaktur — the estate photograph holds still behind the section while
 * three cards scroll over it (Drift's sticky-rail composition). The left
 * column stays put and tracks which card is in view; the cards slide in from
 * the right the first time they appear and then stay.
 */
export function CraftFeatures() {
  const [activeId, setActiveId] = useState(CARDS[0].id);
  const [revealed, setRevealed] = useState<string[]>([]);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const nodes = CARDS.map((c) => cardRefs.current[c.id]).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const activeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.getAttribute("data-card-id") || CARDS[0].id);
        });
      },
      { threshold: 0.6 },
    );
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.getAttribute("data-card-id");
          if (id) setRevealed((prev) => (prev.includes(id) ? prev : [...prev, id]));
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((n) => {
      activeObs.observe(n);
      revealObs.observe(n);
    });
    return () => {
      activeObs.disconnect();
      revealObs.disconnect();
    };
  }, []);

  return (
    <section className="relative bg-night text-cream">
      {/* Held photograph — sticky inside the section, so it never leaks past it */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="sticky top-0 h-[100svh] w-full">
          <Image
            src="/gallery/warmbach/img_0027.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
      </div>

      <div className="relative px-5 py-20 md:px-10 md:py-40 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-16 lg:grid-cols-[400px_1fr] lg:gap-24 xl:grid-cols-[460px_1fr] xl:gap-40">
          {/* Left rail — stays with you */}
          <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-between lg:py-28">
            <div>
              <p className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
                ( 03 ) Manufaktur
              </p>
              <h2 className="t-hero text-[clamp(1.9rem,3.6vw,2.9rem)] text-cream">
                Handwerk, das sich nach dem Ort richtet — nicht nach dem Kalender
              </h2>
            </div>

            <nav aria-label="Kapitel der Manufaktur" className="hidden lg:block">
              <ul className="flex flex-col gap-2">
                {CARDS.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      data-cursor
                      onClick={() =>
                        cardRefs.current[c.id]?.scrollIntoView({ behavior: "smooth", block: "center" })
                      }
                      className={`w-full rounded-full bg-night/40 px-5 py-3 text-left text-[0.7rem] font-medium uppercase tracking-[0.16em] backdrop-blur-sm transition-colors duration-300 ${
                        activeId === c.id ? "text-cream" : "text-cream/65 hover:text-cream/90"
                      }`}
                      aria-current={activeId === c.id ? "true" : undefined}
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:block">
              <p className="max-w-xs text-sm leading-relaxed text-cream/60">
                Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit
                Echtheitszertifikat und Wachssiegel.
              </p>
              <Link
                href="/manufaktur"
                data-cursor
                className="mt-5 inline-block rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold"
              >
                Die Manufaktur
              </Link>
            </div>
          </div>

          {/* Right — the cards */}
          <div className="flex flex-col gap-10 md:gap-16">
            {CARDS.map((c) => {
              const shown = revealed.includes(c.id);
              return (
                <article
                  key={c.id}
                  data-card-id={c.id}
                  ref={(el) => {
                    cardRefs.current[c.id] = el;
                  }}
                  className={`rounded-[24px] bg-night/45 p-6 backdrop-blur-sm transition-all duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 md:p-10 ${
                    shown ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                  }`}
                >
                  <Monogram className="h-9 w-auto" />
                  <h3 className="mt-6 text-xl font-medium text-cream md:text-2xl">{c.title}</h3>
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[16px] bg-night/40">
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 55vw, 92vw"
                    />
                  </div>
                  <p className="mt-6 text-sm font-medium leading-relaxed text-cream/70 md:text-base">
                    {c.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
