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

const inputCls =
  "mt-2 w-full border border-hairline/30 bg-soot/40 px-4 py-3 text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none";

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
 * The membership candidacy ("Vorstellung", not a checkout). It posts to
 * /api/inquiry and shows a confirmation only once delivery is confirmed —
 * a candidacy that never reached the family is never reported as filed.
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

  /** The direct path out when the transport is down — the candidacy travels with it. */
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
      <div className="border border-gold/30 bg-soot/20 p-10" role="status">
        <p className="t-label text-gold">Eingereicht</p>
        <h3 className="t-h3 mt-3 text-cream">Danke für Ihre Vorstellung.</h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
          Ihre Worte liegen nun bei der Familie Wehrmann. Aufnahmen werden persönlich und ohne Eile
          entschieden. Bei einer Freigabe erhalten Sie Ihre Mitgliedschaft, dürfen eintreten — und können
          die Founder&rsquo;s Reserve N°1 erwerben.
        </p>
      </div>
    );
  }

  const busy = status === "submitting";
  const err = (id: string) =>
    errors[id] ? (
      <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-terrakotta">
        {errors[id]}
      </p>
    ) : null;
  const a11y = (id: string) => ({
    id,
    "aria-invalid": Boolean(errors[id]) || undefined,
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
    disabled: busy,
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="t-label text-stone">Name</label>
          <input
            {...a11y("name")}
            name="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            autoComplete="name"
            placeholder="Vor- und Nachname"
            data-cursor
            className={inputCls}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="t-label text-stone">E-Mail</label>
          <input
            {...a11y("email")}
            type="email"
            name="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            autoComplete="email"
            placeholder="name@beispiel.com"
            data-cursor
            className={inputCls}
          />
          {err("email")}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="t-label text-stone">Telefon (optional)</label>
          <input
            {...a11y("phone")}
            name="phone"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            autoComplete="tel"
            placeholder="+43 …"
            data-cursor
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="source" className="t-label text-stone">Wie haben Sie von uns gehört?</label>
          <select
            {...a11y("source")}
            name="source"
            value={values.source}
            onChange={(e) => set("source")(e.target.value)}
            data-cursor
            className={`${inputCls} [color-scheme:dark]`}
          >
            <option value="" disabled>Bitte wählen …</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="about" className="t-label text-stone">Über Sie</label>
        <p id="about-hint" className="mt-1 text-xs leading-relaxed text-stone/70">
          Optional. Erzählen Sie, wer Sie sind — Herkunft, Werdegang, was Sie begeistert. So viel oder so
          wenig, wie Sie mögen.
        </p>
        <textarea
          id="about"
          name="about"
          rows={5}
          value={values.about}
          onChange={(e) => set("about")(e.target.value)}
          disabled={busy}
          aria-describedby="about-hint"
          placeholder="Ein paar Worte zu Ihnen …"
          data-cursor
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label htmlFor="more" className="t-label text-stone">
          Weitere Angaben (Profile, Empfehlende, Kontext)
        </label>
        <input
          {...a11y("more")}
          name="more"
          value={values.more}
          onChange={(e) => set("more")(e.target.value)}
          placeholder="z. B. Instagram, Website, Name des empfehlenden Mitglieds …"
          data-cursor
          className={inputCls}
        />
      </div>

      <div className="mt-2 flex flex-col gap-6 border-t border-hairline/15 pt-8">
        <p className="t-label text-gold">Drei Fragen</p>
        {QUESTIONS.map((q, i) => (
          <div key={q}>
            <label htmlFor={`q${i + 1}`} className="block text-sm leading-relaxed text-cream/85">
              {i + 1}. {q}
            </label>
            <textarea
              {...a11y(`q${i + 1}`)}
              rows={3}
              name={`q${i + 1}`}
              value={values.answers[i]}
              onChange={(e) => setAnswer(i)(e.target.value)}
              data-cursor
              className={`${inputCls} resize-none`}
            />
            {err(`q${i + 1}`)}
          </div>
        ))}
      </div>

      {/* The transport failed. The candidacy stays on screen, word for word. */}
      {status === "failed" && (
        <p
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="border border-terrakotta/50 px-5 py-4 text-sm leading-relaxed text-cream/80 focus:outline-none"
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

      <button type="submit" data-cursor disabled={busy} className="btn-primary mt-2 justify-center disabled:opacity-60">
        {busy ? "Wird eingereicht …" : "Kandidatur einreichen →"}
      </button>
      <p className="text-xs leading-relaxed text-stone/70">
        Mit dem Absenden bestätigen Sie, volljährig zu sein. Genuss mit Verantwortung.
      </p>
    </form>
  );
}
