# PRD — Beautifier

> 본 문서는 Beautifier 서비스의 제품 요구사항을 한 파일로 집약한 **원본 소스(source of truth)** 입니다. 개별 문서(`01`~`06`) 는 이 PRD 를 세분화·실행 수준으로 풀어낸 파생 문서입니다. PRD 와 파생 문서 간 충돌 시 **PRD 가 우선**합니다.

- **문서 버전**: v0.1 (2026-04-23)
- **작성자**: 운영자 + Claude
- **상태**: 초안 — Phase 0 검토 중

---

## 1. Executive Summary

### 한줄 비전
> **"An English-first, privacy-respecting web toolkit that formats, minifies, and validates JSON and other code formats — with guides clear enough that a junior developer can learn the format while using the tool."**

### 타깃 (한 문장)
전 세계 영어권 주니어~중급 **백엔드·풀스택 개발자**, **데이터 분석가·QA 엔지니어**, 그리고 API 응답을 읽어야 하는 **비개발자 업무 담당자**.

### 성공의 정의
1. **Google AdSense 승인**을 첫 신청 후 3개월 내 획득.
2. 승인 후 6개월 내 월간 순방문자(UV) **10,000+** 달성.
3. Core Web Vitals 모든 페이지 Good (LCP < 2.5s).
4. 월 광고 수익 첫 마일스톤 **USD 50+** 도달.

---

## 2. Problem Statement

### 시장 현황
"JSON beautifier" / "XML formatter" / "HTML prettifier" 관련 검색은 월 수백만 회 발생하지만, 기존 1위권 사이트(jsonformatter.org, codebeautify.org, jsonlint.com, freeformatter.com)들은 다음 문제를 갖고 있다.

| 경쟁사 | 관찰된 한계 |
|---|---|
| jsonformatter.org | 광고 과밀 (스크롤 전 화면 절반 광고), 모바일 UX 열악 |
| codebeautify.org | 수백 개 도구를 몰아넣어 도메인 권위는 높지만 개별 페이지 품질 편차 큼 |
| jsonlint.com | JSON 전용이라 확장 포맷(XML/HTML/YAML) 없음, UI 2010년대 잔존 |
| freeformatter.com | 광고 차단 시 도구가 부분 동작, Core Web Vitals 나쁨 |

### 본 프로젝트의 포지션
- **얇은 도구 + 광고** 조합이 아니라, **도구 + 각 포맷 학습 가이드 + 실수 사례**를 함께 제공해 SEO 깊이 확보.
- **100% 클라이언트 처리** 를 UI 에 명시 ("Your data never leaves your browser") → 사내 기밀 JSON 을 다루는 개발자에게 신뢰 획득.
- **First Contentful Paint 0.5s 이하** 를 설계 목표로 잡아 Core Web Vitals 에서 경쟁사 대비 우위.

### 왜 지금인가
- AdSense 는 최근 "value-added content" 심사를 강화, **도구만 있는 얇은 사이트는 반려** 사례 증가. 본 프로젝트는 가이드·용어사전을 함께 제공해 이 장벽을 역으로 진입 장벽으로 활용.
- Astro 5 / Content Collections / Islands 가 성숙해 정적 + 국지적 인터랙션 조합이 1인 개발로 충분히 가능.

---

## 3. Target Users

| 우선순위 | 페르소나 | 주요 상황 | 니즈 |
|---|---|---|---|
| 1차 | 주니어~중급 백엔드 개발자 | API 응답 디버깅, 로그 분석 | 빠른 JSON beautify + syntax error 라인 번호 + copy 버튼 |
| 2차 | 데이터 분석가 | CSV/JSON 변환, 로그 파일 가독성 확보 | 대용량 붙여넣기, tree view, 검색 |
| 3차 | QA 엔지니어 | REST API 응답 비교, XML 스키마 검증 | diff view, validate 전용 모드 |
| 4차 | 비개발자 업무 담당자 | 연동 담당 업체가 보낸 JSON/XML 을 읽어야 함 | "beautify" 버튼 하나로 끝, 용어 툴팁 |
| 5차 | CS·교육 목적 | 학생·신입 교육 자료 링크 | 가이드 글·glossary 직링크 가능성 |

