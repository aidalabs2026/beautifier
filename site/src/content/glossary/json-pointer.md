---
title: "JSON Pointer"
description: "A standard syntax for addressing a specific value inside a JSON document, defined in RFC 6901."
related: ["json", "json-schema", "json-patch"]
lastUpdated: 2026-04-23
---

**JSON Pointer** is a compact string syntax for referring to a specific location inside a JSON document, defined by [RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901). It plays the role that XPath plays for XML, though it is much simpler — intentionally so.

## Syntax

A JSON Pointer is a series of `/`-separated tokens, each of which is either a member name (for objects) or a zero-based index (for arrays).

Given:

```json
{
  "users": [
    { "name": "Ada" },
    { "name": "Linus" }
  ]
}
```

- `""` (empty string) — the whole document
- `"/users"` — the array
- `"/users/0"` — the first user object
- `"/users/1/name"` — `"Linus"`

Two characters have special meaning inside a token: `~` is escaped as `~0` and `/` as `~1`. A key literally called `foo/bar` is addressed as `/foo~1bar`.

## Where you see it

- Inside [JSON Schema](/glossary/json-schema/) — `$ref: "#/$defs/User"` is a JSON Pointer (with a URI fragment identifier).
- Inside [JSON Patch](/glossary/json-patch/) — each patch operation targets a pointer.
- In error messages from validators, to indicate where the error occurred (`"/users/0/email"`).
- In OpenAPI specs — `$ref` pointers link one part of the spec to another.

## Limitations

JSON Pointer identifies a specific location; it cannot pick multiple values, filter, or traverse a document with predicates. For that, JSONPath or JMESPath are the usual tools. JSON Pointer is what you use when you already know exactly where the target is.

## Example use in code

```javascript
// Minimal JSON Pointer implementation
function resolve(doc, pointer) {
  if (pointer === '') return doc;
  return pointer.slice(1).split('/').reduce((obj, part) => {
    part = part.replace(/~1/g, '/').replace(/~0/g, '~');
    return obj?.[Array.isArray(obj) ? Number(part) : part];
  }, doc);
}
```

Libraries: `json-pointer` (npm), `jsonpointer` (Python, bundled with `jsonschema`), many language-specific wrappers.
