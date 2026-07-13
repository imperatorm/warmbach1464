"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { nav, secondary, clubMenu, brand } from "@/lib/content";
import { Monogram } from "./Monogram";

const numerals = ["I", "II", "III", "IV", "V"];

const linkBase =
  "text-[0.66rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300";

/**
 * Editorial header (PROmeat grammar): a solid cream bar with the wordmark
 * left, quiet uppercase links with an underline hover, and the Club as an
 * outlined oval on the right. The gooey-pill interaction has been retired.
 */
export function Navigation() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<null | "pillars" | "club">(null);
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
  }, [pathname]);

  if (pathname === "/enter" || pathname.startsWith("/sitz")) return null; // gate + portal have own chrome

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const pillarActive = nav.some((n) => isActive(n.href));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-night/10 bg-cream text-night">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" data-cursor aria-label={`${brand.master} — Startseite`} className="group flex items-center gap-2.5">
            <span className="font-display text-[1.7rem] leading-none tracking-[0.01em]">1464</span>
            <span className="text-[0.6rem] uppercase tracking-[0.28em] text-night/60 [margin-inline-end:-0.28em]">by</span>
            <Monogram className="h-7 w-auto text-night transition-transform duration-500 group-hover:scale-105" />
          </Link>

          {/* Desktop: quiet uppercase link row */}
          <nav className="relative hidden items-center gap-9 lg:flex" onMouseLeave={() => setMenu(null)}>
            <button
              data-cursor
              aria-haspopup="true"
              aria-expanded={menu === "pillars"}
              onMouseEnter={() => setMenu("pillars")}
              onFocus={() => setMenu("pillars")}
              className={`${linkBase} inline-flex items-center gap-1.5 ${
                pillarActive || menu === "pillars" ? "text-copper" : "text-night hover:text-copper"
              }`}
            >
              Die Säulen
              <span aria-hidden className="text-[0.5rem] opacity-60">▾</span>
            </button>

            {secondary.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-cursor
                data-underline-link
                onMouseEnter={() => setMenu(null)}
                className={`${linkBase} link-underline ${isActive(n.href) ? "text-copper" : "text-night hover:text-copper"}`}
              >
                {n.label}
              </Link>
            ))}

            <Link
              href="/club"
              data-cursor
              aria-haspopup="true"
              aria-expanded={menu === "club"}
              onMouseEnter={() => setMenu("club")}
              onFocus={() => setMenu("club")}
              className={`${linkBase} ml-2 rounded-full border px-5 py-2.5 ${
                isActive("/club") || menu === "club"
                  ? "border-copper bg-copper text-cream"
                  : "border-night/35 text-night hover:border-copper hover:text-copper"
              }`}
            >
              Club 1464
            </Link>

            {/* Säulen menu — a quiet cream sheet under the bar */}
            {menu === "pillars" && (
              <div className="absolute left-0 top-full w-64 pt-4">
                <div className="border border-night/12 bg-cream py-2 shadow-[0_24px_70px_-18px_rgba(29,41,29,0.35)]">
                  {nav.map((n, i) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      data-cursor
                      onClick={() => setMenu(null)}
                      className="flex items-baseline gap-3 px-6 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-kalk hover:text-copper"
                    >
                      <span className="font-display text-xs italic text-copper">{numerals[i]}</span>
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Club menu */}
            {menu === "club" && (
              <div className="absolute right-0 top-full w-72 pt-4">
                <div className="border border-night/12 bg-cream py-2 shadow-[0_24px_70px_-18px_rgba(29,41,29,0.35)]">
                  {clubMenu.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      data-cursor
                      onClick={() => setMenu(null)}
                      className="flex items-center justify-between px-6 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-kalk hover:text-copper"
                    >
                      {n.label} <span aria-hidden className="text-copper">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            data-cursor
            aria-expanded={open}
            aria-label="Menü"
            className={`${linkBase} rounded-full border border-night/35 px-5 py-2.5 text-night lg:hidden`}
          >
            {open ? "Schließen" : "Menü"}
          </button>
        </div>

        {/* Reading-progress hairline along the header's lower edge */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-copper/70"
          />
        )}
      </header>

      {open && (
        <div className="fixed inset-0 z-30 flex flex-col justify-center gap-8 overflow-y-auto bg-cream px-8 py-24 text-night lg:hidden">
          <div>
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">Die Säulen</p>
            <div className="flex flex-col gap-1">
              {nav.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i + 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`block py-1.5 font-display text-3xl ${isActive(n.href) ? "text-copper" : "text-night"}`}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">Mehr</p>
            <div className="flex flex-col gap-1.5">
              {secondary.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`block text-lg ${isActive(n.href) ? "text-copper" : "text-night/85"}`}>
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">Club 1464</p>
            <div className="flex flex-col gap-1.5">
              {clubMenu.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block text-lg text-night/85">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
