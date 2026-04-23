# 02. 로드맵

> Phase 0(아키텍처 의사결정)을 건너뛰면 Phase 1~3 의 산출물을 전부 이관/재작성해야 할 수 있음. 반드시 순서대로.

## Phase 0 — 기획 확정 및 아키텍처 의사결정 (0.5~1일)

- [x] `PRD.md` · `01-vision-and-scope.md` 초안 작성
- [x] `03-architecture-decision.md` 결정 완료 (2026-04-23)
  - [x] 서브도메인: **옵션 A — `beautifier.aidalabs.kr`**
  - [x] API 서브도메인: `beautifier-api.aidalabs.kr` (Phase 6)
  - [x] 백엔드 스택: **옵션 P — FastAPI + Uvicorn** (포트 8001)
  - [x] VM: **bidMaster VM 공유** — bootstrap 비파괴 모드
- [x] 도메인: **`aidalabs.kr` 서브도메인 확정** (기보유 도메인 재활용)
- [x] 호스팅: **Oracle Cloud Always Free (확정)** — bidMaster 와 동일 리전 재사용
- [x] 수익 모델 v1: **AdSense 단독** — API Pro · 제휴는 승인·트래픽 확보 후 재검토
- [ ] 브랜드명 확정 (`<SERVICE_NAME>`) — 가안 `"Beautifier — Format JSON, XML, HTML Online"`, Phase 1 스캐폴드 시 확정
- [ ] Let's Encrypt 이메일 (`<EMAIL>`) — Phase 3 bootstrap 직전 확정

## Phase 1 — 리포지토리 스캐폴드 + JSON MVP (2~3일) — **완료 2026-04-23**

플레이북 3장 "마스터 배포 시퀀스" 의 Phase 1 을 따른다. 첫 커밋은 `[skip ci]`.

- [x] `site/` 디렉터리에 Astro 5 스캐폴드
  - [x] `astro.config.mjs` — site URL, sitemap, mdx
  - [x] `tsconfig.json` — strict
  - [x] `src/content.config.ts` — guides / glossary / faq 컬렉션
  - [x] `src/layouts/BaseLayout.astro` — 영문 메타, hreflang, OG, JSON-LD 준비
  - [x] `src/components/{Callout,Steps,Step,Header,Footer}.astro`
- [x] `/` 랜딩 페이지 (영문, 카드 그리드 + CTA)
- [x] `/json` JSON beautifier 도구 페이지 (F01~F09 전체)
  - [x] 입력/결과 textarea 레이아웃 (데스크톱 좌우, 모바일 상하)
  - [x] Web Worker 에서 JSON.parse/stringify (`src/workers/json-worker.ts`)
  - [x] 구문 오류 라인/컬럼 표시 + 해당 위치로 caret 이동
  - [x] Copy / Download / Clear 버튼
  - [x] indent 2/4/Tab 드롭다운
  - [x] 다크 모드 시스템 연동 + 토글 (FOUC 방지 inline script)
  - [x] Sort keys 옵션 (F09)
  - [x] 파일 업로드 (<5MB, FileReader)
  - [x] URL 파라미터 프리필 (`?input=`)
  - [x] 키보드 단축키 (Ctrl+Enter / Ctrl+Shift+M / Ctrl+Shift+V / Ctrl+K)
- [x] `/about` `/privacy` `/terms` `/contact` (법적 페이지 4종, 영문)
  - [x] Privacy: AdSense 쿠키, GDPR, CCPA, Korea PIPA 4개 지역 커버
  - [x] Contact: FormSubmit + honeypot + 성공 리다이렉트
- [x] `/404` 커스텀 페이지 (noindex)
- [x] `public/robots.txt`, `favicon.svg`
- [x] `.github/workflows/ci.yml` — install + astro check + astro build
- [x] `.gitignore` — SSH 키, Node, Python, 에디터 파일 전부 포함
- [x] 빌드 검증: `npm run build` 통과 (7 페이지, ~900ms), 워커 번들 1.1 KB
- [ ] Lighthouse 로컬 실행 → LCP·CLS Good 확인 (**사용자 수동 확인 대상**)

## Phase 2 — 콘텐츠 가이드 10편 + 용어사전 + FAQ — **완료 2026-04-23**

