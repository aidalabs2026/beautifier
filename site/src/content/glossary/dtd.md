---
title: "DTD"
description: "Document Type Definition — the original XML schema language, inherited from SGML, still encountered in legacy documents."
related: ["xml", "xsd", "html", "entity"]
lastUpdated: 2026-04-23
---

**DTD** (Document Type Definition) is the original schema language for XML, inherited from SGML. A DTD defines what elements a document may contain, what attributes those elements may have, and what entities are declared. It was the only validation option in the earliest XML specs and predates [XSD](/glossary/xsd/) by several years.

## Example

```xml
<!DOCTYPE book [
  <!ELEMENT book (title, author+)>
  <!ELEMENT title (#PCDATA)>
  <!ELEMENT author (#PCDATA)>
  <!ATTLIST book id CDATA #REQUIRED>
  <!ENTITY copy "&#169;">
]>

<book id="978">
  <title>Deep Work</title>
  <author>Cal Newport</author>
</book>
```

The `<!DOCTYPE>` block declares a grammar for `<book>` elements: they must contain exactly one `<title>` followed by one or more `<author>`s, and they must have a required `id` attribute.

## Why DTDs are largely superseded

XSD replaced DTDs for most new XML work because it addresses three problems:

1. **DTDs have their own syntax**, not XML. XSDs are themselves XML documents, which means XML tooling applies uniformly.
2. **DTDs have weak typing.** Attribute values are essentially strings, with a few restricted subtypes like `ID` and `IDREF`. XSDs provide rich typing (dates, numbers, base64 binary, etc.).
3. **DTDs cannot support namespaces.** This is disqualifying for any modern XML workflow.

## Where you still encounter DTDs

- HTML documents with a historical DOCTYPE (`<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" ...>`). Modern HTML5 uses a simpler DOCTYPE with no DTD body.
- Publishing formats like DocBook originally used DTDs; many projects have migrated to XSD or RELAX NG, but the DTD versions are still in circulation.
- Email standards (e.g., DKIM-associated specs).
- Legacy industry document types — old versions of SEC filings, for example.

## Entity declarations

One feature DTDs have that XSD does not is **entity declaration**. You can define `&copy;` once in the DTD and use it throughout the document as shorthand for `&#169;`. This is how HTML gets its `&nbsp;`, `&amp;`, and hundreds of other named entities. The cost is that entities also enable denial-of-service attacks (the "billion laughs" attack), which is why modern XML parsers disable external entity loading by default.

## Should I use a DTD in 2026?

Almost never for new work. Use [XSD](/glossary/xsd/) or [JSON Schema](/glossary/json-schema/) depending on your format. The only good reasons to write a DTD today are (a) you are publishing to a format that still requires one, or (b) you are extending an existing XML vocabulary that is DTD-based.
