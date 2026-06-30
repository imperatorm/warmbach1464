import { NextRequest, NextResponse } from "next/server";

/**
 * Zugangsschutz mit gebrandeter Login-Seite (statt Browser-Dialog).
 * Ohne gültiges Zugangs-Cookie wird auf /enter umgeleitet; dort wird das Passwort
 * eingegeben (siehe app/enter). Passwort: ENV SITE_PASSWORD, Fallback „Warmbach".
 */
const COOKIE = "wbz_access";
const TOKEN = process.env.SITE_ACCESS_TOKEN ?? "granted-1464byw";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Local development convenience: never gate during `next dev`. On Vercel
  // NODE_ENV is "production", so the live site stays password-protected.
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const isOpen =
    pathname.startsWith("/enter") ||
    pathname.startsWith("/api/enter") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/logo-w.png";

  if (isOpen) return NextResponse.next();
  if (req.cookies.get(COOKIE)?.value === TOKEN) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/enter";
  url.search = "";
  if (pathname !== "/") url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
