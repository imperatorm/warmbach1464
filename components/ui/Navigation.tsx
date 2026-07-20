"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { pillars, secondary, clubMenu, brand } from "@/lib/content";
import { Monogram } from "./Monogram";

const linkBase =
  "text-[0.66rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300";

const PILLAR_IMAGES: Record<string, { src: string; alt: string }> = {
  zeit: { src: "/gallery/warmbach/img_0027.jpg", alt: "Der Warmbachhof vor dem Wilden Kaiser" },
  boden: { src: "/gallery/warmbach/img_0024.jpg", alt: "Wiese und Wilder Kaiser hinter dem Hof" },
  baeume: { src: "/gallery/warmbach/img_0030.jpg", alt: "Der Osthang mit dem Hof über Kitzbühel" },
  manufaktur: { src: "/gallery/warmbach/img_0068.jpg", alt: "Der Brennraum mit der Kothe-Kupferanlage" },
  flasche: { src: "/flasche/shot-lay.jpg", alt: "Die Warmbach-Flasche, liegend" },
};

/** Small arrow bubble that appears on link hover — the Osmo dropdown "bubble". */
function LinkBubble({ tone = "night" }: { tone?: "night" | "cream" }) {
  return (
    <span
      aria-hidden
      className={`nav-dropdown__link-bubble inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.6rem] ${
        tone === "cream" ? "bg-cream text-night" : "bg-copper text-cream"
      }`}
    >
      &rarr;
    </span>
  );
}

/** One image-card dropdown link, in the Osmo "nav-dropdown__link" shape. */
function PillarCard({ href, no, name, tagline, onNavigate }: { href: string; no: string; name: string; tagline: string; onNavigate: () => void }) {
  const img = PILLAR_IMAGES[href.replace("/", "")] ?? PILLAR_IMAGES.zeit;
  return (
    <li className="nav-dropdown__content-li flex-1">
      <Link
        href={href}
        data-cursor
        onClick={onNavigate}
        className="nav-dropdown__link relative flex h-56 flex-col justify-end overflow-hidden rounded-sm bg-soot p-5 text-cream lg:h-64"
      >
        <div className="nav-dropdown__link-bg">
          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 20vw, 45vw" className="nav-dropdown__img" />
          <div className="nav-dropdown__img-overlay" />
        </div>
        <div className="relative z-10">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-cream/70">Säule {no}</span>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-display text-xl italic leading-none">{name}</span>
            <LinkBubble tone="cream" />
          </div>
          <p className="mt-1.5 line-clamp-1 text-[0.68rem] leading-snug text-cream/70">{tagline}</p>
        </div>
      </Link>
    </li>
  );
}

/** One plain-text dropdown row, in the Osmo "is--static" shape. */
function StaticRow({ href, label, onNavigate }: { href: string; label: string; onNavigate: () => void }) {
  return (
    <li className="nav-dropdown__content-li">
      <Link
        href={href}
        data-cursor
        onClick={onNavigate}
        className="nav-dropdown__link is--static flex items-center justify-between gap-4 rounded-sm px-6 py-4 text-night transition-colors duration-200 hover:bg-kalk"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.14em]">{label}</span>
        <LinkBubble tone="night" />
      </Link>
    </li>
  );
}

/**
 * Multilevel navigation (Osmo mechanics, brand skin): an accordion dropdown
 * panel that grows open under the row (grid-rows trick), staggered link
 * reveal, image cards for "Die Säulen", a dark page-dim overlay while any
 * panel is open, and a burger that morphs into a close mark on mobile.
 */
