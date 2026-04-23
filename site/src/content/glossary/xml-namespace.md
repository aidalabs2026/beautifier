---
title: "XML Namespace"
description: "A mechanism for mixing elements from different vocabularies in a single XML document without name collisions."
related: ["xml", "xsd", "json-ld"]
lastUpdated: 2026-04-23
---

**XML Namespace** is a W3C mechanism for distinguishing elements that share the same local name but come from different specifications. It was added to XML in 1999 (XML 1.0 was 1998) and is considered essential for any non-trivial XML work.

## The problem it solves

Suppose you want to combine data from two specifications: one defines `<title>` to mean a book title, the other defines `<title>` to mean a job title (like "Senior Engineer"). In a single document you cannot tell them apart without extra information. Namespaces provide that information via a URI identifier attached to each element.

## Syntax

```xml
<root xmlns="http://example.org/library"
      xmlns:hr="http://example.org/hr">
  <title>The C Programming Language</title>
  <hr:person>
    <hr:name>Ada</hr:name>
    <hr:title>Engineer</hr:title>
  </hr:person>
</root>
```

Here:

- `xmlns="http://example.org/library"` is the default namespace — `<title>` and any other unprefixed element belongs to it.
- `xmlns:hr="http://example.org/hr"` binds the prefix `hr:` to the HR vocabulary.
- `<hr:title>` is in a different namespace than `<title>`, so they are distinct.

The namespace URI is an opaque identifier. Nothing needs to exist at that URL. Two namespaces are considered equal if and only if their URIs are byte-identical.

## Where you see it

- SOAP envelopes: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">`
- XML Schema itself: `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">`
- XSLT stylesheets: `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">`
- HTML5 (when served as application/xhtml+xml): default namespace `http://www.w3.org/1999/xhtml`
- SVG: `xmlns="http://www.w3.org/2000/svg"`
- Atom / RSS feeds mixing Dublin Core (`dc:creator`) with feed elements.

## Why JSON has nothing equivalent

JSON was designed for a narrower purpose than XML — data interchange, not document authoring. Key collisions between "different vocabularies" happen rarely in JSON, and teams usually solve them by prefixing keys (`shop_title`, `job_title`) or by nesting (`{"book": {...}, "job": {...}}`).

[JSON-LD](/glossary/json-ld/) adds a namespace-like mechanism — the `@context` object — on top of JSON. It is closest in spirit to XML namespaces, though it is an application convention rather than a parser-level feature.

## Trade-offs

Namespaces introduce complexity: prefix bindings, scoping rules (inherited by child elements), and the occasional "default namespace" pitfall where an unprefixed element is no longer in "no namespace". Most XML validators and tools handle them correctly; most XML authors fumble them at least once.
