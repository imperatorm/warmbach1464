"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { nav, secondary, clubMenu, brand } from "@/lib/content";
import { Monogram } from "./Monogram";
import { GooFilter } from "./GooFilter";

const numerals = ["I", "II", "III", "IV", "V"];

/**
 * Gooey pill: the text sits crisp on top; the capsule itself is a background
 * span that stretches horizontally on hover. Because the whole row runs
 * through the goo filter, a stretching capsule flows into its neighbours
 * with a liquid neck (Floema's nav behaviour).
 */
function GooPill({
  children,
  accent = false,
  active = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
  active?: boolean;
}) {
  const bg = accent || active ? "bg-gold" : "bg-cream";
  return (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full ${bg} transition-transform duration-300 ease-deep group-hover/pill:scale-x-[1.22] group-hover/pill:scale-y-[1.06]`}
      />
      <span className="relative inline-flex items-center gap-1.5">{children}</span>
    </>
  );
}

const pillBase =
  "group/pill relative inline-flex items-center px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-night";

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<null | "pillars" | "club">(null);

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
          scrolled || open ? "bg-night/70 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" data-cursor aria-label={`${brand.master} — Startseite`} className="group flex items-center gap-2.5">
            <span className="font-display text-[1.7rem] leading-none tracking-[0.01em] text-cream [text-shadow:0_1px_10px_rgba(0,0,0,0.35)]">
              1464
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/70 [margin-inline-end:-0.28em]">by</span>
            <Monogram className="h-7 w-auto text-cream transition-transform duration-500 group-hover:scale-105" />
          </Link>

          {/* Desktop: gooey pill row; dropdowns live OUTSIDE the filter */}
          <nav className="relative hidden lg:block" onMouseLeave={() => setMenu(null)}>
            <GooFilter id="nav-goo" blur={6} />
            <div style={{ filter: "url(#nav-goo)" }} className="flex items-center gap-2.5">
              <button
                data-cursor
                aria-haspopup="true"
                aria-expanded={menu === "pillars"}
                onMouseEnter={() => setMenu("pillars")}
                onFocus={() => setMenu("pillars")}
                className={pillBase}
              >
                <GooPill active={pillarActive || menu === "pillars"}>
                  Die Säulen
                  <span aria-hidden className="text-[0.5rem] opacity-60">▾</span>
                </GooPill>
              </button>

              {secondary.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  data-cursor
                  onMouseEnter={() => setMenu(null)}
                  className={pillBase}
                >
                  <GooPill active={isActive(n.href)}>{n.label}</GooPill>
                </Link>
              ))}

              <Link
                href="/club"
                data-cursor
                aria-haspopup="true"
                aria-expanded={menu === "club"}
                onMouseEnter={() => setMenu("club")}
                onFocus={() => setMenu("club")}
                className={`${pillBase} ml-2`}
              >
                <GooPill accent>
                  Club 1464
                  <span aria-hidden className="text-[0.5rem] opacity-60">▾</span>
                </GooPill>
              </Link>
            </div>

            {/* Säulen menu — anchored to the row start */}
            {menu === "pillars" && (
              <div className="absolute left-0 top-full w-64 pt-3">
                <div className="overflow-hidden rounded-3xl bg-cream p-2 shadow-[0_24px_70px_-18px_rgba(29,41,29,0.5)]">
                  {nav.map((n, i) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      data-cursor
                      onClick={() => setMenu(null)}
                      className="flex items-baseline gap-3 rounded-full px-5 py-2.5 text-sm text-night transition-colors hover:bg-kalk"
                    >
                      <span className="font-display text-xs italic text-copper">{numerals[i]}</span>
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Club menu — anchored to the row end */}
            {menu === "club" && (
              <div className="absolute right-0 top-full w-72 pt-3">
                <div className="overflow-hidden rounded-3xl bg-cream p-2 shadow-[0_24px_70px_-18px_rgba(29,41,29,0.5)]">
                  {clubMenu.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      data-cursor
                      onClick={() => setMenu(null)}
                      className="flex items-center justify-between rounded-full px-5 py-2.5 text-sm text-night transition-colors hover:bg-kalk"
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
            className={`${pillBase} lg:hidden`}
          >
            <GooPill>{open ? "Schließen" : "Menü"}</GooPill>
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
