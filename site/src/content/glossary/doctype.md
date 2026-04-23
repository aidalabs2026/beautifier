---
title: "DOCTYPE"
description: "The document type declaration at the top of an HTML or XML document that tells the parser which rules to apply."
related: ["html", "html5", "xml", "dtd"]
lastUpdated: 2026-04-23
---

**DOCTYPE** is shorthand for "document type declaration", the first line of a document that tells the parser what language and version to expect. In HTML it looks like this:

```html
<!DOCTYPE html>
```

In older HTML, XHTML, and classic XML documents it was longer and included a reference to a [DTD](/glossary/dtd/):

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
```

## What DOCTYPE does in HTML

In HTML specifically, the DOCTYPE is a browser mode switch. Its presence and exact form controls which rendering mode the browser enters:

- `<!DOCTYPE html>` → **standards mode** (also called "no-quirks mode"). This is what you want.
- Any older DOCTYPE (HTML 4 Transitional, etc.) → depending on the exact declaration, may trigger **almost-standards mode** or **quirks mode**.
- No DOCTYPE at all → **quirks mode**, a legacy rendering mode emulating pre-2000 Internet Explorer quirks.

Quirks mode is an active rendering liability: box-model calculations are different, `<table>` layout rules are slightly different, and modern CSS does not reliably work. Every HTML document should have `<!DOCTYPE html>` at the top.

## What DOCTYPE does in XML

In XML, the DOCTYPE references a DTD that defines the grammar and declares entities. It is optional — most modern XML documents skip it entirely and rely on XML Schema validation instead. When present, DOCTYPE is the thing that enables named entities like `&copy;`, which means:

- If you remove the DOCTYPE from a document that uses named entities, the entities become undefined and the parser errors.
- If you keep it, external DTDs can be fetched over the network, which is a security concern (the "XXE" / external entity injection class of attack). Modern parsers disable external entity loading by default.

## The "HTML5" myth

People sometimes say HTML5 "removed the DOCTYPE". It did not. HTML5 simplified it to the shortest possible form that still triggers standards mode. The spec text is:

> The DOCTYPE must consist of the string `<!DOCTYPE`, then one or more ASCII whitespace, then the string `html`, then the string `>`.

That is the entire rule. Case-insensitive, three words total.

## Takeaway

Always include `<!DOCTYPE html>` at the top of an HTML document. For XML, include a DOCTYPE only if you genuinely need entity declarations or are bound to a standard that requires one.
