# Jarvis Dev-Only Source Instrumentation

## Purpose

This is a **development-only** addition for the Warmbach Jarvis cockpit (M2 click-to-source resolution). It injects a source-location attribute onto every DOM element when the site is served via `next dev`, enabling the Jarvis agent to map a clicked element back to its exact source file, line, and column.

**Production builds are completely unaffected** — the webpack hook is gated on the `dev` flag (see `next.config.mjs`).

## Plugin Used

[`code-inspector-plugin`](https://www.npmjs.com/package/code-inspector-plugin) (devDependency only).

Configured via a `webpack` hook in `next.config.mjs`:

```js
webpack: (config, { dev }) => {
  if (dev) {
    config.plugins.push(codeInspectorPlugin({ bundler: "webpack", hideConsole: true }));
  }
  return config;
},
```

The plugin operates at the webpack level — **not** as a Babel transform — so SWC remains the compiler and `next/font` is unaffected.

## Exact Attribute Format (observed empirically)

| Fact | Value |
|------|-------|
| **Attribute name** | `data-insp-path` |
| **Path type** | **Repo-relative** (e.g. `app/boden/page.tsx`, NOT an absolute `/Users/...` path) |
| **Value format** | `<repo-relative-path>:<line>:<column>:<tagName>` |

### Real example values from `/boden` served HTML:

```
data-insp-path="app/boden/page.tsx:17:5:div"
data-insp-path="app/boden/page.tsx:18:7:PillarHero"
data-insp-path="app/layout.tsx:24:5:html"
data-insp-path="components/ui/Navigation.tsx:38:7:header"
```

The `:tagName` suffix is always present (it is the JSX tag name, not the resolved HTML element). The Jarvis resolver should treat it as optional (strip it after extracting `line` and `column`).

## Branch

All instrumentation changes live on the `jarvis/instrumentation` branch. The `main`/production branch has no trace of this plugin.

## How to Remove

1. `npm uninstall code-inspector-plugin` (removes from `devDependencies` and `node_modules`)
2. Delete the `webpack` hook from `next.config.mjs`
3. Delete the `import { codeInspectorPlugin }` line from `next.config.mjs`
4. Delete this file if desired

Or simply stay on `main` — the `jarvis/instrumentation` branch is never merged to production.