**명시적 비타깃**: 대규모 엔터프라이즈 CI/CD 파이프라인 사용자 (이 층은 prettier/jq 같은 CLI 를 씀).

---

## 4. User Stories

모든 스토리는 `As a <persona>, I want <capability>, so that <outcome>.` 형식.

### MVP (Phase 1)
1. 백엔드 개발자로서, 붙여넣은 JSON 이 **즉시** beautify 돼 결과가 에디터에 나타나기를 원한다 — API 응답을 빠르게 읽기 위해.
2. 백엔드 개발자로서, JSON 에 문법 오류가 있으면 **몇 번째 줄·어느 문자**에서 오류인지 보고 싶다 — 디버깅 시간 단축.
3. QA 엔지니어로서, 결과를 **한 번의 클릭으로 클립보드 복사**하고 싶다 — 티켓에 붙여넣기 위해.
4. 데이터 분석가로서, beautify 결과를 **파일로 다운로드**하고 싶다 — 로컬 저장.
5. 개발자로서, **indent 2 칸 / 4 칸 / Tab** 중 선택하고 싶다 — 팀 컨벤션 준수.
6. 개발자로서, **Minify** 버튼으로 반대 방향(공백 제거) 도 쓰고 싶다 — HTTP payload 축소.
7. 프라이버시 민감 사용자로서, 내 데이터가 **서버로 전송되지 않는다**는 표시를 상단에서 보고 싶다.

### Phase 2 (XML / HTML 확장 후)
8. 개발자로서, XML beautify 에서 **self-closing tag 유지 여부** 를 선택하고 싶다.
9. 프론트 개발자로서, HTML beautify 결과에서 **inline style/script 포함 여부** 를 선택하고 싶다.
10. QA 로서, 두 JSON 을 **좌우 diff view** 로 비교하고 싶다.
11. 개발자로서, JSON 을 **tree/collapsible view** 로 접었다 펼치고 싶다 — 깊은 구조 탐색.

### Phase 3 (백엔드 API)
12. 개발자로서, **10MB 이상 파일도 업로드해 beautify** 하고 싶다 — 브라우저 메모리 한계 돌파.
13. CI 운영자로서, **REST API** 로 호출해 beautify 결과를 자동화에 쓰고 싶다.
14. 연구·교육 목적으로, **공유 가능한 URL** 로 beautify 결과를 남에게 보여주고 싶다 (원문 URL 파라미터 저장 또는 단축).

---

## 5. Functional Requirements

### 5-1. MVP (Phase 1 — 클라이언트 only, JSON 단일 포맷)

| # | 기능 | 설명 | 우선순위 |
|---|---|---|---|
| F01 | JSON Beautify | indent 선택(2/4/Tab), 결과 에디터 표시 | Must |
| F02 | JSON Minify | 공백·개행 제거, 결과 에디터 표시 | Must |
| F03 | JSON Validate | 구문 오류 시 라인·컬럼·메시지 표시 | Must |
| F04 | 입력 방법 | 붙여넣기 / 파일 업로드(<5MB) / URL 파라미터(`?input=`) | Must |
| F05 | 결과 Copy | 클립보드 복사 버튼 | Must |
| F06 | 결과 Download | `.json` 파일 다운로드 | Must |
| F07 | 입력 Clear | 에디터 초기화 | Must |
| F08 | 다크 모드 | 시스템 설정 연동 + 수동 토글 | Should |
| F09 | Key 정렬 | 객체 키를 알파벳 정렬 옵션 | Should |
| F10 | 이스케이프 처리 | `\"` 포함된 문자열 파싱 옵션 (JSON-in-JSON) | Could |

### 5-2. Phase 2 (XML / HTML 추가 + 부가 기능)

