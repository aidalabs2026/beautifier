---
title: "Entity"
description: "A named or numeric reference in HTML or XML that stands in for a single character, like &amp; for ampersand."
related: ["html", "xml", "escape-sequence", "dtd", "cdata"]
lastUpdated: 2026-04-23
---

An **entity** in HTML and XML is a symbolic reference that stands in for one or more characters. Entities let you include characters that would otherwise conflict with the markup — `&`, `<`, `>`, `"` — or characters your keyboard cannot easily produce.

## Three flavours

**Named entities** refer to characters by a mnemonic name. HTML predefines several hundred; XML predefines exactly five.

```html
&amp;    <!-- & -->
&lt;     <!-- < -->
&gt;     <!-- > -->
&quot;   <!-- " -->
&apos;   <!-- ' (HTML and XML) -->
&copy;   <!-- © (HTML only, not XML) -->
&nbsp;   <!-- non-breaking space (HTML only) -->
```

**Numeric character references** address a character by its Unicode code point, in decimal or hexadecimal.

```html
&#169;   <!-- © by decimal code point -->
&#xA9;   <!-- © by hex -->
&#x1F600; <!-- 😀 by hex -->
```

Numeric references are universal — any Unicode character can be referenced this way, and the form works in both HTML and XML.

**Custom entities** (XML only) are declared in a DTD at the top of the document:

```xml
<!DOCTYPE root [
  <!ENTITY company "Acme Inc.">
]>
<root>
  <footer>&company; &copy; 2026</footer>
</root>
```

Every occurrence of `&company;` is replaced by the declared text during parsing. HTML does not support author-defined entities.

## Why XML has only five predefined entities but HTML has hundreds

HTML's ancestor, SGML, was document-oriented and intended to ease hand-authoring of human-readable content in pre-Unicode terminals. Named entities like `&eacute;` for `é` were essential. XML inherited the mechanism but, by design, keeps only the five minimum entities needed to write the markup itself (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`). Everything else is expected to be written as a numeric reference or directly as a UTF-8 character.

This is why `&nbsp;` works in HTML but fails in strict XML parsers — SVG and XHTML authors have to write `&#xA0;` or define the entity in their DTD.

## Entities vs. JSON escape sequences

JSON has no concept of entities. Special characters are handled by [escape sequences](/glossary/escape-sequence/): `\"`, `\\`, `\n`, and the numeric `\uXXXX`. The JSON and HTML escape rules are independent and produce different results for the same source text. A string containing `&lt;` in JSON literally contains the four characters `&`, `l`, `t`, `;`; it is not interpreted as `<`.

## Security note: XML external entities

An XML DTD can declare an entity that points to an external URL:

```xml
<!ENTITY xxe SYSTEM "file:///etc/passwd">
```

A parser that naïvely processes this can be tricked into reading arbitrary files from disk or making network requests. This is the XXE class of vulnerability. Modern XML parsers disable external entity resolution by default; if you are writing an XML-consuming service, verify this setting explicitly.
