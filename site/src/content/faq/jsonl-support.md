---
question: "Does the JSON tool understand JSONL / NDJSON?"
category: "formats"
order: 5
---

The current JSON tool treats its input as a single JSON value. If you paste a JSONL file — multiple JSON objects separated by newlines — the parser will fail on the second object.

For JSONL specifically, a dedicated mode is planned. In the meantime, a simple workaround: wrap the JSONL lines with a comma-separated array.

```bash
# JSONL → JSON array via jq
jq -s '.' data.jsonl > data.json
```

Paste the resulting array, and the tool will beautify it normally. See the guide [JSONL, NDJSON, and JSON Lines](/guides/jsonl-and-ndjson-explained/) for the format's details.
