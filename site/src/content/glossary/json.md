---
title: "JSON"
description: "JavaScript Object Notation — the text-based data format standardised in RFC 8259 and ECMA-404, used as the default wire format for modern web APIs."
related: ["json-schema", "jsonl", "jsonc", "json-ld", "xml"]
lastUpdated: 2026-04-23
---

**JSON** (JavaScript Object Notation) is a lightweight, text-based data interchange format. It represents structured data — nested objects, arrays, and primitive values — as UTF-8 text, making it trivial to generate, transmit, and parse in any programming language that can read a string.

The format was extracted from JavaScript's object literal syntax and formalised by Douglas Crockford in the early 2000s. It is standardised today by two independent specifications: [RFC&nbsp;8259](https://datatracker.ietf.org/doc/html/rfc8259) (the IETF version) and [ECMA-404](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/) (the ECMA version). The two agree on the grammar; small differences exist around encoding and interoperability advice.

## Syntax at a glance

```json
{
  "id": 42,
  "name": "Ada",
  "roles": ["admin", "editor"],
  "active": true,
  "notes": null
}
```

JSON supports six value types: **object**, **array**, **string**, **number**, **boolean**, and **null**. Objects are unordered collections of key-value pairs where keys must be strings. Arrays are ordered lists that can hold values of mixed types.

## Why the format took over

JSON displaced XML as the default web wire format for three reasons: it is roughly half the size for the same data, it maps naturally onto the data structures application developers already use (nested maps and lists), and every JavaScript runtime can parse it without any extra library. When REST APIs became dominant in the late 2000s, JSON was already the path of least resistance.

## What JSON is not good at

Deliberately missing: comments, multi-line strings without escapes, integer precision guarantees above 2^53, references to other parts of the document, schema information, and a date type. Each of those omissions is a trade-off; the resulting simplicity is the reason parsers are so consistent across languages.

## When you see it

- Almost every REST API response.
- Config files in the npm ecosystem (`package.json`, `tsconfig.json`).
- Structured logging (often as [JSONL](/glossary/jsonl/)).
- Storage columns in modern databases (PostgreSQL `jsonb`, MongoDB).

For the full introduction, see the guide: [What Is JSON?](/guides/what-is-json/).
