"use client";

import { useState } from "react";
import { foundersData } from "@/lib/founders/data";
import { RequestForm } from "@/components/sitz/RequestForm";
import { ConciergeThread } from "@/components/sitz/ConciergeThread";

const TABS = [
  { key: "flasche", label: "Flasche auf Anfrage" },
  { key: "gasthof", label: "Gasthof" },
  { key: "concierge", label: "Concierge" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AnfragenPage() {
  const [tab, setTab] = useState<TabKey>("flasche");
  const { gasthof, concierge } = foundersData;

  return (
    <div>
      <p className="t-label">Anfragen</p>
      <h1 className="t-h1 text-cream mt-3">Beauftragen, nicht bestellen.</h1>
      <p className="t-lead mt-5 max-w-xl">Jede Anfrage wird vom Hof persönlich bestätigt.</p>

      <div className="mt-10 flex gap-6 border-b border-hairline/15">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-cursor
            className={`pb-3 text-xs uppercase tracking-[0.16em] transition-colors ${
              tab === t.key ? "border-b border-gold text-gold" : "text-cream/60 hover:text-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10 max-w-xl">
        {tab === "flasche" && (
          <RequestForm
            title="Flasche auf Anfrage"
            intro="Patron-Cask, Sonderallokation oder eine individuelle Edition. Nennen Sie Ihren Wunsch — der Concierge meldet sich."
            fieldLabel="Ihr Wunsch"
            placeholder="z. B. Patron-Cask-Vorrecht, eine Sonderallokation …"
          />
        )}
        {tab === "gasthof" && (
          <RequestForm
            title="Gästehaus Reith — eine Nacht"
            intro="Eine Nacht pro Jahr im Gästehaus (Selbstkosten Verpflegung)."
            fieldLabel="Anmerkung"
            placeholder="Anlass, Begleitung, Wünsche …"
            withDate
            disabledNote={gasthof.used ? `Ihre Nacht für ${gasthof.year} ist bereits gebucht.` : undefined}
          />
        )}
        {tab === "concierge" && <ConciergeThread seed={concierge} />}
      </div>
    </div>
  );
}
