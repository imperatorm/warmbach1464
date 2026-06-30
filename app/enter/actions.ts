"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PASSWORD = process.env.SITE_PASSWORD ?? "Warmbach";
const COOKIE = "wbz_access";
const TOKEN = process.env.SITE_ACCESS_TOKEN ?? "granted-1464byw";

export type EnterState = { error: string | null };

export async function enter(_prev: EnterState, formData: FormData): Promise<EnterState> {
  const pw = String(formData.get("password") ?? "").trim();
  const from = String(formData.get("from") ?? "/");

  if (pw !== PASSWORD) {
    return { error: "Falsches Passwort." };
  }

  cookies().set(COOKIE, TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  });

  // Nur interne Pfade zulassen
  redirect(from.startsWith("/") && !from.startsWith("//") ? from : "/");
}
