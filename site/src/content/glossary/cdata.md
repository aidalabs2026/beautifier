---
title: "CDATA"
description: "A section of an XML document where markup characters are treated as plain text, letting you embed code or HTML snippets without escaping."
related: ["xml", "entity", "escape-sequence"]
lastUpdated: 2026-04-23
---

**CDATA** ("character data") is an XML syntax that marks a section of a document as literal text: every character is treated as text, even the special characters `<`, `>`, and `&` that would otherwise trigger markup parsing. The section is delimited by `<![CDATA[` at the start and `]]>` at the end.

## When it helps

Imagine embedding a snippet of code or XML inside an XML document. Without CDATA, you would have to escape every `<` as `&lt;` and every `&` as `&amp;`:

```xml
<description>
  Use the format &lt;book id="X"&gt;&lt;title&gt;...&lt;/title&gt;&lt;/book&gt; &amp; validate.
</description>
```

That is exhausting to write and unreadable. CDATA skips all the escaping:

```xml
<description>
  <![CDATA[
    Use the format <book id="X"><title>...</title></book> & validate.
  ]]>
</description>
```

Both examples parse to the same string. The CDATA form is much easier to write and maintain.

## What CDATA does NOT do

- It does not make attributes easier. CDATA is only valid in element content, never in attribute values. Attributes always need `&quot;`, `&amp;`, and so on.
- It does not turn off namespace or validation rules. A schema-validated document still sees the content as a string, not as markup.
- It does not let you nest CDATA. You cannot include the literal `]]>` inside a CDATA section without splitting it into two sections.

## Parsing behaviour

To an XML parser, `<![CDATA[hello & goodbye]]>` and `hello &amp; goodbye` produce the same in-memory result: a text node containing `"hello & goodbye"`. When the parser hands data to your application, CDATA-ness is usually lost; it is a source-level convenience, not a semantic distinction.

Some XML libraries preserve the CDATA boundary when re-serialising, which matters if you want round-trip fidelity for tools that inspect the raw text. Most do not.

## Where you see it

- XSLT stylesheets embedding HTML.
- XML config files embedding SQL, regex, or shell snippets.
- SOAP messages carrying embedded XML payloads.
- RSS feeds with HTML content inside `<description>` — `<![CDATA[<p>...</p>]]>` is the traditional encoding.

JSON has no equivalent — in JSON, all string content is escaped the same way, and there is no opt-out from escape rules inside a string.
