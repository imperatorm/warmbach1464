"use client";

import { useState } from "react";

type Props = {
  /** Heading + intent shown above the form. */
  title: string;
  intro: string;
  /** Label for the free-text field. */
  fieldLabel: string;
  placeholder: string;
  /** If true, show an optional date field (used by Gasthof). */
  withDate?: boolean;
  /** Disable submission with this note (e.g. Gasthof night already used). */
  disabledNote?: string;
};

export function RequestForm({ title, intro, fieldLabel, placeholder, withDate, disabledNote }: Props) {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState("");

  if (disabledNote) {
    return (
      <div className="border border-hairline/15 bg-soot/20 p-8">
        <h3 className="t-h3 text-cream">{title}</h3>
        <p className="mt-3 text-sm text-cream/70">{disabledNote}</p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="border border-gold/30 bg-soot/20 p-8">
        <p className="t-label text-gold">Angefragt</p>
        <h3 className="t-h3 mt-2 text-cream">{title}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
          Ihre Anfrage liegt beim Concierge. Wir bestätigen persönlich, binnen 48 Stunden.
        </p>
        <p className="mt-4 text-xs text-stone/70">(Prototyp — repräsentative Bestätigung, kein echter Versand.)</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      className="border border-hairline/15 bg-soot/20 p-8"
    >
      <h3 className="t-h3 text-cream">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">{intro}</p>

      {withDate && (
        <>
          <label className="t-label mt-6 block text-stone">Wunschtermin</label>
          <input
            type="date"
            data-cursor
            className="mt-2 w-full border border-hairline/30 bg-night px-4 py-3 text-cream [color-scheme:dark] focus:border-gold focus:outline-none"
          />
        </>
      )}

      <label className="t-label mt-6 block text-stone">{fieldLabel}</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        data-cursor
        className="mt-2 w-full resize-none border border-hairline/30 bg-night px-4 py-3 text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
      />

      <button type="submit" data-cursor className="btn-primary mt-6 justify-center">
        Anfrage senden →
      </button>
    </form>
  );
}
