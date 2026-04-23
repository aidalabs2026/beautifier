---
question: "Can I beautify a 100&nbsp;MB JSON file?"
category: "limits"
order: 2
---

Not yet, in the browser. A 100&nbsp;MB document consumes hundreds of megabytes of memory when parsed and held as a JavaScript object, which will either crash your tab or exceed the file-upload limit.

The recommended workflows for very large JSON:

1. **Command line**: `jq . < big.json > pretty.json` on any Unix-like system, or `jq` via scoop/winget on Windows. Streams the file and uses a small constant amount of memory.
2. **Streaming parser in code**: `ijson` in Python, `stream-json` in Node, `json.Decoder` in Go.
3. **Convert to JSONL**: if the document is an array of records, split each record onto its own line with `jq -c '.[]'`. The resulting file is much easier to work with.

A forthcoming API on this site will handle uploads into the hundreds of megabytes. Until then, the browser version is limited to roughly 5-10&nbsp;MB.
