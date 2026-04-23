---
question: "What is the maximum file size I can beautify?"
category: "limits"
order: 1
---

In the current browser-only version:

- **File upload**: up to **5&nbsp;MB**. Files larger than this are rejected with an error.
- **Paste into the input**: limited by your browser's memory and CPU. In practice, 5-10&nbsp;MB pasted JSON works smoothly on a modern laptop. 50&nbsp;MB may briefly freeze the page while parsing.

For files larger than 10&nbsp;MB, we are building a server-side API (planned for Phase 6 of our roadmap) that will handle payloads up to at least 100&nbsp;MB with streaming.

If you have a 20&nbsp;MB JSON file right now, the most reliable option is to use `jq` locally: `jq . < big.json > pretty.json`.
