# 04. 콘텐츠 계획

AdSense 승인과 SEO 트래픽 양쪽을 겨냥한 **영문** 콘텐츠 설계. **최소 20 페이지 이상의 실질 콘텐츠** 가 승인 신청 전 기준선이다. 사이트 UI·콘텐츠는 영어 전용, 본 문서(기획)만 한국어.

## 사이트 맵 (영문 URL 설계)

```
/                           Home — 서비스 소개, 바로가기(/json 등), 대표 가이드 3편 카드
/json                       JSON beautifier 도구 + 1문단 요약 + FAQ + 관련 가이드 3편
/xml                        XML beautifier 도구     (Phase 6)
/html                       HTML beautifier 도구    (Phase 6)
/css                        CSS beautifier         (Phase 7, 선택)
/sql                        SQL formatter          (Phase 7, 선택)
/yaml                       YAML formatter         (Phase 7, 선택)
/guides/
  /what-is-json                       basics
  /json-vs-yaml                       comparison
  /common-json-syntax-errors          troubleshooting
  /json-schema-basics                 basics
  /jsonl-and-ndjson-explained         format-guide
  /pretty-print-vs-minify             format-guide
  /xml-validation-best-practices      basics   (Phase 6)
  /html-sanitization-basics           basics   (Phase 6)
  /sorting-json-keys-pros-and-cons    strategy
  /when-to-minify-api-payloads        strategy
/glossary/
  /index                              Glossary 인덱스 페이지
  /{term}                             각 용어 개별 페이지 (300~600 단어)
/faq                                  FAQ 인덱스 (카테고리 탭)
/about                                운영자·프로젝트 소개
/privacy                              Privacy Policy (AdSense/GA/쿠키 명시)
/terms                                Terms of Service
/contact                              FormSubmit 폼
/api                                  API 문서 (Phase 6 공개)
```

## 도구 페이지 기능 매트릭스

| 페이지 | Beautify | Minify | Validate | Tree View | Diff | Sort Keys | Upload | Download | API |
|---|---|---|---|---|---|---|---|---|---|
| `/json` MVP | ✅ | ✅ | ✅ | 🔜 (P2) | 🔜 (P2) | ✅ | ✅ (<5MB) | ✅ | 🔜 (P6) |
| `/xml` P6 | ✅ | ✅ | ✅ | 🔜 | 🔜 | N/A | ✅ | ✅ | 🔜 |
| `/html` P6 | ✅ | ✅ | ✅ (W3C) | N/A | 🔜 | N/A | ✅ | ✅ | 🔜 |

(P2 = Phase 2, P6 = Phase 6)

## 가이드 글 (Phase 2 MVP 10편, 각 1,500~2,500 단어, 영문)

