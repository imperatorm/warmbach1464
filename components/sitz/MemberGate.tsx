"use client";

import { useState } from "react";
import Link from "next/link";
import { Monogram } from "@/components/ui/Monogram";
import { parseSeatNo, checkAccess } from "@/lib/founders/member";
import { writeSession } from "@/lib/founders/session";
import { foundersData } from "@/lib/founders/data";

const SEATS = Array.from({ length: 1464 }, (_, i) => i + 1);

export function MemberGate() {
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const seatNo = parseSeatNo(id); // highlights the seat live, null if invalid

  function takeSeat(e: React.FormEvent) {
    e.preventDefault();
    const found = foundersData.members.find((m) => m.id === id.trim());
    if (found && checkAccess(id, code, found)) {
      writeSession(found.id);
      return;
    }
    setError(found ? "Der Code stimmt nicht." : "Diese Sitznummer kennen wir nicht.");
  }

  return (
    <div className="relative min-h-screen bg-night px-6 py-24 flex items-center justify-center">
      <Link
        href="/"
        data-cursor
        aria-label="Zur Startseite"
        className="absolute left-6 top-6 flex items-center gap-1.5 lg:left-10 lg:top-8"
      >
        <span className="font-display text-xl leading-none text-cream [font-variation-settings:'opsz'_48]">1464</span>
        <span className="text-[0.6rem] uppercase tracking-[0.22em] text-gold [margin-inline-end:-0.22em]">by</span>
        <Monogram className="h-5 w-auto transition-transform duration-500 hover:scale-105" />
      </Link>
      <div className="w-full max-w-5xl grid gap-14 lg:grid-cols-2 lg:items-center">
        {/* The wall of 1464 seats */}
        <div aria-hidden className="order-2 lg:order-1">
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: "repeat(40, minmax(0, 1fr))" }}
          >
            {SEATS.map((n) => (
              <span
                key={n}
                className={`aspect-square rounded-full transition-colors duration-300 ${
                  n === seatNo ? "bg-gold shadow-[0_0_10px_2px_rgba(197,126,91,0.7)]" : "bg-hairline/15"
                }`}
              />
            ))}
          </div>
          <p className="t-label mt-6 text-stone">1464 · Der Sitzkreis</p>
        </div>

        {/* Entry form */}
        <form onSubmit={takeSeat} className="order-1 lg:order-2 max-w-sm">
          <p className="t-label mb-6">Founder&rsquo;s Circle</p>
          <h1 className="t-h1 text-cream mb-3">Nehmen Sie Platz.</h1>
          <p className="t-lead mb-10 text-cream/75">
            Eintritt über Ihre Mitgliedsnummer und Ihr Wachssiegel.
          </p>

          <label className="t-label text-stone">Mitgliedsnummer</label>
          <input
            value={id}
            onChange={(e) => { setId(e.target.value); setError(""); }}
            placeholder="1464.0007"
            autoComplete="off"
            data-cursor
            className="mt-2 mb-6 w-full border border-hairline/30 bg-soot/40 px-5 py-4 tracking-[0.2em] text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
          />

          <label className="t-label text-stone">Wachssiegel-Code</label>
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            type="password"
            inputMode="numeric"
            placeholder="••••"
            data-cursor
            className="mt-2 w-full border border-hairline/30 bg-soot/40 px-5 py-4 tracking-[0.4em] text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
          />

          {error && <p role="alert" className="mt-4 text-xs uppercase tracking-[0.15em] text-gold">{error}</p>}

          <button type="submit" data-cursor className="btn-primary mt-8 w-full justify-center">
            Platz einnehmen →
          </button>

          <p className="mt-8 text-xs leading-relaxed text-stone/70">
            Demo-Zugang: <span className="text-cream/80">1464.0007</span> · Code <span className="text-cream/80">1464</span>
          </p>
        </form>
      </div>
    </div>
  );
}
