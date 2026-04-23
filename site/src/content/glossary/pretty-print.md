---
title: "Pretty-Print"
description: "The process of formatting data — typically JSON, XML, or HTML — with line breaks and indentation for human reading."
related: ["minify", "beautify", "json", "indentation"]
lastUpdated: 2026-04-23
---

**Pretty-print** is the act of re-formatting a serialised document so a human can read it comfortably. For JSON, pretty-printing inserts newlines after commas and braces, indents nested structures with a consistent number of spaces or tabs, and puts each key-value pair on its own line.

## A before-and-after

Before (compact):

```
{"user":{"id":42,"roles":["admin","editor"]},"active":true}
```

After (pretty-printed, 2-space indent):

```json
{
  "user": {
    "id": 42,
    "roles": ["admin", "editor"]
  },
  "active": true
}
```

The data is the same; any parser produces the same in-memory structure from either form. Pretty-printing is a surface change only.

## Why it exists

Serialised data is optimised for machines: compact, unambiguous, easy to transmit. Humans who need to read the data in a debugger, a log viewer, or an incident postmortem want visual structure. Pretty-printing adds that structure without touching the meaning.

## Cost and benefit

Pretty-printing makes documents roughly 25-35% bigger in raw bytes. After HTTP compression (gzip, brotli), the penalty shrinks to under 10% for most payloads. For transmission-heavy workloads the compact form wins slightly; for debugging and development, pretty form wins overwhelmingly.

The usual compromise: **pretty on disk, minified on the wire, pretty again when displayed.** Conversion in either direction is cheap.

## Pretty-print in different contexts

- **JSON**: indent each level; put each object member on its own line; arrays may fit on one line if short.
- **XML**: insert a newline before each child element; indent nested elements; preserve whitespace inside `<pre>`-like elements.
- **HTML**: similar to XML but tolerates inline elements (`<em>`, `<strong>`) staying on the same line as their parent's text.
- **CSS**: one rule per line; one declaration per line; aligned property: value.
- **SQL**: one clause per line; keywords aligned; parameters indented.

## Tooling

- JavaScript: `JSON.stringify(obj, null, 2)` for JSON. `prettier` handles JavaScript, JSON, CSS, HTML, and more.
- Python: `json.dumps(obj, indent=2)`.
- Go: `json.MarshalIndent`.
- Command line: `jq .` is the canonical JSON pretty-printer.
- Online: the [JSON tool on this site](/json/) does it in your browser, with indent options and sort-keys.

For a deeper discussion of when to pretty vs. minify, see the guide [Pretty-print vs. minify](/guides/pretty-print-vs-minify/).
