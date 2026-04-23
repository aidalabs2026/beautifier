---
title: "HTML5"
description: "The major version of HTML that replaced the XHTML line and introduced a Living Standard maintained by WHATWG."
related: ["html", "doctype", "void-element", "xml"]
lastUpdated: 2026-04-23
---

**HTML5** is the version of HTML that consolidated the HTML4 and XHTML lines, added a large set of new elements and APIs, and — most importantly — converted the spec into a "Living Standard" that is updated continuously instead of in numbered releases. "HTML5" as a literal version number has been superseded by the [WHATWG HTML Living Standard](https://html.spec.whatwg.org/), but the name persists in casual use for "modern HTML".

## Highlights

- **New semantic elements** — `<article>`, `<section>`, `<header>`, `<footer>`, `<nav>`, `<aside>`, `<main>`.
- **New form types** — `<input type="email">`, `type="date"`, `type="range"`, `type="color"`.
- **Native multimedia** — `<video>`, `<audio>`, `<canvas>`.
- **Storage and APIs** — `localStorage`, `sessionStorage`, `IndexedDB`, Service Workers, WebSockets, WebRTC, Web Workers.
- **A simpler DOCTYPE** — `<!DOCTYPE html>`.

## Why it mattered

Before HTML5, the web was drifting towards a split: HTML4 (loose but widely deployed) and XHTML (strict and increasingly ignored). XHTML tried to reform HTML as a valid XML dialect, which meant browsers had to implement two parsing modes and web authors had to choose. HTML5 chose the first: define HTML with its own lenient parsing algorithm, match what browsers actually did, and stop pretending XHTML would happen. Since 2014, essentially all new HTML content has been HTML5.

## Parsing model

HTML5 specifies parsing in detail, down to how malformed documents should be recovered. Any HTML5-compliant parser produces the same DOM from the same byte input, even for documents that would have been invalid in earlier versions. This is the reason browsers mostly agree about page rendering today.

## Strict vs. loose rules

HTML5 is more lenient than XHTML, deliberately:

- Attribute values do not need quotes if they contain no special characters.
- Boolean attributes do not need a value: `<input required>` is equivalent to `<input required="">` or `<input required="required">`.
- [Void elements](/glossary/void-element/) like `<br>` and `<img>` have no closing tag. The XHTML-style `<br />` is allowed but not required.
- Optional tags (some `<tbody>`, `<tr>`, `<li>`, `<p>` closing tags) may be omitted when the parser can infer them.

Beautifiers must respect these rules. A beautifier that inserts closing `</br>` tags is broken.

## Related reading

- [DOCTYPE](/glossary/doctype/) for the one-line declaration at the top.
- [Void element](/glossary/void-element/) for the tags that never close.
- The full spec at [html.spec.whatwg.org](https://html.spec.whatwg.org/) is actually readable, with extensive examples.
