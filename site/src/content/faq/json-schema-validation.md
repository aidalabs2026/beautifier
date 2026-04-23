---
question: "Can I validate against a JSON Schema?"
category: "formats"
order: 4
---

Not in the current browser version. Right now the Validate button only checks JSON **syntax** — that every brace and quote is in the right place. It does not check that your document matches a schema.

JSON Schema validation is on the roadmap. When it lands, you will be able to paste a schema into a second panel and see field-level errors.

Until then, use the Ajv library in JavaScript (`npm install ajv`), the `jsonschema` package in Python, or an online schema validator like `jsonschemavalidator.net`. For a primer on what JSON Schema actually does, see the guide [JSON Schema Basics](/guides/json-schema-basics/).
