---
title: "JSON Schema"
description: "A JSON-based vocabulary for describing, documenting, and validating the shape of JSON documents."
related: ["json", "json-pointer", "validator", "json-ld"]
lastUpdated: 2026-04-23
---

**JSON Schema** is a declarative language — written in JSON — for describing what a valid JSON document looks like. A schema lists required keys, value types, numeric ranges, string patterns, enumerated values, and how parts of a document can compose with `allOf`, `anyOf`, `oneOf`, and `$ref`. Given a schema and a candidate document, a JSON Schema validator produces either "valid" or a list of specific violations.

## A minimal example

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 0 }
  },
  "additionalProperties": false
}
```

Given this schema, `{"name": "Ada", "email": "ada@example.com"}` is valid. `{"name": ""}` fails (missing `email`, and `name` is empty). `{"name": "Ada", "email": "ada", "role": "admin"}` fails twice (email format, and the extra `role` field).

## Drafts

The specification has evolved through several drafts. The ones in wide use:

- **Draft-04** — old but still encountered in legacy systems.
- **Draft-07** — widely deployed.
- **2019-09** and **2020-12** — the current set, including `$defs` and improved `items` / `prefixItems` semantics.

Always include `$schema` to tell validators which rules apply.

## Use cases

- Rejecting malformed API requests at the boundary, before they reach business logic.
- Generating API documentation automatically (OpenAPI embeds JSON Schema).
- Powering form UIs (libraries like `react-jsonschema-form` render a schema directly into a form).
- Generating type definitions for TypeScript, Rust, Go, and others from a single source of truth.
- IDE autocomplete and validation for config files (VS Code reads `$schema` from a JSON file and highlights errors in real time).

For a longer tour, see [JSON Schema Basics](/guides/json-schema-basics/).
