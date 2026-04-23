---
title: "JSON Patch"
description: "A format for describing changes to a JSON document as a list of operations, defined in RFC 6902."
related: ["json", "json-pointer", "json-schema"]
lastUpdated: 2026-04-23
---

**JSON Patch** is a standardised format for expressing changes to a JSON document as an ordered list of operations. Instead of sending "the new state", a client sends "here are the six specific edits I want". The format is defined in [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902).

## The six operations

```json
[
  { "op": "add",     "path": "/users/-",     "value": { "name": "Ada" } },
  { "op": "remove",  "path": "/draft" },
  { "op": "replace", "path": "/users/0/name", "value": "Ada L." },
  { "op": "move",    "from": "/old", "path": "/new" },
  { "op": "copy",    "from": "/config", "path": "/backup" },
  { "op": "test",    "path": "/version", "value": 3 }
]
```

- `add` inserts a new value, or replaces an existing one for scalars.
- `remove` deletes the value at the path.
- `replace` sets a new value at an existing path.
- `move` takes a value from one path and places it at another.
- `copy` duplicates a value.
- `test` is a no-op unless the value at the path matches — used to make patches fail rather than apply to unexpected state.

Paths use [JSON Pointer](/glossary/json-pointer/) syntax. The `-` in `"/users/-"` is a special token that means "append to the end of this array".

## When to use it

- Partial updates in REST APIs. Instead of `PUT` with the whole resource, clients `PATCH` with a JSON Patch body. This keeps large resources efficient to update and makes "change history" easy to store.
- Collaborative editing. Each user's edits can be expressed as patches and merged on the server.
- Database migrations for document stores. A schema migration can be expressed as a single patch applied to every document.

## Atomicity

RFC 6902 requires that a patch either applies entirely or not at all. A failing `test` aborts the whole patch. This is weaker than a database transaction (no isolation from concurrent patches unless the server adds one) but removes the "half-applied" failure mode.

## Trade-offs

JSON Patch is more compact than sending the full document, but it is harder to debug — a patch is meaningful only in the context of the document it applies to. Some teams prefer JSON Merge Patch (RFC 7396), which is simpler but cannot express array edits cleanly.
