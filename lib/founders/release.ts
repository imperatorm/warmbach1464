// Release-Pipeline — rein & testbar. Zeit bis Release ist UTC-stabil (vgl. lib/age.ts).
import type { Phase } from "./types";

export type ReleaseParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // verbleibende Millisekunden
};

/**
 * Verbleibende Zeit bis zur UTC-Mitternacht des Zieldatums (YYYY-MM-DD), abgerundet.
 * Eine einzige Quelle für Tage/Std/Min/Sek — so zeigen Übersicht, Zeitleiste und
 * die Countdown-Leiste exakt denselben Wert.
 */
export function releaseCountdown(targetISO: string, now: Date = new Date()): ReleaseParts {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(targetISO.trim());
  const total = m
    ? Math.max(0, Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) - now.getTime())
    : 0;
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
    total,
  };
}

/** Full days remaining until an ISO date, floored at 0. */
export function daysUntil(targetISO: string, now: Date = new Date()): number {
  return releaseCountdown(targetISO, now).days;
}

/** The phase marked "current"; otherwise the last phase; undefined if empty. */
export function currentPhase(phases: Phase[]): Phase | undefined {
  return phases.find((p) => p.status === "current") ?? phases[phases.length - 1];
}

/** Fraction 0..1: each done phase counts 1, a current phase counts 0.5. */
export function phaseProgress(phases: Phase[]): number {
  if (phases.length === 0) return 0;
  const done = phases.filter((p) => p.status === "done").length;
  const cur = phases.some((p) => p.status === "current") ? 0.5 : 0;
  return Math.min(1, (done + cur) / phases.length);
}
