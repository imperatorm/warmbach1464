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
      // components/three is excluded: react-three-fiber parses data-insp-path as a
      // nested prop path (data.insp.path) and crashes every <Canvas> scene.
      config.plugins.push(
        codeInspectorPlugin({
          bundler: "webpack",
          hideConsole: true,
          dev: true,
          exclude: [/components[\\/]three/],
        }),
      );
    }
    return config;
  },
  async rewrites() {
    // public/archive/<name> holds static exports of earlier versions of the whole
    // site (built by scripts/archive-snapshot.sh). Every page there is a .html file, and
    // Next serves public files only at their exact path, so a clean URL is mapped
    // onto its file once nothing else has matched — chunks and payloads that do
    // exist are served before these run.
    return {
      afterFiles: [
        { source: "/archive/:snap", destination: "/archive/:snap/index.html" },
        { source: "/archive/:snap/:path*", destination: "/archive/:snap/:path*.html" },
      ],
    };
  },
  async headers() {
    // The snapshots carry their own era's metadata, which never said noindex.
    return [{ source: "/archive/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
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
