---
title: "BSON"
description: "Binary JSON — MongoDB's on-disk and wire format that extends JSON with types like Date, Binary, and 64-bit integers."
related: ["json", "jsonl"]
lastUpdated: 2026-04-23
---

**BSON** ("Binary JSON") is a binary-encoded extension of JSON, developed by 10gen / MongoDB for storing documents on disk and transmitting them on the wire. It is specified at [bsonspec.org](https://bsonspec.org/). Every BSON document can be converted to a JSON document; many JSON documents, however, cannot be represented as BSON without normalisation, because BSON has a smaller set of valid strings and numeric ranges.

## What BSON adds over JSON

- **Native date type** (`$date` or ISODate).
- **64-bit integers** (`NumberLong`) — JSON only has a single "number" type that typical parsers map to a double.
- **128-bit decimals** (`NumberDecimal`) — for financial precision.
- **Binary blobs** (`BinData`) — for embedded bytes without base64.
- **ObjectId** — MongoDB's 12-byte primary-key type.
- **Regular expression** type.
- **Minimum / Maximum key sentinels** — used internally by MongoDB for index ordering.

## Trade-offs

BSON sacrifices text-based debuggability (you cannot `cat` it and read it) in exchange for compact storage, fast parsing (field lengths are stored inline, so a parser can skip over values without decoding them), and the extra types above.

## Where you encounter it

Practically only inside MongoDB:

- The on-disk storage format for MongoDB collections.
- The wire format between MongoDB drivers and the server.
- The format of `mongodump` output (`.bson` files).

The MongoDB shell and `mongoexport` convert BSON to a JSON dialect ("Extended JSON") when emitting text output. That dialect uses `$date`, `$numberLong`, and similar keys to represent types that plain JSON cannot.

## JSON ↔ BSON conversion

- `bson` on npm (Node.js driver) — `serialize(obj)` / `deserialize(buf)`.
- `bson` on PyPI (part of `pymongo`) — `bson.encode(obj)` / `bson.decode(buf)`.
- In Go, `go.mongodb.org/mongo-driver/bson`.

Most applications never touch BSON directly. The driver handles the conversion and you work with idiomatic in-memory data structures.