| # | 기능 | 설명 | 우선순위 |
|---|---|---|---|
| F11 | XML Beautify / Minify / Validate | DOCTYPE·CDATA·주석 보존, self-closing 옵션 | Must |
| F12 | HTML Beautify / Minify | inline style/script 보존 옵션, HTML5 doctype 인식 | Must |
| F13 | Tree View (JSON) | 접고 펼치는 계층 뷰, 노드 경로 표시 | Should |
| F14 | Diff View | 좌우 비교, 추가/삭제/변경 색상 표시 | Should |
| F15 | Validate-only 모드 | beautify 없이 검증만 수행 | Should |

### 5-3. Phase 3 (백엔드 API)

| # | 기능 | 설명 | 우선순위 |
|---|---|---|---|
| F16 | 대용량 업로드 | 10~100MB 파일 서버 처리, 스트리밍 응답 | Must |
| F17 | REST API | `POST /api/v1/beautify/json` 등, 일일 무료 quota + API key Pro | Must |
| F18 | 공유 링크 | 입력·옵션 직렬화 후 단축 URL 생성 | Could |
| F19 | CSS/SQL/YAML 포맷 | 추가 포맷 지원 | Could |

### 5-4. 상시 요구사항

- 모든 포맷 도구 페이지는 **동일 UI 레이아웃** (입력 좌/결과 우, 모바일에서는 상/하) 을 따른다.
- 각 페이지 상단에 해당 포맷의 1문단 요약 + "Learn more" 가이드 링크.
- 각 페이지 하단에 **동일 포맷 가이드 3편 추천** 블록 (내부 링크 깊이 확보).

---

## 6. Non-Functional Requirements

### 6-1. 성능

| 지표 | 목표 | 측정 방법 |
|---|---|---|
| LCP | < 1.5s (목표), < 2.5s (허용) | PageSpeed Insights (모바일) |
| CLS | < 0.05 | PageSpeed Insights |
| INP | < 200ms | PageSpeed Insights |
| 초기 JS 번들 (gzip) | < 50KB (랜딩), < 150KB (에디터 페이지) | build artifact 측정 |
| Beautify 1MB JSON | < 200ms | 실기 벤치 |

### 6-2. 프라이버시 / 보안

- MVP 단계에서는 모든 파싱이 **브라우저 내** 에서 수행. 서버 전송 로그 없음.
- 에디터 페이지 상단에 "Your data never leaves your browser." 고정 배지.
- Phase 3 에서 서버 업로드 경로 도입 시에는 별도 **opt-in 체크박스** 와 처리 로그 즉시 삭제 정책 (메모리 처리, 디스크 미기록) 명시.
- Content Security Policy(CSP), HSTS, `Permissions-Policy` 기본 세팅.

### 6-3. 접근성

- WAI-ARIA: 에디터 textarea 에 적절한 label, 버튼에 aria-label.
- 키보드 단축키: `Ctrl/Cmd + Enter` beautify, `Ctrl/Cmd + Shift + M` minify, `Ctrl/Cmd + /` 옵션 패널.
- 색상 대비 WCAG AA 이상 (다크/라이트 양쪽).

### 6-4. SEO

- 각 도구 페이지 고유 `<title>`, `<meta description>`, canonical.
- JSON-LD `SoftwareApplication` + `HowTo` + `FAQPage` 혼합.
- `/sitemap.xml` 자동 생성, Search Console 자동 제출(또는 수동 1회).
- 내부 링크 구조: 도구 페이지 ↔ 가이드 ↔ 용어사전 3방향 연결.

### 6-5. i18n

- MVP 는 **영문 단일 (`lang="en"`)**. Phase 5 이후 한국어 추가 검토 시 `hreflang` 세팅.

---

## 7. UI / UX Principles

### 7-1. 레이아웃

