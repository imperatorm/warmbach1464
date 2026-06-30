"use client";

import Link from "next/link";
import { foundersData } from "@/lib/founders/data";
import { currentPhase } from "@/lib/founders/release";
import { useCurrentMember } from "@/lib/founders/MemberContext";
import { Reveal } from "@/components/ui/Reveal";
import { ReleaseDays } from "@/components/sitz/ReleaseDays";

export default function SitzOverviewPage() {
  const member = useCurrentMember();
  const { pipeline, availability, gasthof } = foundersData;
  const phase = currentPhase(pipeline.phases);
  const reserved = availability.find((a) => a.reservedForYou > 0);

  const cards = [
    {
      label: "Aktuelle Phase",
      value: phase?.label ?? "—",
      note: phase?.dateLabel ?? "",
      href: "/sitz/weg",
    },
    {
      label: "Bis Release",
      value: <ReleaseDays targetISO={pipeline.targetReleaseISO} />,
      note: pipeline.targetReleaseLabel,
      href: "/sitz/weg",
    },
    {
      label: "Für Ihren Sitz reserviert",
      value: reserved ? `${reserved.reservedForYou} × ${reserved.edition}` : "—",
      note: reserved?.status ?? "",
      href: "/sitz/verfuegbarkeit",
    },
    {
      label: "Gästehaus Reith",
      value: gasthof.used ? "dieses Jahr genutzt" : "Nacht verfügbar",
      note: `Saison ${gasthof.year}`,
      href: "/sitz/anfragen",
    },
  ];

  return (
    <div>
      <Reveal>
        <p className="t-label">Sitz N°{String(member.seatNo).padStart(4, "0")} · seit {member.joinedYear}</p>
        <h1 className="t-display text-cream mt-4">Willkommen zurück, {member.name.split(" ")[0]}.</h1>
        <p className="t-lead mt-6 max-w-xl">
          Ihr Platz im Kreis der 1464. Hier sehen Sie, wo der Brand steht — und was gerade ansteht.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.06}>
            <Link href={c.href} data-cursor className="block bg-night p-8 transition-colors hover:bg-soot/40">
              <p className="t-label text-stone">{c.label}</p>
              <p className="mt-4 font-display text-2xl text-cream">{c.value}</p>
              {c.note && <p className="mt-2 text-sm text-cream/60">{c.note}</p>}
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