| # | URL | 제목 (영문) | 카테고리 | 핵심 키워드 |
|---|---|---|---|---|
| 1 | `/guides/what-is-json` | What Is JSON? A Beginner's Guide to JavaScript Object Notation | basics | "what is json", "json structure" |
| 2 | `/guides/common-json-syntax-errors` | The 10 Most Common JSON Syntax Errors (and How to Fix Them) | troubleshooting | "json syntax error", "unexpected token" |
| 3 | `/guides/json-vs-yaml` | JSON vs YAML: When to Use Which Format | comparison | "json vs yaml", "yaml json difference" |
| 4 | `/guides/json-schema-basics` | JSON Schema Basics: Validating Data with Confidence | basics | "json schema", "json validation" |
| 5 | `/guides/jsonl-and-ndjson-explained` | JSONL, NDJSON, and JSON Lines: What's the Difference? | format-guide | "jsonl vs ndjson" |
| 6 | `/guides/pretty-print-vs-minify` | Pretty-Print vs Minify: Choosing the Right JSON Format | format-guide | "pretty print json", "minify json" |
| 7 | `/guides/sorting-json-keys-pros-and-cons` | Should You Sort JSON Keys? Pros, Cons, and Real-World Use Cases | strategy | "sort json keys" |
| 8 | `/guides/when-to-minify-api-payloads` | When Minifying API Payloads Actually Matters (and When It Doesn't) | strategy | "minify api json" |
| 9 | `/guides/json-escape-characters` | Escaping Strings in JSON: A Developer's Reference | basics | "json escape", "json special characters" |
| 10 | `/guides/json-vs-xml` | JSON vs XML: A Practical Comparison in 2026 | comparison | "json vs xml" |

### Phase 6 추가 (XML/HTML 확장 시)

- XML Validation Best Practices
- DTD vs XSD: Choosing the Right XML Schema
- XML Namespaces Explained
- HTML Sanitization Basics
- HTML5 vs XHTML: What Still Matters
- Pretty-Printing HTML: Formatting Rules That Won't Break Rendering

각 글 구성: ① Hook (문제 제시) → ② 개념 설명 → ③ 실제 코드 예제 2~3개 → ④ 흔한 실수 → ⑤ 내부 링크 3~5개 (도구, 용어, 다른 가이드) → ⑥ 1문장 요약.

## 용어사전 (Glossary, 30+ 항목, 각 300~600 단어, 영문)

**JSON 계열**: JSON · JSONL · NDJSON · JSON Schema · JSON Pointer · JSON Patch · JSON-LD · JSONP · BSON

**XML 계열**: XML · XSD · DTD · XSLT · XPath · XQuery · SAX · DOM · CDATA · XML Namespace

**HTML 계열**: HTML · DOCTYPE · HTML5 · XHTML · Self-Closing Tag · Void Element · Entity

**포맷 개념**: Pretty-Print · Minify · Beautify · Prettifier · Linter · Formatter · Validator · Parser · Serializer · Deserializer · Indentation · Whitespace

**Encoding / 관련**: UTF-8 · UTF-16 · BOM · Escape Sequence · Unicode Code Point

각 항목 구성: ① 1문장 정의 → ② 3~5문단 설명 + 코드 예제 → ③ "Related: " 3~5개 내부 링크 → ④ 1개 도구 페이지 CTA.

## FAQ (20+ 항목, 각 100~300 단어)

카테고리별 분포 가안:
- **Using the tool** (6): "How do I beautify JSON?", "Can I use this offline?", "Why does my JSON show an error?" 등
- **Privacy** (4): "Does my data get sent to a server?", "Do you store my inputs?" 등
- **Limits** (3): "What's the maximum file size?", "Can I beautify a 100MB JSON?" 등
- **Formats** (5): "Does this support YAML?", "How is this different from prettier?" 등
- **About AdSense/ads** (2): "Why are there ads?", "Can I disable ads?" 등

FAQ 페이지에 JSON-LD `FAQPage` 삽입 → Google 검색에서 리치 스니펫 노출 가능성 ↑.

## 콘텐츠 작성 원칙

1. **고유성(Originality)**: AI 초안 사용 시에도 각 페이지를 **반드시 사람이 편집**. 페이지 간 동일 문단 재사용 금지. 중복 콘텐츠는 AdSense 반려 사유 1위.
2. **실제 코드 예제**: 모든 가이드와 도구 페이지에 **작동하는 코드 블록** 포함. "example.json" 에 실제 값 채움.
3. **출처·레퍼런스**: 표준 문서(ECMA-404 JSON, RFC 8259, W3C XML 1.0) 링크 최소 1개.
4. **시각 자료**: 가이드마다 다이어그램·테이블·스크린샷 최소 1개. 텍스트-only 페이지는 Google 평가 낮음.
5. **날짜 관리**: frontmatter 에 `lastUpdated: 2026-XX-XX`, 페이지 하단에 "Last updated on" 표시.
6. **영문 일관성**: Title Case 는 제목·섹션, 본문은 Sentence case. 공식 스펙 용어(JSON, XML, HTML)는 대문자 유지.
7. **금지**: 과장 표현("Best JSON tool ever"), 허위 성능 수치, 저작권 침해 이미지/코드.
8. **면책**: 가이드 하단 고정 1문단 — "This guide is for informational purposes. Always validate against your runtime's official parser for production use."

## 콘텐츠 보관 구조

```
site/src/content/
├── guides/
│   ├── what-is-json.mdx
│   ├── common-json-syntax-errors.mdx
│   └── _TEMPLATE.mdx            ← 새 가이드 시작 템플릿
├── glossary/
│   ├── json.md
│   ├── jsonl.md
│   └── _TEMPLATE.md
└── faq/
    ├── using-the-tool.md
    └── privacy.md
```

### Frontmatter 스펙

```yaml
---
title: "What Is JSON? A Beginner's Guide to JavaScript Object Notation"
description: "JSON is the most common data interchange format on the web. This guide explains its structure, syntax rules, and real-world use cases with runnable examples."
category: "basics"          # basics | format-guide | troubleshooting | comparison | strategy | faq
lastUpdated: 2026-05-01
order: 1                    # 홈 피처드 우선순위 (optional)
draft: false
tags: ["json", "beginner"]
ogImage: "/og/what-is-json.png"   # Phase 4 에서 추가
---
```

`description` 은 120~160자. Google 검색 결과 meta description 으로 사용됨.

## 승인 신청 전 볼륨 목표

| 항목 | 최소 | 권장 |
|---|---|---|
| 도구 페이지 | 1 (`/json`) | 3 (`/json`, `/xml`, `/html`) |
| 가이드 글 | 10 | 15+ |
| 용어사전 항목 | 20 | 30+ |
| FAQ 항목 | 15 | 20+ |
| 법적 페이지 | 4 | 4 (고정) |
| **총 실질 페이지** | **~50** | **~70** |

(용어사전 각 항목이 별도 URL 이면 색인 페이지 수가 빠르게 늘어남 — AdSense 에 유리.)

## SEO 키워드 매트릭스 (Phase 5 제출 시점 목표)

**Primary (고경쟁)**: json beautifier, json formatter, json validator
**Secondary (중경쟁)**: pretty print json, minify json, jsonl formatter, json vs yaml
**Long-tail (저경쟁, 전환 ↑)**: "how to fix unexpected token in json", "json syntax error at line 1", "difference between json and ndjson", "should i sort json keys alphabetically"

롱테일 키워드는 가이드 글 제목·H2 에 정확히 반영.
