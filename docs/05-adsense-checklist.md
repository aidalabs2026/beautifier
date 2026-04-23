# 05. AdSense 승인 체크리스트

신청 버튼을 누르기 전 이 문서의 모든 박스를 통과할 것. 반려 후 재신청은 2~4주 간격이 권장되므로 **첫 신청 품질이 가장 중요**.

영문 글로벌 사이트·도구형 SaaS 로서 특별히 주의할 항목은 각 섹션에 ⚠️ 표시.

## 1. 사이트 완성도

- [ ] 모든 주요 페이지에 실제 콘텐츠 존재 — "Coming Soon" / lorem ipsum 없음
- [ ] 헤더·푸터에서 모든 주요 페이지 접근 가능 (Home, JSON, Guides, About, Privacy, Terms, Contact)
- [ ] 깨진 내부·외부 링크 없음 (`lychee` 또는 브라우저 링크 체커)
- [ ] 커스텀 404 페이지 (영문, 홈으로 돌아가기 링크)
- [ ] 모바일 반응형 (전 페이지, Chrome DevTools 에서 iPhone SE 기준 확인)
- [ ] ⚠️ **도구 페이지가 실제 작동**: JS 비활성 환경에서도 "Please enable JavaScript" 안내 메시지 노출 (기본 HTML 이 깨지지 않도록)

## 2. 필수 법적 페이지 (영문)

- [ ] **About** — 운영자, 사이트 목적, 연락 수단
- [ ] **Privacy Policy**
  - [ ] 쿠키 사용 명시
  - [ ] **Google AdSense cookies** 문구 포함 (필수)
  - [ ] Google Analytics 사용 시 GA 명시
  - [ ] 제3자 광고주 언급
  - [ ] ⚠️ **GDPR / ePrivacy 표현**: "If you are an EU resident..." 단락 포함
  - [ ] ⚠️ **CCPA 표현**: "If you are a California resident..." 단락 포함
  - [ ] ⚠️ **Data processing location**: "All beautify/minify operations happen in your browser. No input data is sent to our servers unless you explicitly opt in to the API." 명시
- [ ] **Terms of Service** — 면책, 콘텐츠 사용 범위, "as is" 표현
- [ ] **Contact** — 이메일 또는 FormSubmit 폼

## 3. 콘텐츠 품질

- [ ] 모든 콘텐츠가 **고유(original)** — 다른 사이트 복붙 전무 (Copyscape / 수동 샘플 검증)
- [ ] 페이지당 최소 500 단어 (가이드는 1,500+)
- [ ] 총 실질 페이지 **30+** (가이드 10+, 용어 20+, 도구 1+, 법적 4, 홈 1)
- [ ] 오탈자·비문 최소화 (Grammarly 무료 플랜 1회 통과)
- [ ] 저작권 침해 이미지 없음 (자체 SVG / Unsplash / undraw.co 등 라이선스 확인)
- [ ] ⚠️ **도구형 사이트 특유 리스크** — "얇은 콘텐츠(thin content)" 판정 방지: 도구 페이지도 하단에 **2~3 문단 이상 설명 + FAQ 5+** 추가
- [ ] ⚠️ **경쟁사와의 차별화 가시성**: About 페이지에 "What makes this different" 섹션 (광고 적음, 프라이버시 우선, 가이드 결합)

## 4. 금지 콘텐츠 회피

- [ ] 성인 / 도박 / 해킹 / 불법 약물 콘텐츠 없음
- [ ] 저작권 침해 콘텐츠 없음 (스택 오버플로우 답변 복붙 금지 포함)
- [ ] 클릭베이트 / 오해 유도 제목 없음
- [ ] 신청 전 **타사 광고·과도한 어필리에이트 링크 없음** (AdSense 는 "기존에 광고 수익화된 사이트" 를 반려함)
- [ ] 성능 과장 표현 없음 ("Fastest", "Best" 는 비교 근거 없으면 지양)
- [ ] ⚠️ **암호화폐 관련 링크·위젯 없음** (최근 심사에서 반려 사유로 자주 등장)

## 5. 기술 요건

