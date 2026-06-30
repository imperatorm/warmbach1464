import type { Member } from "@/lib/founders/types";

const PRIV_LABELS: Record<string, string> = {
  P1: "Erstzugriff auf alle Editionen",
  P2: "Estate Edition ab 2030",
  P3: "Gästehaus Reith",
  P4: "Hofarchiv — Bronzetafel",
  P5: "Concierge-Direktdraht",
  P6: "Patron-Cask-Vorrecht",
  P7: "Übertragbar im Erbfall",
};

export function ArchivePlaque({ member }: { member: Member }) {
  const seat = String(member.seatNo).padStart(4, "0");
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* The plaque */}
      <div className="copper-plate relative overflow-hidden border border-gold/40 p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/warmbach/img_0070.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.10] mix-blend-overlay"
        />
        <div aria-hidden className="copper-plate-grain pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_14%,rgba(255,236,206,0.32),transparent_55%)]" />
        <div className="relative">
          <p className="t-label text-cream/80">Hofarchiv · Bronzetafel</p>
          <p className="mt-6 holo-num font-display text-5xl tabular-nums [font-variation-settings:'opsz'_48]">
            1464.{seat}
          </p>
          <p className="mt-3 text-sm text-cream/85">{member.name}</p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <div><p className="t-label text-cream/60">Aufnahmejahr</p><p className="mt-1 text-cream">{member.joinedYear}</p></div>
            <div><p className="t-label text-cream/60">Sitz</p><p className="mt-1 text-cream tabular-nums">{member.seatNo} / 1464</p></div>
            <div><p className="t-label text-cream/60">Lesart</p><p className="mt-1 text-cream tracking-[0.2em]">MCDLXIV</p></div>
          </div>
          <p className="mt-8 text-xs leading-relaxed text-cream/70">
            Namentliche Bronzetafel im Brennraum, vom Brennmeister handgraviert (P4).
          </p>
        </div>
      </div>

      {/* Privileges + inheritance */}
      <div>
        <p className="t-label text-stone">Ihre sieben Säulen</p>
        <ul className="mt-5 flex flex-col gap-px overflow-hidden border border-hairline/15 bg-hairline/10">
          {member.privileges.map((p) => (
            <li key={p} className="flex items-baseline gap-4 bg-night px-5 py-3">
              <span className="t-label text-gold">{p}</span>
              <span className="text-sm text-cream/80">{PRIV_LABELS[p]}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 border border-hairline/15 bg-soot/20 p-6">
          <p className="t-label text-stone">Vererbung (P7)</p>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            Einmalig auf eine Person übertragbar. Die zweite Generation tritt voll privilegiert ein,
            ohne neuen Erstkauf. Anzeige binnen 12 Monaten. — Übertragung wird persönlich am Hof veranlasst.
          </p>
        </div>
      </div>
    </div>
  );
}