```
┌─────────────────────────────────────────────┐
│ Header:  Beautifier | JSON | XML | HTML | Guide | About │
├─────────────────────────────────────────────┤
│ [🔒 Your data never leaves your browser]    │
├────────────────────┬────────────────────────┤
│ INPUT              │ OUTPUT                 │
│ ┌──────────────┐   │ ┌──────────────┐       │
│ │ textarea     │   │ │ readonly     │       │
│ │              │   │ │              │       │
│ └──────────────┘   │ └──────────────┘       │
│ [Paste] [Upload]   │ [Copy] [Download]      │
├────────────────────┴────────────────────────┤
│ [Beautify] [Minify] [Validate] | Indent: 2▾ │
├─────────────────────────────────────────────┤
│ Error bar (if any): Line 12, col 4: ...     │
├─────────────────────────────────────────────┤
│ Below-the-fold: What is JSON + FAQ          │
└─────────────────────────────────────────────┘
```

- **모바일**: 입력/결과가 세로 스택.
- **초기 포커스**: 입력 textarea.
- **빈 상태**: textarea 에 placeholder 로 샘플 JSON 제시.

### 7-2. 색상·테마

- 라이트 모드 기본, 다크 모드 시스템 연동 + 헤더 토글.
- 브랜드 컬러: 아직 미정 (03 문서에서 확정). 중립적인 slate + accent blue 를 가안으로.

### 7-3. 키보드 단축키

| 키 | 동작 |
|---|---|
| `Ctrl/Cmd + Enter` | Beautify |
| `Ctrl/Cmd + Shift + M` | Minify |
| `Ctrl/Cmd + Shift + V` | Validate |
| `Ctrl/Cmd + K` | 입력 초기화 |

### 7-4. 광고 배치 (AdSense 승인 후)

- **본문 위·아래** 슬롯, **사이드바 1개**, 기사형 가이드에 본문 중단 1개.
- **도구 화면 first fold 내 광고 금지** — 본 프로젝트의 차별점 유지.
- 자동광고는 가이드 페이지에만 허용, 도구 페이지는 수동 슬롯 only.

---

## 8. Data & Privacy

- **클라이언트 처리 원칙 (MVP)**: 입력한 코드·텍스트는 페이지 세션 메모리에만 존재. `fetch` / `XHR` 로 외부 전송 없음.
- **분석 툴**: GA4 (익명화된 `_ga` 쿠키) + Search Console (쿠키 없음). 사용자 입력 자체는 절대 수집하지 않는다.
- **Phase 3 서버 처리 시**: 명시 동의 체크박스. 서버는 메모리에서만 처리하고 디스크 미기록. 로그는 IP·요청시각·상태코드만.
- **쿠키 동의 배너**: GDPR/ePrivacy 대응을 위해 EU 사용자에게 쿠키 배너 노출 (Cookie Consent v3 등 무료 솔루션).

---

## 9. Success Metrics

| 단계 | 지표 | 목표 | 측정 시점 |
|---|---|---|---|
| 1 | AdSense 승인 | 첫 신청 후 ≤ 3개월 | Phase 5 이후 |
| 2 | 월간 순방문자 (UV) | 승인 후 6개월 내 10,000+ | Search Console + GA4 |
| 3 | 평균 세션 시간 | 90초 이상 (도구 사이트 특성상 짧음) | GA4 |
| 4 | 핵심 페이지 이탈률 | 도구 페이지 < 65%, 가이드 페이지 < 55% | GA4 |
| 5 | Core Web Vitals | 전 페이지 Good | Search Console "Core Web Vitals" |
| 6 | 월 광고 수익 | 승인 후 6개월 내 USD 50+ | AdSense 리포트 |
| 7 | 색인 페이지 수 | Phase 5 종료 시 30+ | Search Console Coverage |

---

## 10. Out of Scope

v1 에서는 다음을 의도적으로 제외한다:

- 사용자 계정 / 로그인 / 저장된 히스토리
- 유료 결제 (Pro 티어는 Phase 3 이후 검토)
- 협업 편집 (동시 편집, 공유 워크스페이스)
- 데스크톱/모바일 네이티브 앱
- 데이터베이스 (MVP 는 상태 없음 stateless)
- Full-text search 서버 (Algolia 등 — 불필요, 가이드 목록이 30개 수준)
- 고급 코드 인텔리전스 (자동완성, 스키마 기반 린팅) — 장기 고려

---

## 11. Risks & Mitigations

