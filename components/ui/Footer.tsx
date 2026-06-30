"use client";

import { usePathname } from "next/navigation";
import { brand } from "@/lib/content";
import { Monogram } from "./Monogram";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/enter" || pathname.startsWith("/sitz")) return null; // gate + portal have own chrome
  return (
    <footer className="border-t border-hairline/10 mt-12 px-6 lg:px-10 py-14 bg-soot/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <Monogram className="w-10 h-10 text-cream" />
          <p className="signage text-stone">{brand.estate}</p>
          <p className="text-stone text-sm">{brand.claim}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="signage text-stone mb-2">Die Säulen</p>
          <Link href="/zeit" className="hover:text-gold">Zeit</Link>
          <Link href="/boden" className="hover:text-gold">Boden</Link>
          <Link href="/baeume" className="hover:text-gold">Bäume</Link>
          <Link href="/galerie" className="hover:text-gold">Galerie</Link>
          <Link href="/journal" className="hover:text-gold">Journal</Link>
          <Link href="/contact" className="hover:text-gold">Besuch</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="signage text-stone mb-2">Die Marke</p>
          <Link href="/manufaktur" className="hover:text-gold">Manufaktur</Link>
          <Link href="/flasche" className="hover:text-gold">Die Flasche</Link>
          <Link href="/editions" className="hover:text-gold">Editionen</Link>
          <Link href="/club" className="hover:text-gold">Club 1464</Link>
          <Link href="/club/partner" className="hover:text-gold">1464 Partner</Link>
          <Link href="/sitz" className="hover:text-gold">Mitglieder · Eintreten</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="signage text-stone mb-2">Newsletter</p>
          <p className="text-stone/80 text-sm">Hinweise an drei Tagen im Jahr — Brennstart, Abfüllung, Edition.</p>
          <form className="flex gap-2 mt-3" action="#" method="post">
            <input type="email" placeholder="E-Mail" className="bg-night border border-hairline/30 px-3 py-2 text-sm flex-1 focus:outline-none focus:border-gold" />
            <button className="border border-gold/70 px-4 py-2 text-sm signage hover:bg-gold hover:text-night transition-all">
              Eintragen
            </button>
          </form>
        </div>
      </div>
      <div className="hairline mt-12" />
      <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row justify-between text-xs text-stone gap-3">
        <p>© {new Date().getFullYear()} {brand.house}. Alle Rechte vorbehalten.</p>
        <div className="flex gap-5">
          <Link href="/legal" className="hover:text-gold">Impressum</Link>
          <Link href="/legal#privacy" className="hover:text-gold">Datenschutz</Link>
          <Link href="/legal#age" className="hover:text-gold">Altersbestätigung</Link>
        </div>
      </div>
    </footer>
  );
}
