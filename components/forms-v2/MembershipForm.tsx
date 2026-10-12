"use client";

import { useRef, useState } from "react";
import { brand } from "@/lib/content";
import { formatInquiry, validateInquiry } from "@/lib/inquiry";

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
  "mt-2 w-full border-b border-cream/25 bg-transparent px-0 py-3 text-base text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold focus:outline-none disabled:opacity-60";

type Status = "idle" | "submitting" | "sent" | "failed";

type Values = {
  name: string;
  email: string;
  phone: string;
  source: string;
  about: string;
  more: string;
  answers: string[];
};

const EMPTY: Values = { name: "", email: "", phone: "", source: "", about: "", more: "", answers: ["", "", ""] };

/**
 * The membership candidacy in the house form language (redesign/journal-galerie):
 * fields on baseline hairlines, micro-caps labels, the cream pill for the
 * primary action, the three questions as a fieldset.
 *
 * Staging version for /club/mitglied-werden/v2. The look is the branch's; the
 * transport is main's — it posts to /api/inquiry and confirms only once
 * delivery is confirmed, exactly like components/founders/MembershipForm.
 */
export function MembershipForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<HTMLParagraphElement>(null);

  const payload = () => ({
    kind: "membership" as const,
    name: values.name,
    email: values.email,
    phone: values.phone,
    source: values.source,
    message: values.about,
    more: values.more,
    answers: values.answers,
  });

  const set = <K extends keyof Values>(key: K) => (v: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors(({ [key as string]: _drop, ...rest }) => rest);
    if (status === "failed") setStatus("idle");
  };

  const setAnswer = (i: number) => (v: string) => {
    setValues((prev) => {
      const answers = [...prev.answers];
      answers[i] = v;
      return { ...prev, answers };
    });
    setErrors(({ [`q${i + 1}`]: _drop, ...rest }) => rest);
    if (status === "failed") setStatus("idle");
  };

  const mailtoFallback = () => {
    const { subject, text } = formatInquiry(payload());
    return `mailto:${brand.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validateInquiry(payload());
    if (found.length > 0) {
      setErrors(Object.fromEntries(found.map((f) => [f.field, f.message])));
      return;
    }
    setErrors({});

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  if (status === "sent") {
    return (
      <div className="border-t border-gold/50 pt-6" role="status">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">
          Eingereicht
        </p>
        <h3 className="t-hero mt-4 text-2xl text-cream">Danke für Ihre Vorstellung.</h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
          Ihre Worte liegen nun bei der Familie Wehrmann. Aufnahmen werden persönlich und
          ohne Eile entschieden. Bei einer Freigabe erhalten Sie Ihre Mitgliedschaft,
          dürfen eintreten — und können die Founder&rsquo;s Reserve N°1 erwerben.
        </p>
      </div>
    );
  }

  const busy = status === "submitting";
  const err = (id: string) =>
    errors[id] ? (
      <p id={`mf-${id}-error`} role="alert" className="mt-2 text-xs text-terrakotta">
        {errors[id]}
      </p>
    ) : null;
  /** Error ids come from validateInquiry (name, email, q1…); the hint, when there is one, stays described too. */
  const a11y = (id: string, hint?: string) => {
    const describedBy = [hint, errors[id] ? `mf-${id}-error` : undefined].filter(Boolean).join(" ");
    return {
      id: `mf-${id}`,
      "aria-invalid": Boolean(errors[id]) || undefined,
      "aria-describedby": describedBy || undefined,
      disabled: busy,
    };
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="mf-name" className={LABEL}>
            Name
          </label>
          <input
            {...a11y("name")}
            name="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            autoComplete="name"
            placeholder="Vor- und Nachname"
            data-cursor
            className={FIELD}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="mf-email" className={LABEL}>
            E-Mail
          </label>
          <input
            {...a11y("email")}
            type="email"
            name="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            autoComplete="email"
            placeholder="name@beispiel.com"
            data-cursor
            className={FIELD}
          />
          {err("email")}
        </div>
      </div>

      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="mf-phone" className={LABEL}>
            Telefon (optional)
          </label>
          <input
            {...a11y("phone")}
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
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
            {...a11y("source")}
            name="source"
            value={values.source}
            onChange={(e) => set("source")(e.target.value)}
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
          {...a11y("about", "mf-about-hint")}
          name="about"
          rows={4}
          value={values.about}
          onChange={(e) => set("about")(e.target.value)}
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
          {...a11y("more", "mf-more-hint")}
          name="more"
          value={values.more}
          onChange={(e) => set("more")(e.target.value)}
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
              {...a11y(`q${i + 1}`)}
              rows={3}
              name={`q${i + 1}`}
              value={values.answers[i]}
              onChange={(e) => setAnswer(i)(e.target.value)}
              data-cursor
              className={`${FIELD} resize-y`}
            />
            {err(`q${i + 1}`)}
          </div>
        ))}
      </fieldset>

      {status === "failed" && (
        <p
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="border-t border-terrakotta/60 pt-5 text-sm leading-relaxed text-cream/80 focus:outline-none"
        >
          Ihre Kandidatur konnte nicht übermittelt werden — sie ist{" "}
          <strong className="font-semibold text-cream">nicht</strong> bei uns angekommen. Ihre Antworten
          bleiben erhalten: bitte erneut einreichen, oder direkt senden an{" "}
          <a href={mailtoFallback()} data-cursor className="link-underline text-gold">
            {brand.contactEmail}
          </a>
          .
        </p>
      )}

      <div>
        <button
          type="submit"
          data-cursor
          disabled={busy}
          className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60"
        >
          {busy ? "Wird eingereicht …" : "Kandidatur einreichen"}
        </button>
        <p className="mt-5 max-w-md text-xs leading-relaxed text-cream/60">
          Mit dem Absenden bestätigen Sie, volljährig zu sein. Genuss mit Verantwortung.
        </p>
      </div>
    </form>
  );
}
