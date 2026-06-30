import { codeInspectorPlugin } from "code-inspector-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ["@react-three/drei", "framer-motion"] },
  images: { formats: ["image/avif", "image/webp"] },
  // Hosted Jarvis cockpit serves this site under a basePath (e.g. /preview) so it can be
  // proxied same-origin behind the cockpit's login. Unset locally => no basePath (unchanged).
  ...(process.env.JARVIS_BASE_PATH ? { basePath: process.env.JARVIS_BASE_PATH } : {}),
  // Click-to-source instrumentation: always in dev; in a BUILD only when JARVIS_INSTRUMENT=1
  // (the hosted-cockpit image). The real Vercel production build leaves it off => unchanged.
  webpack: (config, { dev }) => {
    if (dev || process.env.JARVIS_INSTRUMENT === "1") {
      // dev:true forces the inject-loader to stamp data-insp-path even in a production
      // build (the JARVIS_INSTRUMENT image runs `next start` with NODE_ENV=production).
      config.plugins.push(codeInspectorPlugin({ bundler: "webpack", hideConsole: true, dev: true }));
    }
    return config;
  },
  async redirects() {
    // Säulen-V2: alte Seitenlogik → neue Säulen-Struktur (301, sichert Bestands-URLs).
    return [
      { source: "/heritage", destination: "/manufaktur", permanent: true },
      { source: "/bottle", destination: "/flasche", permanent: true },
      { source: "/chronik", destination: "/zeit/chronik", permanent: true },
      { source: "/founders-circle", destination: "/club", permanent: true },
      { source: "/founders-circle/mitglied-werden", destination: "/club/mitglied-werden", permanent: true },
    ];
  },
};
export default nextConfig;
