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

const LABEL = "block text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-cream/70";
const FIELD =
  "mt-2 w-full border-b border-cream/25 bg-transparent px-0 py-3 text-base text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold focus:outline-none";

/**
 * Membership candidacy form ("Vorstellung", not a checkout) in the house form
 * language: fields on baseline hairlines, micro-caps labels, the cream pill
 * for the primary action.
 *
 * Every label is bound to its control with htmlFor/id — the previous version
 * used bare <label> elements, so assistive technology never announced them.
 *
 * Prototype: optimistic confirmation, no real submission — stated plainly.
 */
export function MembershipForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border-t border-gold/50 pt-6">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">
          Eingereicht
        </p>
        <h3 className="t-hero mt-4 text-2xl text-cream">Danke für Ihre Vorstellung.</h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
          Ihre Worte liegen nun bei der Familie Wehrmann. Aufnahmen werden persönlich und
          ohne Eile entschieden. Bei einer Freigabe erhalten Sie Ihre Mitgliedschaft,
          dürfen eintreten — und können die Founder&rsquo;s Reserve N°1 erwerben.
        </p>
        <p className="mt-5 text-xs text-cream/60">
          (Prototyp — repräsentative Bestätigung, kein echter Versand.)
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-9"
    >
      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="mf-name" className={LABEL}>
            Name
          </label>
          <input
            id="mf-name"
            required
            name="name"
            autoComplete="name"
            placeholder="Vor- und Nachname"
            data-cursor
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="mf-email" className={LABEL}>
            E-Mail
          </label>
          <input
            id="mf-email"
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@beispiel.com"
            data-cursor
            className={FIELD}
          />
        </div>
      </div>

      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="mf-phone" className={LABEL}>
            Telefon (optional)
          </label>
          <input
            id="mf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+43 …"
            data-cursor
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="mf-source" className={LABEL}>
            Wie haben Sie von uns gehört?
          </label>
          <select
            id="mf-source"
            name="source"
            defaultValue=""
            data-cursor
            className={`${FIELD} [color-scheme:dark]`}
          >
            <option value="" disabled>
              Bitte wählen …
            </option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mf-about" className={LABEL}>
          Über Sie
        </label>
        <p id="mf-about-hint" className="mt-1.5 text-xs leading-relaxed text-cream/60">
          Optional. Erzählen Sie, wer Sie sind — Herkunft, Werdegang, was Sie begeistert.
          So viel oder so wenig, wie Sie mögen.
        </p>
        <textarea
          id="mf-about"
          name="about"
          rows={4}
          aria-describedby="mf-about-hint"
          placeholder="Ein paar Worte zu Ihnen …"
          data-cursor
          className={`${FIELD} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="mf-more" className={LABEL}>
          Weitere Angaben
        </label>
        <p id="mf-more-hint" className="mt-1.5 text-xs leading-relaxed text-cream/60">
          Profile, Empfehlende, Kontext.
        </p>
        <input
          id="mf-more"
          name="more"
          aria-describedby="mf-more-hint"
          placeholder="z. B. Instagram, Website, Name des empfehlenden Mitglieds …"
          data-cursor
          className={FIELD}
        />
      </div>

      <fieldset className="mt-2 flex flex-col gap-8 border-t border-cream/20 pt-8">
        <legend className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">
          Drei Fragen
        </legend>
        {QUESTIONS.map((q, i) => (
          <div key={q}>
            <label htmlFor={`mf-q${i + 1}`} className="block text-sm leading-relaxed text-cream/85">
              <span className="mr-2 text-gold">{String(i + 1).padStart(2, "0")}</span>
              {q}
            </label>
            <textarea
              id={`mf-q${i + 1}`}
              required
              rows={3}
              name={`q${i + 1}`}
              data-cursor
              className={`${FIELD} resize-y`}
            />
          </div>
        ))}
      </fieldset>

      <div>
        <button
          type="submit"
          data-cursor
          className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Kandidatur einreichen
        </button>
        <p className="mt-5 max-w-md text-xs leading-relaxed text-cream/60">
          Mit dem Absenden bestätigen Sie, volljährig zu sein. Genuss mit Verantwortung.
        </p>
      </div>
    </form>
  );
}
