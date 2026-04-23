# 01. 비전 및 범위

## 배경

"JSON/XML/HTML beautifier" 는 전 세계 개발자가 **매일 검색하는 상시 수요** 이다. 그러나 상위 노출되는 경쟁사 대부분은 (1) 광고 과밀로 모바일 UX 가 열악하거나, (2) 도구만 있고 학습 콘텐츠가 없거나, (3) Core Web Vitals 가 나빠 AdSense 친화적이지 않다. 이 3가지 약점을 **역으로 본 프로젝트의 차별화** 로 삼는다.

이 프로젝트는 bidMaster 프로젝트의 플레이북(`docs/07-claude-playbook.md`) 에서 검증된 **Astro + OCI + Let's Encrypt + GitHub Actions** 스택을 재사용하되, 콘텐츠·UI 를 **영문 글로벌 타깃**·**도구형 SaaS** 성격에 맞춰 재구성한다.

주요 방향:

- **도구 + 학습 결합**: 각 포맷(JSON/XML/HTML) 페이지에 (a) beautifier 도구, (b) 1문단 포맷 요약, (c) 가이드 링크, (d) FAQ 를 함께 배치해 SEO 깊이 확보.
- **프라이버시 우선**: MVP 는 100% 브라우저 내 처리. "Your data never leaves your browser" 를 UI 상단에 명시 — 사내 기밀 JSON 처리 수요 확보.
- **하이브리드 확장**: 대용량 파일·API 수요 대비해 Phase 6+ 에서 FastAPI 백엔드를 별도 서브도메인에 추가 (AdSense 심사 격리).

## 한 줄 비전

> **"An English-first, privacy-respecting web toolkit where a developer can format, minify, and validate JSON / XML / HTML — and learn the format while doing so."**

## 타겟 사용자

| 우선순위 | 페르소나 | 주요 니즈 |
|---|---|---|
| 1차 | 주니어~중급 백엔드·풀스택 개발자 (영어권) | API 응답 beautify, 오류 라인 표시, copy |
| 2차 | 데이터 분석가 / QA 엔지니어 | 대용량 붙여넣기, tree view, diff |
| 3차 | 비개발자 (PM, CS, 연동 담당) | "Beautify" 버튼 하나, 용어 툴팁 |
| 4차 | CS 교육 / 신입 온보딩 용도 | 가이드·glossary 직링크 공유 |

## 수익 모델

| 단계 | 모델 | 비고 |
|---|---|---|
| 1차 | Google AdSense 디스플레이 광고 | 본 프로젝트의 핵심 목표 |
| 2차 | API 유료 Pro 티어 (일일 quota 초과분) | Phase 3 이후, 실제 수요 측정 후 |
| 3차 | 개발자 도구 제휴 (Postman, Warp 등 affiliate) | 트래픽 확보 후 선택적 |
| 4차 | 브라우저 확장(Pro) 또는 데스크톱 앱 | 장기, 커뮤니티 형성 후 |

## 성공 지표

| # | 지표 | 목표 |
|---|---|---|
| 1 | AdSense 승인 | 신청 후 ≤ 3개월 내 |
| 2 | 월간 순방문자 (UV) | 승인 후 6개월 내 10,000+ |
| 3 | 평균 세션 시간 | 90초+ (도구 사이트 특성상 짧음) |
| 4 | Core Web Vitals | 전 페이지 Good |
| 5 | 색인된 페이지 수 | 승인 신청 시점 30+ |
| 6 | 월 광고 수익 | 승인 후 6개월 내 USD 50+ (의미 있는 첫 마일스톤) |
| 7 | 재방문율 (30일) | 20%+ (도구 북마크 형태 기대) |

## 범위 제외 (Non-Goals)

- **사용자 계정 / 로그인**: v1 은 전면 비회원. 세션 저장·협업·히스토리는 v2 이후 검토.
- **유료 결제 / 웹 내 과금**: AdSense 외 직접 결제 제공 없음. API Pro 는 Phase 3 이후.
- **실시간 협업 편집**: 본 프로젝트는 1인 개발자용 도구에 집중.
- **대규모 엔터프라이즈 CI/CD 통합**: prettier·jq 같은 CLI 생태계가 이미 성숙. 본 프로젝트는 "브라우저에서 빠르게" 가 포지셔닝.
- **Schema 자동 추론·코드 생성**: 깊은 인텔리전스는 유사 서비스(quicktype.io 등)가 이미 강함. 본 프로젝트의 핵심 차별화가 아님.
- **데이터 저장 / 클라우드 동기화**: 프라이버시 원칙에 반함. URL 파라미터 기반 공유만 Phase 3 에서 한정 제공.
- **비영어 UI**: MVP 는 영문 전용. Phase 5+ 에서 i18n 확장 검토.
