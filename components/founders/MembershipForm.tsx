"use client";

import { useState } from "react";

const SOURCES = [
  "Empfehlung eines Mitglieds",
  "Gastronomie",
  "Presse / Redaktion",
  "Persönlich am Hof",
  "Online",
  "Anderes",
];

const QUESTIONS = [
  "Was bedeutet es für Sie, Teil der Warmbach-Familie zu werden?",
  "Hier reift alles über Jahre, ohne Eile. Was bedeutet Ihnen Zeit als Wert?",
  "Was verbindet Sie mit Kitzbühel, dem Warmbachhof oder dem Handwerk des Brennens?",
];

const inputCls =
  "mt-2 w-full border border-hairline/30 bg-soot/40 px-4 py-3 text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none";

/**
 * Membership candidacy form ("Vorstellung", not a checkout). Prototype:
 * optimistic confirmation, no real submission — clearly marked.
 */
export function MembershipForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border border-gold/30 bg-soot/20 p-10">
        <p className="t-label text-gold">Eingereicht</p>
        <h3 className="t-h3 mt-3 text-cream">Danke für Ihre Vorstellung.</h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
          Ihre Worte liegen nun bei der Familie Wehrmann. Aufnahmen werden persönlich und ohne Eile
          entschieden. Bei einer Freigabe erhalten Sie Ihre Mitgliedschaft, dürfen eintreten — und können
          die Founder&rsquo;s Reserve N°1 erwerben.
        </p>
        <p className="mt-5 text-xs text-stone/70">(Prototyp — repräsentative Bestätigung, kein echter Versand.)</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="t-label text-stone">Name</label>
          <input required name="name" placeholder="Vor- und Nachname" data-cursor className={inputCls} />
        </div>
        <div>
          <label className="t-label text-stone">E-Mail</label>
          <input required type="email" name="email" placeholder="name@beispiel.com" data-cursor className={inputCls} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="t-label text-stone">Telefon (optional)</label>
          <input name="phone" placeholder="+43 …" data-cursor className={inputCls} />
        </div>
        <div>
          <label className="t-label text-stone">Wie haben Sie von uns gehört?</label>
          <select name="source" defaultValue="" data-cursor className={`${inputCls} [color-scheme:dark]`}>
            <option value="" disabled>Bitte wählen …</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="t-label text-stone">Über Sie</label>
        <p className="mt-1 text-xs leading-relaxed text-stone/70">
          Optional. Erzählen Sie, wer Sie sind — Herkunft, Werdegang, was Sie begeistert. So viel oder so
          wenig, wie Sie mögen.
        </p>
        <textarea
          name="about"
          rows={5}
          placeholder="Ein paar Worte zu Ihnen …"
          data-cursor
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className="t-label text-stone">Weitere Angaben (Profile, Empfehlende, Kontext)</label>
        <input
          name="more"
          placeholder="z. B. Instagram, Website, Name des empfehlenden Mitglieds …"
          data-cursor
          className={inputCls}
        />
      </div>

      <div className="mt-2 flex flex-col gap-6 border-t border-hairline/15 pt-8">
        <p className="t-label text-gold">Drei Fragen</p>
        {QUESTIONS.map((q, i) => (
          <div key={i}>
            <label className="block text-sm leading-relaxed text-cream/85">
              {i + 1}. {q}
            </label>
            <textarea required rows={3} name={`q${i + 1}`} data-cursor className={`${inputCls} resize-none`} />
          </div>
        ))}
      </div>

      <button type="submit" data-cursor className="btn-primary mt-2 justify-center">
        Kandidatur einreichen →
      </button>
      <p className="text-xs leading-relaxed text-stone/70">
        Mit dem Absenden bestätigen Sie, volljährig zu sein. Genuss mit Verantwortung.
      </p>
    </form>
  );
}
