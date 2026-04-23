---
question: "Does Beautifier upload my JSON to a server?"
category: "privacy"
order: 1
---

No. In the MVP release, all parsing and formatting runs inside a Web Worker
on your own device. You can verify this by opening your browser's developer
tools and watching the Network tab while you click Beautify or Minify — no
request carrying your content leaves your device.

If a future feature ever requires a server upload (for example, a large-file
API for payloads above the browser's practical limit), it will be clearly
marked and will require your explicit action.
