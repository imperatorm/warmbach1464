"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { nav, secondary, clubMenu, brand } from "@/lib/content";
import { Monogram } from "./Monogram";

const numerals = ["I", "II", "III", "IV", "V"];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname === "/enter" || pathname.startsWith("/sitz")) return null; // gate + portal have own chrome

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const pillarActive = nav.some((n) => isActive(n.href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled || open
            ? "border-b border-hairline/10 bg-night/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" data-cursor aria-label={`${brand.master} — Startseite`} className="group flex items-center gap-2.5">
            <span className="font-display text-[1.7rem] leading-none tracking-[0.01em] text-cream">1464</span>
            <span className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/55 [margin-inline-end:-0.28em]">by</span>
            <Monogram className="h-7 w-auto text-cream transition-transform duration-500 group-hover:scale-105" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {/* Die Säulen — eine Kategorie */}
            <div className="group relative">
              <button
                data-cursor
                className={`link-underline flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                  pillarActive ? "text-gold" : "text-cream/70 hover:text-cream"
                }`}
              >
                Die Säulen
                <span aria-hidden className="text-[0.55rem] text-gold">▾</span>
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="border border-hairline/20 bg-soot/95 p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md">
                  {nav.map((n, i) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      data-cursor
                      className="flex items-baseline gap-3 px-4 py-2.5 text-sm tracking-[0.02em] text-cream transition-colors hover:text-gold"
                    >
                      <span className="font-display text-xs italic text-gold/70">{numerals[i]}</span>
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Weitere Punkte */}
            {secondary.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-cursor
                className={`link-underline text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                  isActive(n.href) ? "text-gold" : "text-cream/70 hover:text-cream"
                }`}
              >
                {n.label}
              </Link>
            ))}

            {/* Club — rechts, mit Menü */}
            <div className="group relative">
              <Link
                href="/club"
                data-cursor
                className="inline-flex items-center gap-1.5 border border-gold/50 px-5 py-2 text-xs uppercase tracking-[0.18em] text-cream transition-colors duration-300 group-hover:bg-gold group-hover:text-night"
              >
                Club 1464
                <span aria-hidden className="text-[0.55rem]">▾</span>
              </Link>
              <div className="invisible absolute right-0 top-full z-50 w-64 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="border border-hairline/20 bg-soot/95 p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md">
                  {clubMenu.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      data-cursor
                      className="block px-4 py-2.5 text-sm tracking-[0.02em] text-cream transition-colors hover:text-gold"
                    >
                      {n.label} <span aria-hidden className="text-gold/60">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            data-cursor
            aria-expanded={open}
            aria-label="Menü"
            className="text-xs uppercase tracking-[0.2em] text-gold lg:hidden"
          >
            {open ? "Schließen" : "Menü"}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 flex flex-col justify-center gap-8 overflow-y-auto bg-night px-8 py-24 lg:hidden">
          <div>
            <p className="t-label mb-3 text-stone">Die Säulen</p>
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
                    className={`block py-1.5 font-display text-3xl ${isActive(n.href) ? "text-gold" : "text-cream"}`}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <p className="t-label mb-3 text-stone">Mehr</p>
            <div className="flex flex-col gap-1.5">
              {secondary.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`block text-lg ${isActive(n.href) ? "text-gold" : "text-cream/85"}`}>
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="t-label mb-3 text-gold">Club 1464</p>
            <div className="flex flex-col gap-1.5">
              {clubMenu.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block text-lg text-cream/85">
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
