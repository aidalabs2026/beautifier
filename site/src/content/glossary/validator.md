---
title: "Validator"
description: "A tool that checks whether a document conforms to a syntax or schema, and reports any violations."
related: ["json-schema", "parser", "beautify"]
lastUpdated: 2026-04-23
---

A **validator** is a tool that checks a document against a set of rules and reports any violations. There are two common layers:

1. **Syntactic validation** — does the document parse at all? For JSON, this means every brace is matched, every string is properly quoted, every number is well-formed, and so on. This is the minimum bar.
2. **Schema validation** — does the document match an expected shape? For JSON, this typically means validating against [JSON Schema](/glossary/json-schema/). For XML, it means validating against an [XSD](/glossary/xsd/), [DTD](/glossary/dtd/), or RELAX NG grammar.

A syntactic validator will reject `{"a": 1,}` because of the trailing comma. A schema validator will reject `{"name": 42}` if the schema says `name` must be a string — syntactically the document is fine, but semantically it is wrong.

## Example workflow

```javascript
import Ajv from "ajv";
const ajv = new Ajv();
const schema = { type: "object", required: ["id"], properties: { id: { type: "integer" } } };
const validate = ajv.compile(schema);

const candidate = { id: "forty-two" };
if (!validate(candidate)) {
  console.error(validate.errors);
  // [{ instancePath: "/id", schemaPath: "#/properties/id/type",
  //    keyword: "type", params: { type: "integer" }, message: "must be integer" }]
}
```

The output tells you exactly which field failed, why, and where in the schema the rule lives.

## Where validators fit in the pipeline

- **Input boundaries** — incoming HTTP requests, webhook payloads, messages from a queue. Validating at the boundary catches bad data before it reaches business logic.
- **Output boundaries** — outgoing responses. Many teams validate outgoing data in development only, to catch bugs in serialisation code.
- **Build time** — validating config files, manifests, and other declarative inputs as part of CI.
- **Editor time** — `$schema`-aware editors validate in real time as you type.

## The difference between "parses" and "valid"

A common confusion: "my JSON parses in JavaScript, so it is valid". Not quite. A parser turns bytes into an in-memory value; a validator checks the value against rules. `JSON.parse("{}")` succeeds, but your API may still reject `{}` because it required certain fields. Always run both.

## Tools

- **Syntax validators**: the [JSON tool here](/json/) pressing the "Validate" button, `jsonlint`, `jq -e .`.
- **Schema validators**: Ajv (JavaScript), `jsonschema` (Python), `json-schema-rs` (Rust), `santhosh-tekuri/jsonschema` (Go).
- **Online schema validators**: jsonschemavalidator.net, but prefer local libraries once you are in production.
