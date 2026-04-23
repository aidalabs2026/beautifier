---
title: "Parser"
description: "A program that reads a sequence of bytes or tokens and produces a structured representation (usually a tree or in-memory value)."
related: ["validator", "json", "xml"]
lastUpdated: 2026-04-23
---

A **parser** is the program that converts a serialised document into a structured in-memory representation. For JSON, the parser reads bytes and produces native objects and arrays. For XML, it produces a DOM tree or issues SAX events. For a programming language, it produces an abstract syntax tree.

## The job, in three stages

Almost every mature parser follows the same three-stage pipeline:

1. **Lexical analysis (lexing)** — split the input into tokens. For JSON, tokens include `{`, `}`, `[`, `]`, `:`, `,`, strings, numbers, `true`, `false`, `null`.
2. **Syntactic analysis (parsing)** — arrange the tokens into a tree according to the grammar rules. An object is `{` followed by key-value pairs separated by `,`, followed by `}`.
3. **Semantic validation** (optional, varies) — apply rules that cannot be captured by the grammar alone, like "keys must be unique" or "numbers must fit in a double".

Three stages, three common failure modes. Knowing which stage failed helps you read error messages.

## The difference between a parser and a validator

A parser produces a data structure. A [validator](/glossary/validator/) checks whether a data structure matches a schema. A parser may reject syntactically invalid input; it does not care whether `{"age": -5}` makes business sense.

## Streaming vs. in-memory parsers

Most everyday JSON parsers are **in-memory**: they read the whole document, produce a whole tree, and hand it back. This is simple and fast for documents up to a few megabytes.

For larger documents, **streaming parsers** emit events as they go — "object start", "key: x", "value: y", "object end" — without holding the whole document in memory. JavaScript libraries like `stream-json`, Python's `ijson`, and Go's `json.Decoder` are streaming parsers. They are more work to use but essential for inputs above a few hundred megabytes.

## Error recovery

Strict parsers stop at the first error. Tolerant parsers try to recover and continue, producing a list of errors rather than just the first. Most HTML parsers are tolerant (browsers have to render malformed pages anyway). Most JSON parsers are strict (there is no reasonable "keep going" behaviour for malformed JSON).

## A note on "safe" parsing

Before `JSON.parse` was standardised, JavaScript code often parsed JSON with `eval()`. This is unsafe: any JavaScript expression would execute. Modern code should always use `JSON.parse`. The same principle applies in every language — use the dedicated JSON parser, not a general-purpose code evaluator, to read untrusted data.

## Performance

Across languages and parsers:

- Reading 1&nbsp;MB of JSON: ~5-15&nbsp;ms typical.
- Reading 1&nbsp;MB of XML: ~15-40&nbsp;ms typical (more work per byte).
- Reading 1&nbsp;MB of Protocol Buffers or MessagePack: ~1-3&nbsp;ms (binary formats).

For reference: `simdjson` is a SIMD-accelerated JSON parser that hits multi-GB/sec parse speeds on modern CPUs. If parse speed ever matters to your service, it is worth knowing it exists.
