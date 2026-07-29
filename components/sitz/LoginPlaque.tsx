"use client";

import { useEffect, useState } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { SITZ_PLAQUE_KEY } from "@/lib/founders/session";
import type { Member } from "@/lib/founders/types";

/**
 * Bronze "Kupferpressung" shown once per login: monogram, member number, name,
 * seat / admission year / Roman reading. Dismissed with ×; the dashboard stays
 * dimly visible behind it. The seen-flag is per session and cleared on logout
 * (see clearSession), so a fresh login shows it again.
 */
export function LoginPlaque({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SITZ_PLAQUE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(SITZ_PLAQUE_KEY, "1");
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  const seat = String(member.seatNo).padStart(4, "0");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 px-6 backdrop-blur-[3px]"
    >
      <div className="copper-plate relative w-full max-w-md overflow-hidden rounded-[3px] border border-gold/40 p-10 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]">
        {/* real copper texture (subtle) + fine brushing + struck highlight + inner emboss */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/warmbach/img_0070.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.10] mix-blend-overlay"
        />
        <div aria-hidden className="copper-plate-grain pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_14%,rgba(255,236,206,0.34),transparent_55%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[2px] border border-cream/12" />

        <button
          onClick={dismiss}
          aria-label="Schließen"
          data-cursor
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center text-xl leading-none text-cream/55 transition-colors hover:text-cream"
        >
          ×
        </button>

        <div className="relative">
          <Monogram className="mx-auto h-9 w-9" />
          <p className="mt-4 text-[0.68rem] uppercase tracking-[0.32em] text-cream/70">
            Warmbachhof · Founder&rsquo;s Circle
          </p>

          <p className="mt-7 holo-num font-display text-5xl tabular-nums [font-variation-settings:'opsz'_48]">
            1464.{seat}
          </p>
          <p className="mt-3 text-sm tracking-wide text-cream/85">{member.name}</p>

          <div className="mx-auto mt-7 h-px w-16 bg-gold/40" />

          <div className="mt-6 flex justify-center gap-8 text-[0.66rem] uppercase tracking-[0.16em]">
            <div>
              <p className="text-cream/45">Sitz</p>
              <p className="mt-1 tabular-nums text-cream/90">{member.seatNo} / 1464</p>
            </div>
            <div>
              <p className="text-cream/45">Aufnahme</p>
              <p className="mt-1 tabular-nums text-cream/90">{member.joinedYear}</p>
            </div>
            <div>
              <p className="text-cream/45">Lesart</p>
              <p className="mt-1 tracking-[0.12em] text-cream/90">MCDLXIV</p>
            </div>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-cream/60">
            Ihr Sitz im Kreis der 1464 — in Bronze, auf Lebenszeit.
          </p>
        </div>
      </div>
    </div>
  );
}