- [x] `src/content/guides/*.mdx` **10편** 작성 (각 1,500~2,500 단어, 영문)
  - basics: what-is-json, json-schema-basics, json-escape-characters
  - troubleshooting: common-json-syntax-errors
  - comparison: json-vs-yaml, json-vs-xml
  - format-guide: jsonl-and-ndjson-explained, pretty-print-vs-minify
  - strategy: sorting-json-keys-pros-and-cons, when-to-minify-api-payloads
- [x] `src/content/glossary/*.md` **30 항목** (JSON/XML/HTML/encoding/formatting 전역 커버)
- [x] `src/content/faq/*.md` **20 항목** (using-the-tool 6, privacy 4, limits 3, formats 5, ads 2)
- [x] 라우트 페이지 5개: `/guides/`, `/guides/[slug]/`, `/glossary/`, `/glossary/[slug]/`, `/faq/`
- [x] 네비게이션에 Guides · Glossary · FAQ 추가
- [x] 홈 페이지에 featured guides 카드 4개 + 섹션 링크
- [x] JSON-LD: TechArticle (가이드), DefinedTerm (용어), FAQPage (faq)
- [x] 각 가이드에 실제 작동하는 코드 예제 + 내부 링크 3개 이상
- [x] 로컬 빌드 50 페이지 통과

## Phase 3 — OCI 배포 + Let's Encrypt + 첫 CI/CD (1~2일) — **사이트 라이브 2026-04-23**

플레이북 Phase 2~4 와 `06-deployment-and-domain.md` 참고.

- [x] DNS A 레코드 추가 (registrar 콘솔)
  - [x] `beautifier.aidalabs.kr` → `161.33.16.213`
  - [ ] `beautifier-api.aidalabs.kr` → (Phase 6 시작 시 등록)
- [x] OCI Security List 80/443 ingress (bidMaster 에서 이미 열려 있어 재확인만)
- [x] `deploy/nginx/beautifier.aidalabs.kr.conf` 작성 및 VM 에 업로드 (`~/beautifier-setup/`)
- [x] `deploy/scripts/bootstrap.sh` — 공유 VM 감지·비파괴 모드, 4개 사이트 공존 (`aidalabs`, `bidmaster`, `bidmaster-app`, `beautifier`)
- [x] Let's Encrypt 발급: `/etc/letsencrypt/live/beautifier.aidalabs.kr/` — 2026-07-22 만료, 자동 갱신 cron 등록
- [x] 최초 배포: 로컬 build → tar pipe → `/var/www/beautifier/` (rsync 대신 tar 로 1회성)
- [x] `https://beautifier.aidalabs.kr/` · `/json/` · `/about/` · `/privacy/` · `/terms/` · `/contact/` · `/sitemap-index.xml` · `/robots.txt` 전부 200
- [x] HTTP → HTTPS 301 리디렉트 활성
- [x] bidMaster 회귀 없음 (bidmaster.aidalabs.kr 200 유지)
- [x] `.github/workflows/deploy-site.yml` 작성 완료
- [x] GitHub repo 생성: https://github.com/aidalabs2026/beautifier (public)
- [x] GitHub Secrets 3개 등록: `OCI_HOST=161.33.16.213`, `OCI_SSH_USER=ubuntu`, `OCI_SSH_KEY` (bidMaster 와 동일 키 재사용)
- [x] 첫 `git push -u origin main` → CI 통과 · Deploy Static Site 통과 (재실행 1회, Secrets 등록 타이밍 이슈)
- [x] 자동 배포 파이프라인 가동 중: 이후 `site/**` 변경 후 push 하면 자동 rsync + nginx reload

## Phase 4 — SEO 최적화 + Search Console 등록 (1~2일)

- [ ] `@astrojs/sitemap` 으로 `/sitemap-index.xml` 자동 생성
- [ ] 페이지별 `<title>` / `<meta description>` / canonical 고유
- [ ] JSON-LD: 홈(WebSite), 도구(SoftwareApplication), 가이드(Article + HowTo), FAQ(FAQPage)
- [ ] BaseLayout 에 Google Search Console 확인 메타태그 삽입
- [ ] Search Console → 속성 추가 → 사이트맵 제출 → 주요 URL 수동 색인 요청
- [ ] PageSpeed Insights 전 페이지 Good 확인
- [ ] `robots.txt` 에 sitemap URL 명시
- [ ] GA4 (선택) — 쿠키 동의 배너 필수

