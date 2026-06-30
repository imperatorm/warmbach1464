// REPRÄSENTATIVER PROTOTYP-SEED — die einzige Austausch-Stelle ("Backend-Naht").
// Später ersetzt ein echtes Backend diese Datei; das UI bleibt unverändert.
// Datumsanker stammen aus lib/content.ts → heritageChronicle. Nichts erfunden:
// die Reifedauer-ZAHL ist bewusst NICHT enthalten (noch von der Familie festzulegen).
import type { FoundersData } from "./types";

export const foundersData: FoundersData = {
  // Codes sind Prototyp-Platzhalter (das Jahr) — pro Mitglied frei anpassbar.
  members: [
    {
      id: "1464.0001",
      name: "Hans Wehrmann",
      seatNo: 1,
      joinedYear: 2026,
      accessCode: "1464",
      privileges: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
    },
    {
      id: "1464.0002",
      name: "Vanessa Wehrmann",
      seatNo: 2,
      joinedYear: 2026,
      accessCode: "1464",
      privileges: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
    },
    {
      id: "1464.0003",
      name: "Mia Wehrmann",
      seatNo: 3,
      joinedYear: 2026,
      accessCode: "1464",
      privileges: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
    },
    {
      id: "1464.0007",
      name: "M. Berger", // neutraler Demo-Sitz (öffentlicher Demo-Zugang)
      seatNo: 7,
      joinedYear: 2026,
      accessCode: "1464",
      privileges: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
    },
  ],
  pipeline: {
    phases: [
      { key: "ernte", label: "Ernte & Auslese", dateLabel: "Herbst 2025", status: "done" },
      { key: "maische", label: "Maische & Gärung", dateLabel: "Winter 2025/26", status: "done" },
      { key: "brand", label: "Brand · Brennblase Kothe", dateLabel: "Mai 2026", status: "done" },
      { key: "reifung", label: "Reifung im Glasballon", dateLabel: "seit Mai 2026", status: "current" },
      { key: "abfuellung", label: "Abfüllung & Versiegelung", dateLabel: "geplant 2027", status: "upcoming" },
      { key: "allokation", label: "Allokation an den Sitz", dateLabel: "Q4 2027", status: "upcoming" },
    ],
    fillStartISO: "2026-05-01",
    targetReleaseISO: "2027-10-01",
    targetReleaseLabel: "Q4 2027 (geplant)",
  },
  availability: [
    {
      edition: "Founder's Reserve N°1",
      total: 1464,
      reservedForYou: 1,
      status: "reserviert",
      note: "Eins zu eins mit den 1464 Sitzen. Deine Flasche ist deinem Sitz zugeordnet.",
      firstAccessWindowDays: 14,
    },
    {
      edition: "Apfel Brand",
      total: null,
      reservedForYou: 0,
      status: "freigegeben",
      note: "Nummeriert, mit Echtheitszertifikat. Anfrage über Gastronomie oder 1464byW.com.",
      firstAccessWindowDays: 14,
    },
    {
      edition: "Kommende Edition",
      total: null,
      reservedForYou: 0,
      status: "freigegeben",
      note: "Vorzugsfenster: 14 Tage vor öffentlichem Verkauf (P1).",
      firstAccessWindowDays: 14,
    },
  ],
  events: [
    { title: "Hof-Tasting", dateLabel: "Herbst 2026", time: "15:04", location: "Warmbachhof, Reith", kind: "Tasting", capacityNote: "Plätze limitiert", rsvp: "offen" },
    { title: "Erntetag im Apfelgarten", dateLabel: "Oktober 2026", time: "10:00", location: "Osthang, Warmbachhof", kind: "Ernte", capacityNote: "Mitglied & Begleitung", rsvp: "offen" },
    { title: "Abfüll-Zeremonie N°1", dateLabel: "Q4 2027 (geplant)", time: "15:04", location: "Brennraum", kind: "Zeremonie", capacityNote: "Founder's-Reserve-Inhaber", rsvp: "offen" },
    { title: "Sitzkreis-Versammlung", dateLabel: "Frühjahr 2027", time: "15:04", location: "Warmbach Lounge", kind: "Versammlung", capacityNote: "Alle 1464 Sitze geladen", rsvp: "angefragt" },
  ],
  requests: [
    { kind: "flasche", subject: "Patron-Cask — Vorrechtsangebot", status: "angefragt" },
  ],
  concierge: [
    { from: "concierge", text: "Willkommen am Hof. Ihr Concierge-Draht ist offen — wir antworten binnen 48 Stunden, persönlich.", dateLabel: "Mai 2026" },
    { from: "member", text: "Danke. Ich melde mich zur Founder's Reserve.", dateLabel: "Mai 2026" },
  ],
  gasthof: { year: 2026, used: false },
};
