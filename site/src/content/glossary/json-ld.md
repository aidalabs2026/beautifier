---
title: "JSON-LD"
description: "JSON for Linked Data — a method of encoding semantic-web and schema.org metadata inside ordinary-looking JSON."
related: ["json", "json-schema", "xml-namespace"]
lastUpdated: 2026-04-23
---

**JSON-LD** stands for "JSON for Linked Data". It is a W3C standard ([JSON-LD 1.1](https://www.w3.org/TR/json-ld11/)) for encoding data that has semantic meaning — people, places, events, articles, products, and so on — in a format that can still be parsed by any ordinary JSON parser. The goal is to bring the richness of RDF and the semantic web to developers who would rather never learn XML namespaces.

## The everyday example

Google, Bing, and other search engines read JSON-LD from web pages to produce rich search results (star ratings, breadcrumbs, product snippets, FAQ accordions). If a page's `<script type="application/ld+json">` block contains a recipe schema, Google can show the recipe card directly in search results.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Simple focaccia",
  "recipeIngredient": ["500g flour", "10g salt", "7g yeast", "400ml water"],
  "prepTime": "PT10M",
  "cookTime": "PT25M"
}
</script>
```

Notice that this is plain JSON. A parser that knows nothing about JSON-LD would still read it as a regular object with four string fields and an array. The magic is in the special `@` keys.

## The `@` keywords

JSON-LD adds a small set of reserved keys, each prefixed with `@`:

- `@context` — a map of short names to fully-qualified URIs. It is what turns `name` into `https://schema.org/name`.
- `@type` — the RDF type of the resource (e.g. `"Product"`, `"Person"`, `"Article"`).
- `@id` — the IRI (Internationalized Resource Identifier) of the resource.
- `@value`, `@language`, `@list`, `@set` — less common, but used for typed literals and collections.

With `@context`, any key in the object can be resolved to a full IRI. This is JSON-LD's answer to [XML namespaces](/glossary/xml-namespace/).

## Use cases

- SEO and rich search results. This is where most developers first meet JSON-LD.
- Describing open data catalogs (W3C DCAT).
- Linking data across APIs that want to be interoperable without strict schema agreement.
- Knowledge graphs.

## Trade-offs

JSON-LD is verbose once you start using `@context` extensively. Small schema.org examples are nearly painless, but a full semantic-web data model introduces nested contexts and type coercions that look alien to a typical JSON consumer. For internal APIs, you almost never need it. For public metadata consumed by third-party crawlers, it is the standard.

## Tooling

- `jsonld` on npm — official reference implementation.
- `pyld` on PyPI — the Python port.
- `jsonld-java` — for Java services.
- Chrome's Rich Results Test at [search.google.com/test/rich-results](https://search.google.com/test/rich-results) verifies JSON-LD fragments.
