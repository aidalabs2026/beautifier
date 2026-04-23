---
title: "JSONP"
description: "JSON with Padding — a pre-CORS workaround for cross-origin requests, now obsolete in modern web development."
related: ["json", "jsonl"]
lastUpdated: 2026-04-23
---

**JSONP** (JSON with Padding) is a legacy technique for getting JSON data from a different origin than the page that wants it. It predates the CORS standard and exploits a quirk of the HTML `<script>` tag: unlike `XMLHttpRequest`, a `<script>` src can point to any domain and the browser will execute whatever comes back.

## How it worked

The client adds a `<script>` whose `src` points to the remote server, with a `callback` parameter:

```html
<script src="https://api.example.com/data?callback=handleData"></script>
```

The server responds not with pure JSON, but with JavaScript that calls the named function:

```javascript
handleData({"id": 1, "name": "Ada"});
```

The browser executes the response, which invokes `handleData` in the global scope. The client defines `handleData` ahead of time, and uses the data.

## Why it exists

Before CORS (standardised around 2014), browsers blocked cross-origin `XMLHttpRequest`. JSONP was the only widely-deployed way to pull JSON data from a third-party domain without a server-side proxy. Every major web API circa 2008-2013 supported it.

## Why you should not use it today

- **Security.** A malicious server can ship any JavaScript it wants, not just a call to your callback. Using JSONP on an untrusted endpoint is a script injection vulnerability.
- **Error handling.** `<script>` tags give you no structured error — failures appear as "failed to load resource" with no body.
- **HTTP methods.** JSONP only supports GET. No POST, no authentication headers, no cookies outside the browser's default.
- **CORS solves it.** Every modern browser supports CORS. Any remotely-maintained API can enable it with a single header.

## When you might still encounter it

- Very old internal systems.
- Some ad-tech and analytics pixels (though those are usually better served by `<img>` or `fetch` with `no-cors`).
- Legacy jQuery widgets whose options include `dataType: 'jsonp'`.

If you inherit JSONP in a codebase, the right move is almost always to replace it with `fetch` + server-side CORS. The technique is a museum piece.
