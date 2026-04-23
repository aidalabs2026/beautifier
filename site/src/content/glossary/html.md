---
title: "HTML"
description: "HyperText Markup Language — the text-based markup language that defines web pages."
related: ["html5", "doctype", "void-element", "xml", "entity"]
lastUpdated: 2026-04-23
---

**HTML** (HyperText Markup Language) is the markup language that describes the structure of a web page. It uses nested tagged elements — `<h1>`, `<p>`, `<a>`, `<div>` — each with optional attributes, to express headings, paragraphs, hyperlinks, images, forms, and everything else that makes up a browser-rendered document.

## One-line history

HTML was introduced by Tim Berners-Lee in 1990 alongside the first web browser and web server. It went through versions 1.0 through 4.01 at the W3C, then a brief diversion as XHTML (HTML rewritten as strict XML), then was taken over by WHATWG as [HTML5](/glossary/html5/) and its successor "HTML Living Standard". The current spec is maintained at [html.spec.whatwg.org](https://html.spec.whatwg.org/).

## Relationship to XML

HTML borrows the tag-based syntax from SGML, the ancestor of both HTML and XML. It is _not_ a valid XML dialect by default — HTML permits unclosed `<img>` tags, unquoted attribute values, and a handful of other deviations that a strict XML parser rejects. XHTML was an attempt to align them; in practice, browsers tolerate both and "XML-style HTML" looks slightly archaic today.

## A minimal document

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello, world</h1>
    <p>A minimal HTML page.</p>
  </body>
</html>
```

The pieces:

- `<!DOCTYPE html>` — the HTML5 document type declaration (see [DOCTYPE](/glossary/doctype/)).
- `<html>` — the root element.
- `<head>` — metadata, title, linked stylesheets, scripts.
- `<body>` — the visible content.

## Why people reach for an HTML beautifier

Pretty-printing HTML reveals structural bugs the same way pretty-printing JSON does. A missing `</div>` is much more obvious in a beautifier's indented output than in a minified blob. HTML beautifiers must be aware of [void elements](/glossary/void-element/) (`<br>`, `<img>`, `<hr>`) that never have closing tags, inline elements that should not be broken onto new lines, and the special parsing rules for `<pre>` and `<script>`.

## Common traps

- **Void elements** have no closing tag. `<br />` (XHTML style) is valid HTML but unnecessary; `<br>` alone is correct.
- **Attribute values** without special characters do not need quotes, but it is a good habit to quote them all.
- **Character entities** — `&amp;`, `&lt;`, `&gt;`, `&quot;` are the only ones you need to know for mechanical escaping. There are hundreds more for specific glyphs.
- **HTML is not XML** — beautifiers that assume strict XML rules will corrupt perfectly valid HTML.

A JSON/XML/HTML beautifier like the one on this site treats each format on its own terms.
