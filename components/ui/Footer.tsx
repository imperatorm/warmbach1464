"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { brand } from "@/lib/content";
import { Monogram } from "./Monogram";

const COLUMNS: { label: string; links: { href: string; text: string }[] }[] = [
  {
    label: "Die Säulen",
    links: [
      { href: "/zeit", text: "Zeit" },
      { href: "/boden", text: "Boden" },
      { href: "/baeume", text: "Bäume" },
      { href: "/galerie", text: "Galerie" },
      { href: "/journal", text: "Journal" },
      { href: "/contact", text: "Besuch" },
    ],
  },
  {
    label: "Die Marke",
    links: [
      { href: "/manufaktur", text: "Manufaktur" },
      { href: "/flasche", text: "Die Flasche" },
      { href: "/editions", text: "Editionen" },
      { href: "/club", text: "Club 1464" },
      { href: "/club/partner", text: "1464 Partner" },
      { href: "/sitz", text: "Mitglieder · Eintreten" },
    ],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done"); // no backend yet — visual confirmation only
  };

  if (state === "done") {
    return (
      <p className="mt-3 border border-gold/40 px-4 py-3 text-sm text-cream/80">
        Vorgemerkt. Wir schreiben an drei Tagen im Jahr.
      </p>
    );
  }
  return (
    <form className="mt-3" onSubmit={submit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="footer-newsletter" className="sr-only">
          E-Mail-Adresse
        </label>
        <input
          id="footer-newsletter"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="E-Mail"
          autoComplete="email"
          className={`min-w-0 flex-1 border bg-night px-3 py-2.5 text-sm text-cream placeholder:text-stone/60 focus:border-gold focus:outline-none ${
            state === "error" ? "border-terrakotta" : "border-hairline/30"
          }`}
        />
        <button
          type="submit"
          data-cursor
          className="border border-gold/70 px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream transition-colors duration-300 hover:bg-gold hover:text-night"
        >
          Eintragen
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs text-terrakotta" role="alert">
          Bitte eine gültige E-Mail-Adresse angeben.
        </p>
      )}
    </form>
  );
}

export function Footer() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLElement>(null);

  // Footer parallax (Osmo pattern, driven by Framer Motion instead of GSAP):
  // the inner sheet slides up from -25% while a dark veil fades from 0.5 → 0
  // as the footer is revealed at the end of the page.
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end end"] });
  const innerY = useTransform(scrollYProgress, [0, 1], ["-25%", "0%"]);
  const darkOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0]);

  if (pathname === "/enter" || pathname.startsWith("/sitz")) return null; // gate + portal have own chrome

  return (
    <footer ref={wrapRef} data-footer-parallax className="relative mt-12 overflow-hidden border-t border-hairline/10 bg-night">
      <motion.div
        data-footer-parallax-inner
        style={reduce ? undefined : { y: innerY }}
        className="border-t border-hairline/10 bg-soot/30 px-6 py-14 lg:px-10"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Monogram className="h-10 w-10 text-cream" />
            <p className="t-label">{brand.estate}</p>
            <p className="text-sm text-cream/70">{brand.claim}</p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.label} aria-label={col.label} className="flex flex-col gap-2.5 text-sm">
              <p className="t-label mb-2">{col.label}</p>
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  data-cursor
                  className="link-underline self-start text-cream/75 transition-colors duration-300 hover:text-gold"
                >
                  {l.text}
                </Link>
              ))}
            </nav>
          ))}
          <div className="flex flex-col gap-2 text-sm">
            <p className="t-label mb-2">Newsletter</p>
            <p className="text-sm text-cream/70">
              Hinweise an drei Tagen im Jahr — Brennstart, Abfüllung, Edition.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="hairline mt-12" />
        <div className="mx-auto mt-6 flex max-w-6xl flex-col justify-between gap-3 text-xs text-cream/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.house}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-5">
            <Link href="/legal" data-cursor className="link-underline hover:text-gold">
              Impressum
            </Link>
            <Link href="/legal#privacy" data-cursor className="link-underline hover:text-gold">
              Datenschutz
            </Link>
            <Link href="/legal#age" data-cursor className="link-underline hover:text-gold">
              Altersbestätigung
            </Link>
          </div>
        </div>

        {/* The house signature — glyphs spread edge to edge, cropped at the
            baseline so the sheet ends on the name rather than trailing off. */}
        <div
          aria-label={`${brand.master} — ${brand.house}`}
          className="mt-16 flex select-none items-end justify-between overflow-hidden px-1 lg:mt-20"
        >
          {["1", "4", "6", "4", "B", "Y", "W"].map((c, i) => (
            <span
              key={`${c}-${i}`}
              aria-hidden
              className="t-poster text-[13.5vw] leading-[0.78] text-cream/90"
            >
              {c}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Dark veil that lifts as the footer arrives */}
      <motion.div
        data-footer-parallax-dark
        aria-hidden
        style={reduce ? { opacity: 0 } : { opacity: darkOpacity }}
        className="pointer-events-none absolute inset-0 bg-black"
      />
    </footer>
  );
}
