// Age-gate logic (Briefing §7, brand_memory/04_legal_frame). Pure + timezone-stable
// so it can be unit-tested deterministically. Parses the YYYY-MM-DD value from
// <input type="date"> by components (never relies on Date's UTC parsing vs. local
// getters, which can disagree by a day in some timezones).

export const LEGAL_AGE = { DE: 18, AT: 16 } as const;
export type AgeCountry = keyof typeof LEGAL_AGE;

/** Whole calendar years between an ISO birth date and `now`, or null if unparseable. */
export function ageInYears(birthISO: string, now: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthISO.trim());
  if (!match) return null;
  const by = Number(match[1]);
  const bm = Number(match[2]);
  const bd = Number(match[3]);
  if (bm < 1 || bm > 12 || bd < 1 || bd > 31) return null;

  let age = now.getFullYear() - by;
  const monthDelta = now.getMonth() + 1 - bm;
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < bd)) age -= 1;
  return age;
}

/** True if the birth date clears the legal threshold for the given country. */
export function isOfLegalAge(
  birthISO: string,
  country: AgeCountry = "DE",
  now: Date = new Date(),
): boolean {
  const age = ageInYears(birthISO, now);
  return age !== null && age >= LEGAL_AGE[country];
}
