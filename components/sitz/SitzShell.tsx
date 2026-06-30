"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearSession } from "@/lib/founders/session";
import { foundersData } from "@/lib/founders/data";
import { LoginPlaque } from "@/components/sitz/LoginPlaque";
import { ReleaseCountdownBar } from "@/components/sitz/ReleaseCountdownBar";
import { Monogram } from "@/components/ui/Monogram";
import type { Member } from "@/lib/founders/types";

const SECTIONS = [
  { href: "/sitz", label: "Der Sitz" },
  { href: "/sitz/weg", label: "Der Weg zum Release" },
  { href: "/sitz/verfuegbarkeit", label: "Verfügbarkeit" },
  { href: "/sitz/anfragen", label: "Anfragen" },
  { href: "/sitz/events", label: "Events" },
  { href: "/sitz/archiv", label: "Hofarchiv" },
];

export function SitzShell({ member, children }: { member: Member; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/sitz" ? pathname === "/sitz" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-night lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-hairline/10 lg:border-b-0 lg:border-r lg:min-h-screen px-6 py-8 lg:px-8 lg:py-12">
        <Link href="/" data-cursor className="flex items-center gap-1.5">
          <span className="font-display text-2xl text-cream [font-variation-settings:'opsz'_48]">1464</span>
          <span className="text-[0.6rem] uppercase tracking-[0.22em] text-gold [margin-inline-end:-0.22em]">by</span>
          <Monogram className="h-5 w-auto" />
        </Link>
        <p className="t-label mt-2 text-stone">Sitz N°{String(member.seatNo).padStart(4, "0")}</p>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-y-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              data-cursor
              className={`link-underline text-xs uppercase tracking-[0.16em] transition-colors ${
                isActive(s.href) ? "text-gold" : "text-cream/70 hover:text-cream"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={clearSession}
          data-cursor
          className="mt-10 text-xs uppercase tracking-[0.16em] text-stone hover:text-gold"
        >
          Sitz verlassen
        </button>
      </aside>

      <div className="min-w-0 px-6 pt-12 pb-28 lg:px-14 lg:pt-16">{children}</div>

      <ReleaseCountdownBar
        targetISO={foundersData.pipeline.targetReleaseISO}
        label={foundersData.pipeline.targetReleaseLabel}
      />
      <LoginPlaque member={member} />
    </div>
  );
}
