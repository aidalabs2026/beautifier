---
title: "XPath"
description: "A path-based query language for selecting nodes from an XML document, standardised by the W3C."
related: ["xml", "xslt", "json-pointer"]
lastUpdated: 2026-04-23
---

**XPath** is a query language for XML documents. Given a document tree, an XPath expression selects one or more nodes from it — elements, attributes, text, or any combination. It was designed alongside [XSLT](/glossary/xslt/) and is standardised by the W3C. Current versions are XPath 2.0, 3.0, and 3.1, each adding features; XPath 1.0 is still widely deployed in simpler tools.

## Example

Given:

```xml
<library>
  <book id="1">
    <title>The C Programming Language</title>
    <author>Kernighan</author>
    <author>Ritchie</author>
  </book>
  <book id="2">
    <title>Code</title>
    <author>Petzold</author>
  </book>
</library>
```

- `/library/book` — both `<book>` elements.
- `//book[@id="2"]` — the book with `id="2"`.
- `//book[1]` — the first book (XPath is 1-indexed, not 0-indexed).
- `//book[author="Petzold"]/title/text()` — the text `"Code"`.
- `//author[1]` — first `<author>` child of each book (careful: this is per-parent, not globally).
- `//book[count(author) > 1]/title` — titles of books with multiple authors.

## Axes and predicates

XPath is built around two concepts:

- **Axes** — directions in the document tree: `child::`, `parent::`, `descendant::`, `ancestor::`, `following-sibling::`, and more. The `/` shorthand is `child::`.
- **Predicates** — square-bracket filters that constrain which nodes a step selects: `book[@id="1"]`, `*[position() = last()]`.

Combining them gives a lot of expressive power in one line.

## Where you see XPath

- **XSLT transformations** — XPath is the addressing language XSLT uses to find what to transform.
- **Selenium and browser automation** — `driver.findElement(By.xpath("..."))` to locate DOM nodes.
- **Python's `lxml`, JavaScript's `document.evaluate`**, Java's `javax.xml.xpath` — generic XML traversal.
- **XSD** uses XPath expressions in `<xs:selector>` / `<xs:field>` for identity constraints.
- **YAML / JSON alternatives** — XPath is the inspiration for JSONPath and JMESPath.

## Why it matters

Before XPath, extracting "the email of every customer with a pending order" from an XML document required writing a DOM traversal by hand. XPath turns that into one expression. The same idea drove JSONPath and later jq for JSON, and (centrally) CSS selectors in web scraping.

## Simple mental model

If you know CSS selectors, XPath feels like "CSS selectors with more power and more punctuation". `.foo .bar` in CSS is roughly `//foo//bar` in XPath. Beyond that, XPath can walk up the tree, match by position, compute with strings, and evaluate boolean predicates — things CSS selectors cannot do.