## Phase 5 — 2~4주 운영 + AdSense 신청 (운영 기간 + 심사 1~4주)

플레이북 6장 요건 충족 후.

- [ ] 색인된 페이지 **10+ 이상** 확인 (Search Console Coverage)
- [ ] Core Web Vitals 모바일·데스크톱 Good 확인
- [ ] 신규 가이드 1~2편 추가 (심사 중에도 성장 중 임을 보여주기 위해)
- [ ] 법적 페이지 4종 최종 리뷰
- [ ] AdSense 계정 생성 → 사이트 등록 → 심사 제출
- [ ] 승인 번호 발급 시 `public/ads.txt` 업로드 + adsbygoogle.js `<head>` 삽입
- [ ] 반려 시: 사유 → `05-adsense-checklist.md` 재점검 → 보완 후 2~4주 간격 재신청

## Phase 6 — XML / HTML 확장 + 백엔드(FastAPI or Node) 추가 (5~10일)

**프론트엔드 포맷 도구 선공개 (2026-04-23):**

- [x] `/xml/` — XML beautify / minify / validate (DOMParser + 자체 tokenizer, CDATA·주석·PI 보존)
- [x] `/html/` — HTML5 void-element aware, `<pre>/<script>/<style>` raw 보존
- [x] 공통 포맷 유틸 `src/lib/xml-format.ts`, `src/lib/html-format.ts` (worker 없이 main-thread)
- [x] 네비게이션: JSON · XML · HTML · Guides · FAQ · About
- [x] 홈페이지 3-tool 카드 섹션
- [x] SoftwareApplication JSON-LD 각 도구 페이지
- [ ] XML / HTML 전용 가이드 작성 (Phase 2 연장선)

승인 후 또는 승인과 병행(심사 중 사이트 구조 대변경은 금지 — 작은 페이지 추가는 OK).

- [ ] `/xml` 도구 페이지 + 가이드 3편
- [ ] `/html` 도구 페이지 + 가이드 3편
- [ ] 백엔드 서브도메인 `<API_HOST>` 스캐폴드 (03 문서 결정 스택)
- [ ] `/api/v1/beautify/json` 엔드포인트 (10~100MB 파일 처리)
- [ ] Rate limit (IP 당 분당 60, 일일 500)
- [ ] `deploy/nginx/<api>.conf` + systemd 서비스
- [ ] `.github/workflows/deploy-api.yml`
- [ ] Let's Encrypt 다중 도메인 발급 (`-d <site>. -d <api>.`)
- [ ] API 문서 페이지 `/api` (영문)

## Phase 7 — 승인 후 최적화 + 추가 포맷 (지속)

- [ ] 광고 슬롯 A/B 테스트 (본문 상/중/하, 사이드)
- [ ] 자동광고 vs 수동 비교 (가이드 페이지 only)
- [ ] RPM 추적, 수익성 낮은 페이지 식별
- [ ] CSS / SQL / YAML 도구 추가 (각 2~3일)
- [ ] 공유 링크 기능 (URL 직렬화 또는 단축)
- [ ] 브라우저 확장 / CLI npm 패키지 (커뮤니티 확장)

## 예상 총 공수

| 시나리오 | 기간 | 비고 |
|---|---|---|
| 최소 MVP (JSON + 가이드 10편 + 배포) | **2~3주** 집중 | AdSense 신청 직전까지 |
| 현실 목표 (JSON + XML + HTML + 가이드 15편) | **5~7주** | 승인 + 확장 |
| 승인 대기 포함 | **신청일 +1~4주** (최대 +3개월) | 반려·재신청 시 |

## 페이즈 간 강한 의존성

- Phase 0 → 전부: 서브도메인·백엔드 결정 미확정 시 리포지토리 구조·CI/CD·Nginx 전부 수정 필요.
- Phase 1 → Phase 3: Astro build 산출물이 없으면 rsync 가 배포할 대상이 없음.
- Phase 2 → Phase 5: AdSense 승인은 Phase 2 콘텐츠 양·품질이 좌우. Phase 5 급행은 불가.
- Phase 5 → Phase 6: 심사 중 사이트 **구조 대변경 금지** — XML/HTML 페이지 **추가** 는 OK, 기존 URL/레이아웃 **변경** 은 지양.
