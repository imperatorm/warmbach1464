"use client";

import { useEffect, useState } from "react";

export const AGE_STORAGE_KEY = "1464byw.age.confirmed";
export const AGE_CONFIRMED_EVENT = "1464byw:age-confirmed";

/**
 * Tracks whether the visitor has cleared the Age Gate (localStorage), updating
 * live when AgeGate dispatches AGE_CONFIRMED_EVENT. Used to defer mounting the
 * heavy R3F hero until after the gate — there is no reason to initialise WebGL
 * behind the modal, and doing so otherwise blocks the main thread for seconds
 * (Lighthouse TBT) on first paint.
 */
export function useAgeConfirmed(): boolean {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(AGE_STORAGE_KEY)) setConfirmed(true);
    } catch {
      /* private mode / blocked — leave false, the gate handles it */
    }
    const onConfirm = () => setConfirmed(true);
    window.addEventListener(AGE_CONFIRMED_EVENT, onConfirm);
    return () => window.removeEventListener(AGE_CONFIRMED_EVENT, onConfirm);
  }, []);

  return confirmed;
}
