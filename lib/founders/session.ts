// Sitz-Session — rein client-seitig (Prototyp). Spiegelt das Age-Gate-Muster.
export const SITZ_STORAGE_KEY = "1464byw.sitz.member";
export const SITZ_CHANGED_EVENT = "1464byw:sitz-changed";
// Per-session flag: the login plaque shows once per login, cleared on logout.
export const SITZ_PLAQUE_KEY = "1464byw.sitz.plaque-seen";

export function readSession(): string | null {
  try {
    return localStorage.getItem(SITZ_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeSession(id: string): void {
  try {
    localStorage.setItem(SITZ_STORAGE_KEY, id);
  } catch {
    /* private mode — session bleibt nur für diese Sitzung im State */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SITZ_CHANGED_EVENT));
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SITZ_STORAGE_KEY);
    sessionStorage.removeItem(SITZ_PLAQUE_KEY); // so a fresh login re-shows the plaque
  } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SITZ_CHANGED_EVENT));
}
