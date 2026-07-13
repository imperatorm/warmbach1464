import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/v3", "/enter", "/sitz/", "/api/"],
    },
    sitemap: "https://warmbachhof.com/sitemap.xml",
  };
}
