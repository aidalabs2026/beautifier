---
title: "XSLT"
description: "eXtensible Stylesheet Language Transformations — a declarative language for transforming XML documents into other XML, HTML, or text."
related: ["xml", "xpath", "xsd"]
lastUpdated: 2026-04-23
---

**XSLT** (eXtensible Stylesheet Language Transformations) is a declarative language for transforming XML documents into other formats — another XML document, HTML, plain text, or JSON. An XSLT stylesheet is itself an XML document; given an input XML and a stylesheet, an XSLT processor produces the output. The language was designed alongside [XPath](/glossary/xpath/) in the late 1990s and has matured through versions 1.0, 2.0, and 3.0.

## A minimal example

Transform a list of books into an HTML table.

Input:

```xml
<books>
  <book><title>Deep Work</title><author>Cal Newport</author></book>
  <book><title>Code</title><author>Charles Petzold</author></book>
</books>
```

Stylesheet:

```xml
<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="books">
    <html>
      <body>
        <table>
          <xsl:for-each select="book">
            <tr>
              <td><xsl:value-of select="title"/></td>
              <td><xsl:value-of select="author"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

Applying the stylesheet produces a full HTML page with one row per book.

## Why it matters

XSLT is one of the few declarative transformation languages that is widely deployed, open, and fully standardised. It is particularly strong at:

- **Document publishing.** Transforming DocBook or TEI XML into HTML, ePub, or PDF source.
- **Data integration.** Converting one XML schema into another across organisational boundaries.
- **XML report generation.** Producing human-readable reports from structured data.
- **Bidirectional data mapping** in legacy enterprise systems.

## Why it is an acquired taste

XSLT is functional, template-based, and written in XML, which is a particular combination. Newcomers often find the syntax alien ("why am I writing `<xsl:if test="...">` instead of `if (...)`"?) and the execution model surprising (recursive template application by pattern match). For someone who has internalised the model, XSLT 2.0+ is extraordinarily powerful. For someone looking for a quick way to reshape data, it is heavy.

## JSON's answer

There is no direct XSLT equivalent in the JSON ecosystem. `jq` comes close for command-line data reshaping but is much smaller. JSONata and some template engines approach the use case. For truly document-oriented transformations, XSLT remains the best-in-class option.

## Engines

- **Saxon** — the most widely used XSLT 2.0 / 3.0 implementation, Java with a C# port.
- **libxslt** — the de-facto XSLT 1.0 engine, powers most CLI tooling.
- **Browsers** — all major browsers ship XSLT 1.0, usable via `XSLTProcessor` in JavaScript.
