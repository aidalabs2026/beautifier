---
title: "Escape Sequence"
description: "A character or group of characters that represent a special character inside a string literal."
related: ["json", "utf-8", "entity"]
lastUpdated: 2026-04-23
---

An **escape sequence** is a character or group of characters inside a string literal that represents a different character than it literally looks like. The most common form is a backslash followed by a letter or digits: `\n` represents a newline, `\t` represents a tab, `\"` represents a literal double quote that does not close the string.

## JSON's escape sequences

JSON defines a small, fixed set of backslash escapes:

| Escape | Meaning |
|---|---|
| `\"` | Double quote |
| `\\` | Backslash |
| `\/` | Forward slash (optional) |
| `\b` | Backspace |
| `\f` | Form feed |
| `\n` | Line feed |
| `\r` | Carriage return |
| `\t` | Tab |
| `\uXXXX` | Unicode character by 4-hex-digit code point |

Any other backslash sequence (`\x`, `\0`, `\a`, `\e`) is an error. The spec is strict about this, and strict parsers will reject unrecognised escapes.

## Surrogate pairs

For Unicode code points above U+FFFF — including every emoji — JSON uses UTF-16 surrogate pairs: two consecutive `\uXXXX` escapes, a high surrogate (`\uD800`-`\uDBFF`) followed by a low surrogate (`\uDC00`-`\uDFFF`). 😀 (U+1F600) is encoded as `😀`.

## Why escape sequences exist at all

A string literal has to start and end with the same character (double quote in JSON). If you want to include a literal double quote inside the string, the parser needs a way to tell it apart from the terminating quote. Escape sequences are that way.

The same problem applies to:

- Backslash itself (the escape character).
- Control characters (tabs, newlines) that would break the line structure of the serialised form.
- Any character that could confuse a downstream processor.

## Escape sequence vs. HTML entity

Both are ways to represent characters symbolically. They are not interchangeable:

- JSON escapes: `\n`, `\"`, `\uXXXX`. Work in JSON strings only.
- HTML entities: `&amp;`, `&lt;`, `&#169;`. Work in HTML/XML element content and attribute values only.

If you see `&amp;` in a JSON string, you have the literal six characters `&`, `a`, `m`, `p`, `;` — not an ampersand. If you see `\n` in an HTML attribute, you have the literal two characters `\` and `n` — not a newline.

## Common mistakes

- Forgetting to double backslashes in Windows paths: `"C:\Users\..."` must be `"C:\\Users\\..."`.
- Assuming `\x41` (hex escape) works in JSON — it does not. Use `A`.
- Using HTML entity syntax inside JSON strings.
- Mixing up `\r\n` on Windows — JSON tools generally normalise to `\n`, which is what the spec actually requires for newlines.

See the guide [Escaping strings in JSON](/guides/json-escape-characters/) for the full reference with language-specific quirks.
