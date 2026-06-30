"use client";

import { useState } from "react";
import { brand } from "@/lib/content";
import type { ConciergeMessage } from "@/lib/founders/types";

export function ConciergeThread({ seed }: { seed: ConciergeMessage[] }) {
  const [messages, setMessages] = useState<ConciergeMessage[]>(seed);
  const [draft, setDraft] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "member", text: draft.trim(), dateLabel: "gerade eben" }]);
    setDraft("");
  }

  return (
    <div className="border border-hairline/15 bg-soot/20 p-8">
      <h3 className="t-h3 text-cream">Concierge-Direktdraht</h3>
      <p className="mt-2 text-sm text-cream/70">Persönlich, {brand.contactEmail}. Antwort binnen 48 Stunden.</p>

      <ul className="mt-7 flex flex-col gap-4">
        {messages.map((m, i) => (
          <li key={i} className={m.from === "member" ? "ml-auto max-w-[80%] text-right" : "mr-auto max-w-[80%]"}>
            <p className="t-label text-stone">{m.from === "member" ? "Sie" : "Concierge"} · {m.dateLabel}</p>
            <p
              className={`mt-1 inline-block px-4 py-3 text-sm leading-relaxed ${
                m.from === "member" ? "bg-gold/15 text-cream" : "bg-night text-cream/80 border border-hairline/15"
              }`}
            >
              {m.text}
            </p>
          </li>
        ))}
      </ul>

      <form onSubmit={send} className="mt-7 flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nachricht an den Hof …"
          data-cursor
          className="flex-1 border border-hairline/30 bg-night px-4 py-3 text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
        />
        <button type="submit" data-cursor className="btn-primary justify-center">Senden →</button>
      </form>
      <p className="mt-4 text-xs text-stone/70">(Prototyp — der Hof antwortet hier nicht automatisch.)</p>
    </div>
  );
}
