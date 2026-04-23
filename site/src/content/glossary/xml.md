---
title: "XML"
description: "eXtensible Markup Language — a text-based markup format for structured documents, standardised by the W3C in 1998."
related: ["xsd", "dtd", "xpath", "xml-namespace", "html", "cdata", "json"]
lastUpdated: 2026-04-23
---

**XML** (eXtensible Markup Language) is a text-based format for encoding structured documents with nested tagged elements. It was standardised by the [W3C in 1998](https://www.w3.org/TR/xml/) and remains one of the most widely deployed data formats in the world — though its everyday visibility has declined as JSON took over the API layer.

## Syntax

```xml
<?xml version="1.0" encoding="UTF-8"?>
<book id="978-0-13-468599-1">
  <title>The C Programming Language</title>
  <authors>
    <author>Brian Kernighan</author>
    <author>Dennis Ritchie</author>
  </authors>
  <published year="1978" />
</book>
```

Every piece of data is either:

- An **element** — `<tag>content</tag>` or the self-closing form `<tag />`.
- An **attribute** — `id="..."` on an opening tag.
- A **text node** — the text content of an element.

Elements can nest arbitrarily deep. A single root element must contain all others.

## Where XML still dominates

- **Office document formats.** DOCX, XLSX, PPTX, ODF — all XML inside a ZIP archive.
- **Enterprise integration.** SOAP, HL7 (healthcare), FIX (finance), EDI/X12.
- **Publishing.** DocBook, TEI, JATS (journal articles).
- **Configuration in the Java / .NET world.** Maven `pom.xml`, Spring, `.csproj`.
- **SVG** — the entire vector-graphics format is XML.
- **RSS and Atom** syndication feeds.

## What makes XML different from JSON

- Mixed content (text interleaved with child elements) is natural: `<p>Hello <strong>world</strong>.</p>`.
- Attributes are a separate concept from child elements, enabling meaningful modelling choices.
- [XML namespaces](/glossary/xml-namespace/) allow mixing vocabularies.
- [XSD](/glossary/xsd/) provides stronger validation than [JSON Schema](/glossary/json-schema/) for document-like data.
- A full transformation language ([XSLT](/glossary/xslt/)) exists; JSON has nothing equivalent.

## What JSON has that XML doesn't

- A native array type (XML requires repeated sibling elements by convention).
- Roughly half the byte count for the same data.
- Browser-native `JSON.parse` / `JSON.stringify`.
- A smaller surface area — six data types, simple rules.

For the comparison in depth, see [JSON vs XML](/guides/json-vs-xml/).
