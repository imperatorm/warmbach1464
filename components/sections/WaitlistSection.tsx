"use client";

import { useState } from "react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Hier würde später eine Server Action / API call laufen
    setSubmitted(true);
  }

  return (
    <section className="py-32 px-6 lg:px-12 border-t border-hairline/10">
      <div className="max-w-2xl mx-auto text-center">
        <p className="signage text-gold mb-4">Club 1464</p>
        <h2 className="display text-4xl md:text-5xl text-cream mb-6 leading-tight">
          1464.
          <br />
          Nicht mehr.
        </h2>
        <p className="text-cream/75 leading-relaxed mb-10">
          Der Club 1464 ist auf 1464 limitiert — ein Sitzkreis als
          Wortspiel zum Gründungsjahr 1464. Aufnahme nur über Erstkauf, Empfehlung
          oder Patenfass, gefolgt von einem Tasting am Hof.
        </p>
        {submitted ? (
          <p className="text-gold display text-xl">Wir melden uns persönlich.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Ihre E-Mail"
              className="flex-1 bg-night border border-hairline/30 px-4 py-4 text-cream focus:outline-none focus:border-gold"
            />
            <button type="submit" className="btn-primary justify-center">
              Anfrage stellen →
            </button>
          </form>
        )}
        <p className="text-stone text-xs mt-6">
          Eintritt nach persönlicher Bestätigung. Concierge meldet sich innerhalb 48 h.
        </p>
      </div>
    </section>
  );
}
