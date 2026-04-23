---
title: "UTF-8"
description: "The dominant character encoding on the modern web — variable-width, backward-compatible with ASCII, and the default for JSON."
related: ["bom", "escape-sequence", "json"]
lastUpdated: 2026-04-23
---

**UTF-8** is a variable-width character encoding for Unicode, designed by Ken Thompson and Rob Pike in 1992. It uses 1 to 4 bytes per character, is backward-compatible with ASCII, and is the default text encoding on the modern web. JSON explicitly specifies UTF-8 as the recommended encoding, and in practice it is the only encoding you will encounter.

## How it works

- ASCII characters (U+0000 to U+007F) are encoded as a single byte, identical to plain ASCII. This is the backward-compatibility trick that made UTF-8 adoption painless.
- Characters U+0080 to U+07FF use two bytes.
- Characters U+0800 to U+FFFF use three bytes. This covers most non-Latin alphabets.
- Characters U+10000 to U+10FFFF use four bytes. This covers emoji, rare scripts, and historical characters.

The first byte of a multi-byte sequence signals how long the sequence is, and continuation bytes have a distinctive high-bit pattern (`10xxxxxx`). This means a UTF-8 decoder can resync if dropped mid-stream, and byte operations like "find the next `\n`" still work correctly because ASCII-valued bytes never appear inside multi-byte sequences.

## Why it won

Before UTF-8 there were two competing ideas: "use Latin-1 for Western text and a different encoding for each script" or "use UTF-16, two bytes per character". Both had problems. UTF-16 broke ASCII tooling. Per-script encodings made multilingual text a nightmare.

UTF-8 is compact for ASCII (one byte, same as before), handles every script via its longer sequences, and doesn't break any existing ASCII-aware tool. By the mid-2010s every major system had converged on it.

## JSON's relationship to UTF-8

RFC 8259 explicitly recommends UTF-8 for JSON exchanged over the internet and requires it for JSON-based protocols. In practice:

- `JSON.parse` accepts any string; the encoding of the source file is separate from JSON itself.
- `JSON.stringify` returns a JavaScript string, which the runtime typically emits as UTF-8 when serialised to a file or network.
- When reading JSON from a byte stream, always decode as UTF-8 first.

## Common problems

- **Mojibake** — characters display as garbage because the receiver decoded bytes with the wrong encoding. Usually happens when UTF-8 bytes are read as Latin-1 or CP1252. Fix by setting the decoder explicitly.
- **BOM at the start** — see [BOM](/glossary/bom/). The UTF-8 BOM is valid but rarely helpful and breaks some strict parsers.
- **Windows defaults** — some older Windows tools default to UTF-16 or CP1252. When saving a file in Notepad for JSON consumption, explicitly choose "UTF-8" (and "Save without BOM" where available).

## Testing encoding issues

```bash
# What encoding does this file claim to be?
file -i data.json

# Convert to UTF-8 without BOM
iconv -f UTF-16 -t UTF-8 in.json > out.json

# Strip a UTF-8 BOM if present
sed '1s/^\xEF\xBB\xBF//' in.json > out.json
```
