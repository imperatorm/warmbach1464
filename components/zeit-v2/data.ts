import { chronicle, chroniclePhoto } from "@/lib/timeline";
import { eventById, kitzbuehel, parallelen, type ChronikEvent } from "@/lib/chronik";
import type { TimelineItem } from "./HorizontalTimeline";

/**
 * Zeit v2 — the deck's content, all of it drawn from the sourced files
 * (lib/timeline, lib/chronik, lib/content). Nothing here is new copy that
 * could not be traced back to the Salbuch chronicle or the city's public
 * record; this file only arranges it for the chapter structure.
 */

export type Chapter = {
  id: "hof" | "chronik" | "stadt" | "heute";
  no: string;
  nav: string;
  /** Title-layer headline, two lines. */
  title: [string, string];
  lead: string;
  /** The teaser image for "Nächster Abschnitt". */
  image: string;
};

export const chapters: Chapter[] = [
  {
    id: "hof",
    no: "01",
    nav: "Der Hof",
    title: ["Warmbachhof", "seit 1464"],
    lead:
      "Im Kitzbüheler Salbuch seit 1464 verzeichnet. Über Jahrhunderte ein selbstversorgender Alpenhof — durch sechsundzwanzig Eigentümerwechsel, und doch nie außer Betrieb.",
    image: "/gallery/warmbach/img_0027.jpg",
  },
  {
    id: "chronik",
    no: "02",
    nav: "Die Chronik",
    title: ["Zweiundzwanzig", "Einträge"],
    lead:
      "562 Jahre, urkundlich verbürgt — jeder Eintrag steht so im Salbuch. Von Jörg Frey bis zum ersten eigenen Brand.",
    image: "/gallery/warmbach/img_0041.jpg",
  },
  {
    id: "stadt",
    no: "03",
    nav: "Die Stadt",
    title: ["Kitzbühel", "und der Hof"],
    lead:
      "Um 1165 erstmals als Chizbuhel genannt, 1271 Stadtrecht. Zwölf Stationen der Stadt — und fünf Stellen, an denen sich Stadt und Hof berühren.",
    image: "/gallery/warmbach/img_0059.jpg",
  },
  {
    id: "heute",
    no: "04",
    nav: "Heute",
    title: ["Die Zeit", "lebt weiter"],
    lead: "Ununterbrochen bewirtschaftet — vom Salbuch bis zu diesem Augenblick.",
    image: "/flasche/shot-front.jpg",
  },
];

/** The intro card — the pillar's thesis, before any chapter is chosen. */
export const intro = {
  title: ["Die Zeit ist", "unsere älteste Zutat."] as [string, string],
  lead: "Wir haben nichts erfunden. Wir haben es nur wiedergefunden.",
};

/**
 * Longines runs its logo through the decades; the Hof has no logo to run,
 * it has names. Every family that held the place, in the order the Salbuch
 * records them — the entry title exactly as the chronicle carries it.
 */
const NAME_YEARS = new Set(["1464", "1556", "1605", "1749", "1812", "1892", "1894", "1944", "2000", "2018"]);
export const hofNames = chronicle
  .filter((c) => NAME_YEARS.has(c.year))
  .map((c) => ({ year: c.year, name: c.title }));

export const hofPhotos = [
  { src: "/gallery/warmbach/img_0059.jpg", caption: "Winterdämmerung" },
  { src: "/gallery/warmbach/img_0041.jpg", caption: "Geschnitzte Balkone" },
  { src: "/gallery/warmbach/img_0027.jpg", caption: "Vor dem Wilden Kaiser" },
];

export const chronikItems: TimelineItem[] = chronicle.map((c, i) => ({
  id: `c-${i}`,
  year: c.year,
  title: c.title,
  text: c.detail,
  image: chroniclePhoto(i),
}));

export const stadtItems: TimelineItem[] = [...kitzbuehel]
  .sort((a, b) => a.year - b.year)
  .map((e) => ({
    id: e.id,
    year: e.yearLabel,
    title: e.title,
    text: e.body,
    source: e.source,
    kupfer: e.theme === "kupfer",
  }));

export type Resonanz = {
  id: string;
  label: string;
  note: string;
  kupfer: boolean;
  kitz: ChronikEvent;
  hof: ChronikEvent;
};

export const resonanzen: Resonanz[] = parallelen.map((p) => ({
  id: p.id,
  label: p.label,
  note: p.note,
  kupfer: p.theme === "kupfer",
  kitz: eventById.get(p.kitzbuehel)!,
  hof: eventById.get(p.warmbach)!,
}));
