// Mitglieds-Identität — rein & testbar (Vorbild lib/age.ts).
import type { Member } from "./types";

const MEMBER_RE = /^1464\.(\d{4})$/;

/** Seat number 1..1464 for a valid id, else null. */
export function parseSeatNo(id: string): number | null {
  const m = MEMBER_RE.exec(id.trim());
  if (!m) return null;
  const n = Number(m[1]);
  if (n < 1 || n > 1464) return null;
  return n;
}

export function isValidMemberId(id: string): boolean {
  return parseSeatNo(id) !== null;
}

/** Prototype access check against the seeded member. */
export function checkAccess(id: string, code: string, member: Member): boolean {
  return id.trim() === member.id && code.trim() === member.accessCode;
}
