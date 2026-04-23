---
title: "Void Element"
description: "An HTML element that has no closing tag and no content, such as <br>, <img>, and <meta>."
related: ["html", "html5", "doctype"]
lastUpdated: 2026-04-23
---

A **void element** in HTML is an element that cannot have any content, and therefore has no closing tag. The parser sees the opening tag and knows the element ends there. The HTML5 spec defines a fixed set of void elements, and no others are void.

## The full list (HTML Living Standard)

`area`, `base`, `br`, `col`, `embed`, `hr`, `img`, `input`, `link`, `meta`, `source`, `track`, `wbr`.

Most of these are self-explanatory. `<br>` is a line break. `<img>` loads an image. `<input>` is a form field. `<meta>` is a metadata tag in the `<head>`. They are not containers for anything.

## Writing them

Three forms are acceptable in HTML5:

```html
<br>           <!-- unadorned, the normal HTML5 form -->
<br>           <!-- same as above -->
<br />         <!-- XHTML-style self-closing; allowed but not required -->
```

All three produce the same DOM node. The `<br />` form became popular when XHTML was in vogue; it is harmless today but a bit dated.

## What makes them different from self-closing elements

Strict XML has the concept of a **self-closing tag**: any element can be written `<tag />` if it has no content. HTML5 does not have that. HTML5 has a fixed list of void elements; a non-void element must be explicitly closed. `<div />` in HTML5 does not create an empty `<div>` — it creates an opening `<div>` that never closes, which is a bug in the document.

If you are converting from XML-style HTML (or SVG) to HTML5, beware of this. `<div />` must become `<div></div>`, but `<br />` can stay or be written `<br>`.

## Why beautifiers must care

A naïve HTML beautifier may try to add indentation and closing tags based on a strict XML model. Run such a tool on a document containing `<img src="...">` and you might end up with `<img src="..."></img>`, which is invalid HTML5 (some parsers drop the closing tag silently, others render a second `<img>` element). A correct HTML beautifier knows the void-element list and skips the closing logic for those tags.

The [HTML tool](/json/) on this site (coming in Phase 6) will respect HTML5 void-element rules.
