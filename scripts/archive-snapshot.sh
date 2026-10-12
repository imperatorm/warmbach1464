#!/usr/bin/env bash
# Build an earlier commit of the whole site as a static snapshot and place it at
# public/archive/<name>, where the live site serves it under /archive/<name>.
#
#   scripts/archive-snapshot.sh <name> <commit> [node_modules-dir]
#
# Why snapshots and not routes: each earlier homepage came with its own nav,
# fonts, palette and globals.css, and the components it was built from have
# since been rewritten in place. A static export of the commit itself is the
# only copy that looks the way it did.
#
# What the script does
#   1. Extracts <commit> into a temp folder (git archive — no worktree).
#   2. Drops what a static export cannot carry: middleware (the password gate),
#      app/enter, app/api, robots and sitemap. The live site's own gate still
#      covers /archive, because its middleware runs on every path.
#   3. Builds with output: "export" and basePath /archive/<name>. Page links get
#      the prefix; images, fonts and video keep root paths and load from the live
#      public/ folder — every asset the snapshots use is still there unchanged.
#   4. Copies the build into public/archive/<name>, minus the copy of public/
#      that the export brings along.
#
# Dependencies: pass a node_modules folder to reuse (it must sit on the same
# drive as $TMPDIR on Windows — webpack cannot resolve through a cross-drive
# junction). Without one, the commit's own package.json is installed. Commits
# before 2e4463b also need gsap, tone and troika-three-text.
#
# Routing lives in next.config.mjs (rewrites to the .html files, X-Robots-Tag),
# robots.ts disallows /archive/, and /design lists every snapshot.
set -euo pipefail

name=${1:?name}; commit=${2:?commit}; deps=${3:-}
repo="$(git rev-parse --show-toplevel)"
work="$(mktemp -d)/$name"
mkdir -p "$work"

git -C "$repo" archive "$commit" | tar -x -C "$work"
rm -rf "$work/middleware.ts" "$work/app/api" "$work/app/enter" "$work/app/robots.ts" "$work/app/sitemap.ts"

cat > "$work/next.config.mjs" <<CFG
/** Static snapshot of $commit, served by the live site under /archive/$name. */
export default {
  reactStrictMode: true,
  output: "export",
  basePath: "/archive/$name",
  images: { unoptimized: true },
  experimental: { optimizePackageImports: ["@react-three/drei", "framer-motion"] },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
CFG

if [ -n "$deps" ]; then
  if command -v cygpath >/dev/null; then
    cmd //c mklink //J "$(cygpath -w "$work/node_modules")" "$(cygpath -w "$deps")" >/dev/null
  else
    ln -s "$deps" "$work/node_modules"
  fi
else
  (cd "$work" && npm install --no-audit --no-fund --loglevel=error)
fi

(cd "$work" && NEXT_TELEMETRY_DISABLED=1 npx next build)

out="$work/out"
(cd "$work/public" && find . -type f) | while IFS= read -r f; do rm -f "$out/$f"; done
find "$out" -type d -empty -delete

dest="$repo/public/archive/$name"
rm -rf "$dest"; mkdir -p "$dest"; cp -r "$out/." "$dest/"
echo "public/archive/$name: $(du -sh "$dest" | cut -f1), $(find "$dest" -type f | wc -l) files"
