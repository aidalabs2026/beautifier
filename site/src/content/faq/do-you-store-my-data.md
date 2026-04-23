---
question: "Do you store the JSON I paste in?"
category: "privacy"
order: 1
---

No. Every Beautify, Minify, and Validate action runs inside a Web Worker in your browser. Your input is never uploaded to our servers.

You can verify this yourself: open your browser's DevTools, switch to the Network tab, and click Beautify. No network request carries your content. The only requests you will see are the page's static assets.

The one exception is the `?input=` URL prefill feature, where you knowingly put data into the URL. See the [FAQ on URL prefill](/faq/#prefill-from-url) for details.
