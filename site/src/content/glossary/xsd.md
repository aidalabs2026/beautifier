---
title: "XSD"
description: "XML Schema Definition — the W3C standard for describing and validating the shape of XML documents."
related: ["xml", "dtd", "xpath", "json-schema"]
lastUpdated: 2026-04-23
---

**XSD** (XML Schema Definition), also just called "XML Schema", is the W3C standard for describing the structure and content of XML documents. An XSD file specifies what elements may appear, in what order, with what attributes, and with what data types. It plays the role for XML that [JSON Schema](/glossary/json-schema/) plays for JSON — except XSD arrived first (2001) and is still arguably more powerful for document-oriented data.

## A minimal example

A tiny XSD describing a book:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="book">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="title" type="xs:string"/>
        <xs:element name="author" type="xs:string" maxOccurs="unbounded"/>
      </xs:sequence>
      <xs:attribute name="id" type="xs:string" use="required"/>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

Given this schema, `<book id="978"><title>X</title><author>Ada</author></book>` is valid. `<book><title>X</title></book>` is invalid (missing required `id`). `<book id="978"><author>Ada</author></book>` is also invalid (elements must appear in the declared order, title before author).

## What XSD can express that JSON Schema cannot

- **Ordered sequences.** XSD's `<xs:sequence>` requires elements to appear in a specific order. JSON has no concept of "order of keys".
- **Element occurrence constraints.** `minOccurs`, `maxOccurs` give fine control over cardinality.
- **Rich primitive types.** `xs:date`, `xs:duration`, `xs:dateTime`, `xs:hexBinary`, `xs:base64Binary`, and several numeric subsets.
- **Substitution groups** — schemas can declare that one element type may be used in place of another.
- **Identity constraints** — `<xs:key>` and `<xs:keyref>` enforce primary-key / foreign-key style relationships.
- **Inheritance** — `<xs:extension>` and `<xs:restriction>` create subtypes.

## Validation tooling

- **Java**: built-in `javax.xml.validation` and many enterprise validators.
- **.NET**: `System.Xml.Schema`.
- **Python**: `xmlschema` on PyPI is the most complete pure-Python implementation.
- **Command line**: `xmllint --schema schema.xsd doc.xml`.

## Where XSD is load-bearing

Anywhere industry-standard data exchange is XML-based:

- Healthcare interoperability (HL7 v3, CDA).
- Finance (FIX, FpML).
- Government schemas (many national procurement and tax systems).
- Office document formats (DOCX, ODF).

## Trade-offs

XSD is verbose — a schema is typically several times the size of the document it describes. For simple record-style data it is overkill. For long-lived, validated, cross-organisation document exchange, it remains the gold standard.
