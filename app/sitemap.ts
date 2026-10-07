import type { MetadataRoute } from "next";

const BASE = "https://warmbachhof.com";

/**
 * Public routes only: /v3, /v4 and /experience stay out as noindex studies,
 * /enter and /sitz/* are the gated member area, /api/* is machinery.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/zeit",
    "/zeit/hof",
    "/zeit/kitzbuehel",
    "/zeit/chronik",
    "/boden",
    "/baeume",
    "/manufaktur",
    "/flasche",
    "/editions",
    "/galerie",
    "/journal",
    "/club",
    "/club/mitglied-werden",
    "/club/partner",
    "/contact",
    "/legal",
  ];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
