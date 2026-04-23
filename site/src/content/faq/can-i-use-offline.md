---
question: "Can I use this tool offline?"
category: "using-the-tool"
order: 2
---

Once the page has loaded once, the beautifier itself runs entirely in your browser — no network activity is needed for any Beautify, Minify, or Validate action. If you lose your connection after loading, the tool keeps working.

We do not currently ship a Progressive Web App or Service Worker, so if you have not visited the page recently, a cold load needs connectivity. For a permanently-offline tool, consider installing a command-line formatter like `jq` or a browser extension.
