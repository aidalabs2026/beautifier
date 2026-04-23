---
title: "JSONL"
description: "JSON Lines — a format where each line of a file is a complete JSON document, typically a single object."
related: ["json", "ndjson", "parser"]
lastUpdated: 2026-04-23
---

**JSONL** (JSON Lines) is a format in which each line of a file is an independent JSON document, almost always an object. Lines are separated by single `\n` characters. There is no wrapping array, no comma between records, and no top-level structure beyond the stream of lines.

```
{"id": 1, "name": "Ada"}
{"id": 2, "name": "Linus"}
{"id": 3, "name": "Grace"}
```

The format has no separate spec beyond the short description at [jsonlines.org](https://jsonlines.org/). Each line must be valid JSON on its own, and each line should be written without internal newlines (i.e., minified).

## Why the format exists

Standard JSON requires the entire file to be read before any of it can be used, because everything is nested inside one top-level value. For large datasets this is inefficient. JSONL replaces the wrapping array with a stream of records, which brings three immediate wins:

- **Streaming** — you can process records one at a time without holding the whole dataset in memory.
- **Append-only writes** — adding a record is `echo '{"...": "..."}' >> file.jsonl`. No splicing into an existing array.
- **Parallel processing** — a large JSONL file can be split on newline boundaries and each chunk fed to a separate worker.

## Where it shows up

- Logs: structured logging tools (Vector, Fluentd, cloud platforms) emit JSONL by default.
- Data pipelines: Kafka Connect, BigQuery exports, PostgreSQL `COPY ... FORMAT json`, MongoDB `mongoexport`.
- ML training sets: Hugging Face datasets and many LLM providers use `.jsonl` for instruction tuning and evaluation data.

## Gotchas

- Do not pretty-print individual records — pretty-printing inserts newlines, which destroys the one-record-per-line invariant.
- Some editors or Git on Windows convert `\n` to `\r\n`. Strict parsers reject that; lenient ones accept it.
- A BOM at the start of the file can break parsing of the first record. Always save as UTF-8 without BOM.

See the guide: [JSONL, NDJSON, and JSON Lines explained](/guides/jsonl-and-ndjson-explained/).
