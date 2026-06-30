// Chronik-Zeitrechnung für die Hologramm-Zähler.
// daysSince1464: Tage seit der Ersterwähnung im Salbuch (proleptisch-gregorianisch,
// poetisch — nicht kalendarisch-exakt über die Kalenderreform hinweg).

export function daysSince1464(now: Date = new Date()): number {
  const start = Date.UTC(1464, 0, 1);
  return Math.max(0, Math.floor((now.getTime() - start) / 86_400_000));
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

/** Verbleibende Zeit bis zum nächsten Jahreswechsel (1. Januar, lokale Zeit). */
export function timeToNextYear(now: Date = new Date()): Countdown {
  const target = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0).getTime();
  const total = Math.max(0, target - now.getTime());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
    total,
  };
}

/** Locale-aware integer formatting (1.234.567). */
export function formatInt(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n);
}

export const pad2 = (n: number): string => String(n).padStart(2, "0");
