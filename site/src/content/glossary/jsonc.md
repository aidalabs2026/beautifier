---
title: "JSONC"
description: "JSON with Comments — a superset used by VS Code and the TypeScript ecosystem that allows `//` and `/* */` style comments."
related: ["json", "json-schema", "parser"]
lastUpdated: 2026-04-23
---

**JSONC** is "JSON with Comments": a dialect of JSON that allows `//` single-line and `/* */` multi-line comments and, optionally, trailing commas. It is not standardised by any RFC. Instead it is defined implicitly by the `jsonc-parser` library and the tools that use it — most notably Microsoft's VS Code settings format, TypeScript's `tsconfig.json`, and several Azure and .NET configuration files.

## Example

```jsonc
{
  // The HTTP port the server binds to.
  "port": 8080,
  "host": "localhost",
  /* The log format is one of:
     "pretty" | "json" | "combined" */
  "logFormat": "pretty",
}
```

A strict JSON parser would reject all three additions: the `// ...` comment, the `/* ... */` comment, and the trailing comma after `"pretty"`. A JSONC parser accepts them and produces the same data structure a JSON parser would produce from the comment-stripped equivalent.

## When to use JSONC

The honest answer is "when the file is going to be edited by a human who really needs to explain what the fields do, and switching to YAML or TOML is not an option." Config files that straddle the line between machine-written and hand-maintained are the natural fit.

If a file is primarily produced and consumed by machines (API responses, cache entries, database blobs), there is no reason to use JSONC — stick to strict JSON so every parser on earth can read it.

## Tooling

- VS Code reads settings as JSONC automatically.
- `tsc` reads `tsconfig.json` as JSONC.
- `jsonc-parser` on npm is the reference implementation.
- Python has `jsonc` and `jsoncomment` packages.
- Go has `tidwall/jsonc` which strips comments and lets you reuse `encoding/json`.

## Gotchas

- File extension is usually `.jsonc` or `.json`. The VS Code `json.schemas` mapping lets you associate a `$schema` with either.
- Tools that do not know about JSONC will choke on the comments. If you share a JSONC file with a strict parser, either preprocess to strip comments or accept that the non-aware tool will fail.
- A comment inside a string is just a string, not a comment. `{"note": "/* hi */"}` is unchanged.

See also [JSON5](https://json5.org/), a larger superset that adds identifiers, trailing commas, hex numbers, and more. JSON5 is less widely deployed but more permissive.
