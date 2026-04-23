---
title: "Minify"
description: "The process of stripping whitespace, comments, and other optional characters to reduce the byte size of a document."
related: ["pretty-print", "beautify", "json", "whitespace"]
lastUpdated: 2026-04-23
---

**Minify** is the process of removing every optional character from a document — whitespace, comments, unnecessary punctuation — to produce the smallest equivalent form. For JSON, minification removes all whitespace between tokens. For JavaScript, CSS, and HTML, it also shortens variable names and rewrites structures where possible.

## A before-and-after

Pretty:

```json
{
  "user": {
    "id": 42,
    "roles": ["admin", "editor"]
  },
  "active": true
}
```

Minified:

```
{"user":{"id":42,"roles":["admin","editor"]},"active":true}
```

Same data, ~30% smaller on the wire.

## Why minify

- **Bandwidth.** At scale, a 30% raw-byte reduction across millions of requests is real money.
- **Parse speed.** Less text means less tokeniser work.
- **Cache density.** Smaller documents mean more fit into any given cache.
- **One-packet payloads.** A response that fits into a single TCP segment ships in one round trip. Minifying can slip a payload under that threshold.

## The compression question

Minifying is largely redundant with HTTP compression. gzip or brotli on pretty-printed JSON gets close to the same wire size as gzipped minified JSON. The remaining savings are 3-10% after compression. Not nothing, especially at scale, but not dramatic.

The counter-argument is that minifying has other benefits — smaller browser cache entries, smaller IndexedDB blobs, smaller URL parameters — that compression does not help with.

## Where minifying matters more

- Inside URLs (data URIs, query parameters) — no compression available.
- Offline storage that does not re-compress (e.g. IndexedDB, localStorage).
- High-frequency small messages where the compression overhead outweighs the savings.
- Tight memory budgets on constrained devices.

## Where minifying matters less

- Any endpoint served behind a CDN with gzip/brotli enabled.
- Payloads large enough that compression does most of the work.
- Response formats read by developers during debugging (where pretty is worth keeping).

## Tooling

- JSON: `JSON.stringify(obj)` (no indent argument = minified). `jq -c .` on the command line.
- JavaScript / TypeScript: `esbuild`, `terser`, `swc` — all ship heavy minifiers including variable-name shortening.
- CSS: `lightningcss`, `cssnano`, `esbuild`.
- HTML: `html-minifier-terser`, `rehype-minify-whitespace`.

For when and when not to minify wire payloads, see [When minifying API payloads actually matters](/guides/when-to-minify-api-payloads/).