export function Navigation() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<null | "pillars" | "club">(null);
  const [mobileMenu, setMobileMenu] = useState<null | "pillars" | "club">(null);
  const closeTimer = useRef<number>();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes whichever layer is open; route changes close everything.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMenu(null);
    setOpen(false);
    setMobileMenu(null);
  }, [pathname]);

  if (pathname === "/enter" || pathname.startsWith("/sitz")) return null; // gate + portal have own chrome

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const pillarActive = pillars.some((p) => isActive(`/${p.slug}`));
  const dimmed = Boolean(menu) || open;

  // A short grace period before closing on mouseleave — lets the cursor cross
  // the gap between the trigger and the panel without the panel snapping shut.
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 120);
  };
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-night/10 bg-cream text-night">
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" data-cursor aria-label={`${brand.master} — Startseite`} className="group flex items-center gap-2.5">
            <span className="font-display text-[1.7rem] leading-none tracking-[0.01em]">1464</span>
            <span className="text-[0.6rem] uppercase tracking-[0.28em] text-night/60 [margin-inline-end:-0.28em]">by</span>
            <Monogram className="h-7 w-auto text-night transition-transform duration-500 group-hover:scale-105" />
          </Link>

          {/* Desktop: quiet uppercase link row */}
          <nav className="hidden items-center gap-9 lg:flex">
            <button
              data-cursor
              data-dropdown-toggle
              aria-haspopup="true"
              aria-expanded={menu === "pillars"}
              onMouseEnter={() => {
                cancelClose();
                setMenu("pillars");
              }}
              onMouseLeave={scheduleClose}
              onFocus={() => setMenu("pillars")}
              className={`${linkBase} inline-flex items-center gap-1.5 ${
                pillarActive || menu === "pillars" ? "text-copper" : "text-night hover:text-copper"
              }`}
            >
              Die Säulen
              <span aria-hidden className={`text-[0.5rem] opacity-60 transition-transform duration-300 ${menu === "pillars" ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {secondary.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-cursor
                onMouseEnter={() => setMenu(null)}
                className={`${linkBase} link-underline ${isActive(n.href) ? "text-copper" : "text-night hover:text-copper"}`}
              >
                {n.label}
              </Link>
            ))}

            <Link
              href="/club"
              data-cursor
              data-dropdown-toggle
              aria-haspopup="true"
              aria-expanded={menu === "club"}
              onMouseEnter={() => {
                cancelClose();
                setMenu("club");
              }}
              onMouseLeave={scheduleClose}
              onFocus={() => setMenu("club")}
              className={`${linkBase} ml-2 rounded-full border px-5 py-2.5 ${
                isActive("/club") || menu === "club"
                  ? "border-copper bg-copper text-cream"
                  : "border-night/35 text-night hover:border-copper hover:text-copper"
              }`}
            >
              Club 1464
            </Link>
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            data-cursor
            aria-expanded={open}
            aria-label="Menü"
            className="menu-button relative flex h-11 w-11 flex-col items-center justify-center gap-[7px] rounded-full border border-night/35 lg:hidden"
          >
            <span
              aria-hidden
              className="menu-button__line block h-px w-5 bg-night"
              style={open ? { transform: "translateY(4px) rotate(45deg)" } : undefined}
            />
            <span
              aria-hidden
              className="menu-button__line block h-px w-5 bg-night"
              style={open ? { transform: "translateY(-3px) rotate(-45deg)" } : undefined}
            />
          </button>

          {/* Reading-progress hairline along the header's lower edge */}
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ scaleX: progress }}
              className="absolute inset-x-0 bottom-0 h-px origin-left bg-copper/70"
            />
          )}
        </div>

        {/* Die Säulen — image-card accordion panel, full width beneath the row */}
        <div
          data-state={menu === "pillars" ? "open" : "closed"}
          className="nav-dropdown absolute inset-x-0 top-full hidden lg:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="nav-dropdown__overflow border-t border-night/10 bg-cream shadow-[0_30px_70px_-24px_rgba(29,41,29,0.35)]">
            <div className="nav-dropdown__overflow-inner">
              <ul className="mx-auto flex max-w-[1600px] gap-4 px-6 py-8 lg:px-10">
                {pillars.map((p) => (
                  <PillarCard key={p.slug} href={`/${p.slug}`} no={p.no} name={p.name} tagline={p.tagline} onNavigate={() => setMenu(null)} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Club — plain accordion panel, aligned right */}
        <div
          data-state={menu === "club" ? "open" : "closed"}
          className="nav-dropdown absolute inset-x-0 top-full hidden lg:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="nav-dropdown__overflow border-t border-night/10 bg-cream shadow-[0_30px_70px_-24px_rgba(29,41,29,0.35)]">
            <div className="nav-dropdown__overflow-inner">
              <div className="mx-auto max-w-[1600px] px-6 py-6 lg:px-10">
                <ul className="ml-auto flex max-w-xs flex-col">
                  {clubMenu.map((n) => (
                    <StaticRow key={n.href} href={n.href} label={n.label} onNavigate={() => setMenu(null)} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page-dim overlay while a dropdown or the mobile menu is open */}
      <div
        aria-hidden
        onClick={() => setMenu(null)}
        className={`page-bg fixed inset-0 z-30 bg-night/45 lg:block ${dimmed && !open ? "opacity-100" : "pointer-events-none opacity-0"} ${open ? "hidden" : ""}`}
      />

      {/* Mobile: full-screen panel with inline accordion dropdowns */}
      <div
        className={`fixed inset-0 z-30 overflow-y-auto bg-cream px-6 pb-16 pt-24 text-night transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col">
          <button
            data-dropdown-toggle
            aria-expanded={mobileMenu === "pillars"}
            onClick={() => setMobileMenu((m) => (m === "pillars" ? null : "pillars"))}
            className="flex items-center justify-between border-b border-night/10 py-5 text-left"
          >
            <span className="font-display text-2xl italic">Die Säulen</span>
            <span aria-hidden className={`text-sm transition-transform duration-300 ${mobileMenu === "pillars" ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>
          <div data-state={mobileMenu === "pillars" ? "open" : "closed"} className="nav-dropdown">
            <div className="nav-dropdown__overflow">
              <div className="nav-dropdown__overflow-inner">
                <ul className="grid grid-cols-2 gap-3 py-5">
                  {pillars.map((p) => (
                    <PillarCard key={p.slug} href={`/${p.slug}`} no={p.no} name={p.name} tagline={p.tagline} onNavigate={() => setOpen(false)} />
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {secondary.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`border-b border-night/10 py-5 font-display text-2xl italic ${isActive(n.href) ? "text-copper" : "text-night"}`}
            >
              {n.label}
            </Link>
          ))}

          <button
            data-dropdown-toggle
            aria-expanded={mobileMenu === "club"}
            onClick={() => setMobileMenu((m) => (m === "club" ? null : "club"))}
            className="flex items-center justify-between border-b border-night/10 py-5 text-left"
          >
            <span className="font-display text-2xl italic text-copper">Club 1464</span>
            <span aria-hidden className={`text-sm text-copper transition-transform duration-300 ${mobileMenu === "club" ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>
          <div data-state={mobileMenu === "club" ? "open" : "closed"} className="nav-dropdown">
            <div className="nav-dropdown__overflow">
              <div className="nav-dropdown__overflow-inner">
                <ul className="flex flex-col py-2">
                  {clubMenu.map((n) => (
                    <StaticRow key={n.href} href={n.href} label={n.label} onNavigate={() => setOpen(false)} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