| # | 리스크 | 영향 | 확률 | 대응 |
|---|---|---|---|---|
| R01 | "JSON beautifier" 키워드 경쟁 과포화 | SEO 유입 저조 | High | 롱테일 키워드·가이드 중심, 번들 크기·UX 차별화 |
| R02 | AdSense 심사 반려 (가치 부족) | 수익 모델 지연 | Med | 가이드 10편·용어 30+·법적 페이지 완비 후 신청 |
| R03 | AdSense 반려 반복 → 같은 도메인 블랙리스트 | 치명 | Low | 첫 신청 품질 극대화, 반려 시 충분 보완 후 4주+ 대기 |
| R04 | Astro 대형 JSON 처리 시 메인 스레드 블록 | UX 저하 | Med | Web Worker 에서 파싱/포맷 수행 |
| R05 | 프라이버시 문구가 법적 검토 부족 | 약관 리스크 | Low | Privacy Policy 에 "메모리 내 처리" 를 과장 없이 기술, 법률자문 문구 포함 |
| R06 | 백엔드 추가 시 abuse (무한 API 호출) | OCI 대역폭 소진 | Med | Rate limit (IP 당 분당 60회), Cloudflare 무료 WAF |
| R07 | Content 중복 (AI 초안 그대로 사용) | AdSense 반려 사유 | High | 각 가이드 편집·고유 예시 포함 필수, 공개 전 수동 리뷰 |

---

## 12. Decision Log

아래 표에 제품 관련 의사결정을 누적 기록. 새 결정은 상단에 추가.

| 일자 | 항목 | 결정 | 대안 | 사유 |
|---|---|---|---|---|
| 2026-04-23 | 도메인 전략 | `aidalabs.kr` 서브도메인 재사용 | 신규 `.com` 구매 | 비용 0, 플레이북·bidMaster 인프라 재활용 |
| 2026-04-23 | MVP 포맷 범위 | JSON 우선, XML/HTML 단계 확장 | 풀셋 동시 | 품질 집중·AdSense 승인 속도 우선 |
| 2026-04-23 | 문서 언어 | 한국어 (기획), 영문 (사이트 콘텐츠) | 전부 영문 | 내부 기획용은 한국어가 작성 속도 ↑ |
| 2026-04-23 | 아키텍처 | 정적 + 백엔드 하이브리드 (플레이북 옵션 C 계열) | 100% 클라이언트 | 대용량 파일·API 제공 위해 서버 필요 |
| 2026-04-23 | 서브도메인 이름 | 옵션 A — `beautifier.aidalabs.kr` | B (`jsonbeautifier`) / C (`format`) | 범용성·확장성 우선. XML/HTML 확장 시 이름 미스매치 없음 |
| 2026-04-23 | 백엔드 스택 | 옵션 P — FastAPI + Uvicorn (포트 8001) | N (Node/Hono) | bidMaster VM 의 Python 환경 재활용, 대용량 JSON 에 `orjson` 활용 |
| 2026-04-23 | API 서브도메인 | `beautifier-api.aidalabs.kr` (Phase 6 도입) | — | 광고 서브도메인과 API 서브도메인 분리 원칙 |
| 2026-04-23 | VM | bidMaster VM 공유 | 신규 VM 별도 생성 | 비용 0, bootstrap 비파괴 모드 |
| 2026-04-23 | 수익 모델 v1 | AdSense 단독 | + Pro 티어 / + Affiliate | MVP 는 승인 획득 집중. 유료 API·제휴는 승인·트래픽 확보 후 재검토 |

---

## 13. 부록 — 용어

- **Beautify** = 들여쓰기·줄바꿈을 적용해 사람이 읽기 쉽게 만드는 변환
- **Minify** = 공백·주석·개행을 제거해 전송 크기를 줄이는 변환
- **Validate** = 구문 규칙 준수 여부를 검사하고 오류 위치를 반환
- **Tree view** = 계층 구조를 접고 펼칠 수 있는 브라우저 내 시각화
- **Diff view** = 두 텍스트를 병렬로 보여주고 차이를 강조
