"use client";

import { useEffect, useState } from "react";
import { SITZ_CHANGED_EVENT, readSession } from "./session";
import { foundersData } from "./data";
import type { Member } from "./types";

/**
 * Resolves the logged-in member from the localStorage session, live-updating
 * when session changes (mirrors useAgeConfirmed). Matches the seeded member
 * list by id. Returns { ready } so callers can avoid a gate flash.
 */
export function useMember(): { member: Member | null; ready: boolean } {
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      setId(readSession());
      setReady(true);
    };
    read();
    window.addEventListener(SITZ_CHANGED_EVENT, read);
    return () => window.removeEventListener(SITZ_CHANGED_EVENT, read);
  }, []);

  const member = foundersData.members.find((m) => m.id === id) ?? null;
  return { member, ready };
}