- [ ] HTTPS 적용 (Let's Encrypt, 유효 기간 > 30일)
- [ ] `/sitemap.xml` 또는 `/sitemap-index.xml` 생성 및 접근 가능
- [ ] `/robots.txt` 존재 + 크롤링 허용 + sitemap URL 명시
- [ ] Google Search Console 속성 등록 및 소유 확인
- [ ] **색인된 페이지 10+ 이상** (Search Console Coverage 확인)
- [ ] PageSpeed Insights 모바일·데스크톱 모두 **Good**
  - [ ] LCP < 2.5s
  - [ ] CLS < 0.1
  - [ ] INP < 200ms
- [ ] 각 페이지 고유 `<title>`, `<meta description>`, `<link rel="canonical">`
- [ ] OG 태그 (og:title, og:description, og:image, og:url)
- [ ] JSON-LD 구조화 데이터 (SoftwareApplication, Article, FAQPage 등)
- [ ] ⚠️ **hreflang 처리**: 영문 단일 사이트라도 `<html lang="en">` 명시, i18n 미사용

## 6. 도메인 / 운영자

- [ ] 신청 Google 계정과 사이트 소유자 확인 가능 (About / Contact 페이지에 명시)
- [ ] 도메인 WHOIS 에 문제 없음
- [ ] ⚠️ **서브도메인 단위 색인 확인**: `<SITE_HOST>` 자체가 Search Console 속성으로 등록되어 있고 색인 페이지 10+
- [ ] 서브도메인 운영 기간: **최소 2~4주 이상 지속 운영** 후 신청
- [ ] ⚠️ **광고 대상 서브도메인 격리**: `<API_HOST>` 에는 광고 없음, 신청 시 서브도메인 지정 `<SITE_HOST>` 만

## 7. AdSense 관련 파일

- [ ] 승인 후 `ads.txt` 루트 업로드 준비 (게시자 ID 발급 직후 반영)
- [ ] 신청 시 삽입하는 확인 코드(`adsbygoogle.js`) 위치 확정 (`<head>` 내 BaseLayout 에 전역)
- [ ] 승인 후 광고 슬롯 위치 설계서 (본 문서 9장 참고)

## 8. 신청 중 / 신청 후

- [ ] 심사 중 사이트 구조·URL 을 크게 변경하지 않음 (새 페이지 추가는 OK)
- [ ] 심사 기간 동안 **동일 IP·동일 계정으로 반복 신청 금지**
- [ ] 반려 메일의 사유 코드 확인 → 이 체크리스트 재점검 → 보완 후 **2~4주 간격** 재신청
- [ ] 승인 후 ads.txt 업로드 → 72시간 내 Google 크롤링 확인

## 9. 흔한 반려 사유와 대응 (도구형 사이트 특화)

| 사유 | 대응 |
|---|---|
| "Low-value content" / "가치 있는 콘텐츠 부족" | 가이드·용어사전 확대, 각 도구 페이지 하단 2~3 문단 설명 + FAQ 추가 |
| "Site does not comply with Google policies" | 법적 페이지 4종 재점검, 쿠키·AdSense·제3자 광고 문구 완비 |
| "Duplicate content" | AI 초안 수동 편집, 페이지 간 동일 문단 제거, canonical 재점검 |
| "Navigation difficult" | 헤더·푸터 링크 확충, 각 페이지에 연관 글 블록, Breadcrumb 추가 |
| "Site under construction" | "Coming Soon" / lorem ipsum 제거, 빈 페이지 삭제 |
| "Insufficient content" | 최소 30 페이지 확보. 도구만 있고 글 없는 구조는 대부분 반려 |
| ⚠️ "No ads on site" 는 반려 사유 아님 (일부 포럼 오해) | 첫 심사 전에는 AdSense 스니펫만 삽입하고 실제 광고는 없어도 됨 |

## 10. 영문 사이트 특유 주의점

- **명확한 Country/Region 표시 없음**: 영문 글로벌 사이트는 특정 국가 법 적용이 모호 → Privacy Policy 에 "We operate this site from [KR]. Depending on your jurisdiction, you may have additional rights under GDPR, CCPA, or similar laws." 포함.
- **운영자 표기**: About 페이지에 실명 또는 브랜드명 + 연락 이메일. 익명 블로그는 AdSense 에서 "소유권 불명확" 으로 반려 빈번.
- **사이트 나이**: 새 도메인은 승인 지연 가능성 ↑. `aidalabs.kr` 은 연령 누적 있으나 서브도메인은 신규이므로 **Search Console 색인 성숙 (2~4주) 을 꼭 기다릴 것**.

## 11. 한국 운영자 관련 추가 고려 (운영자 법적 환경)

- [ ] 개인정보처리방침은 **영문 + (선택) 한국어 참조 링크** — 한국 개인정보보호법 근거 문구는 `/privacy` 끝부분 1문단으로.
- [ ] 사업자등록 유무에 따른 사업자 정보 표기 검토 (한국 e-commerce 법규 관점 — 본 사이트는 판매 행위 없어 사업자등록 의무 없음이 일반론).
- [ ] 지급 받을 Google AdSense 계정은 한국 은행 계좌·주민등록 세금정보로 셋업.

## 12. 1일 사전 리허설 (신청 전 24시간 내)

1. [ ] 전 페이지 모바일 렌더링 수동 확인
2. [ ] PageSpeed Insights 3회 측정해 LCP 변동폭 확인
3. [ ] Search Console Coverage · Enhancements 경고 0개
4. [ ] 도구 페이지에서 대용량 JSON(1MB, 10MB) 붙여넣기 → 크래시 없음
5. [ ] FormSubmit contact 폼 실제 제출 → 이메일 수신 확인
6. [ ] 브라우저 쿠키 전체 삭제 후 첫 방문 체험 — 3초 내 유용성 느껴지는지
