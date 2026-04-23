---
title: "NDJSON"
description: "Newline-Delimited JSON — a nearly-identical sibling of JSONL used interchangeably in most toolchains."
related: ["jsonl", "json", "parser"]
lastUpdated: 2026-04-23
---

**NDJSON** (Newline-Delimited JSON) is an informal specification published at [ndjson.org](http://ndjson.org/) for a line-delimited JSON format. Each line contains one valid JSON value, separated by a line feed (`\n`) or carriage-return-line-feed (`\r\n`).

In practice, NDJSON is the same format as [JSONL](/glossary/jsonl/). Tools generally accept either name and either file extension (`.ndjson` or `.jsonl`). The two specs differ only in minor details — NDJSON traditionally allows `\r\n` as a line separator, JSONL insists on `\n` only. Most consumers do not care.

## Example

```
{"timestamp": "2026-04-23T12:00:00Z", "level": "info",  "msg": "server started"}
{"timestamp": "2026-04-23T12:00:01Z", "level": "debug", "msg": "route matched"}
{"timestamp": "2026-04-23T12:00:05Z", "level": "error", "msg": "db timeout"}
```

Each record is independent. A log viewer can start at line 1,000,000 without knowing anything about lines 1 through 999,999.

## Reading NDJSON

Same recipe as JSONL: split the input stream on newlines, parse each non-empty line as JSON.

```python
for line in f:
    line = line.strip()
    if line:
        record = json.loads(line)
        process(record)
```

## Trade-offs

The format shines when records are small and the stream is long. It loses its advantage when individual records are so large that they themselves span many line-worth of bytes — line-delimited parsers assume lines are reasonably sized.

For a full comparison with standard JSON and the streaming alternatives, see the guide [JSONL, NDJSON, and JSON Lines explained](/guides/jsonl-and-ndjson-explained/).
