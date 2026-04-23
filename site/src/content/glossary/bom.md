---
title: "BOM"
description: "Byte Order Mark — an invisible character at the start of a text file that signals encoding and endianness."
related: ["utf-8", "escape-sequence"]
lastUpdated: 2026-04-23
---

**BOM** stands for "Byte Order Mark", the Unicode character U+FEFF placed at the very start of a text file to signal the encoding and, in wide encodings, the byte order. A UTF-8 BOM looks like the byte sequence `EF BB BF`. A UTF-16 LE BOM is `FF FE`. A UTF-16 BE BOM is `FE FF`.

## Why it exists

In the multi-byte encoding era (UTF-16, UTF-32), you needed to know whether the file was little-endian or big-endian to decode it correctly. The BOM solved this: if the first two bytes are `FF FE`, the file is little-endian UTF-16; if `FE FF`, big-endian. A decoder reading a file could inspect those first bytes and know what to do.

## Why it is awkward for UTF-8

UTF-8 has no byte-order ambiguity — it is defined as a specific sequence of 1-to-4-byte codes with no endianness. So a UTF-8 BOM is not really a byte-order mark; it is just a magic signature that says "this file is UTF-8". Some tools write one. Others don't. Some readers tolerate it. Others don't.

The result: the UTF-8 BOM is an optional, invisible, often-invisible-in-editors character at the start of a file that may or may not break parsers.

## Where it causes problems

- **Strict JSON parsers** — the JSON spec does not allow a BOM before the first structural character. Some parsers error with `Unexpected token  in JSON at position 0` (that is an invisible BOM you cannot see). Others silently accept.
- **Bash scripts** — a BOM at the start of `#!/bin/bash` makes the shebang line invalid, and the script fails to execute.
- **Source code files** — some compilers trip on a BOM.
- **JSONL / NDJSON** — a BOM at the start breaks parsing of the first record.

## How to get rid of it

```bash
# Strip BOM from a single file using sed
sed -i '1s/^\xEF\xBB\xBF//' file.json

# Using tr (pipe-friendly but loses the file)
tr -d '\357\273\277' < in.json > out.json

# Using PowerShell
(Get-Content -Raw in.json) -replace "^﻿", "" | Set-Content -Encoding utf8NoBOM out.json
```

## How to prevent it

- In VS Code: click the encoding label in the status bar → "Save with Encoding" → choose "UTF-8" (not "UTF-8 with BOM").
- In Notepad (Windows 10+): select "UTF-8" from the encoding dropdown instead of "UTF-8 with BOM".
- In PowerShell: use `Out-File -Encoding utf8NoBOM` instead of `utf8`.
- In Git: configure `.gitattributes` with `* text=auto eol=lf` and use editors that default to UTF-8 without BOM.

## A quick test

```bash
# First three bytes of the file:
head -c 3 file.json | od -c

# If you see "357 273 277", you have a UTF-8 BOM.
# Expected for clean UTF-8: just the first real character.
```

## Related reading

- [UTF-8](/glossary/utf-8/) — the encoding that sometimes has an unnecessary BOM.
- The guide [The 10 most common JSON syntax errors](/guides/common-json-syntax-errors/) lists BOMs as error #10.
