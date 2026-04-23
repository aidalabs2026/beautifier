# Beautifier 기획 문서

**Beautifier**는 JSON / XML / HTML 등 코드·데이터 포맷을 브라우저 안에서 beautify·minify·validate 해 주는 **영문 기본 개발자 도구 사이트**입니다. 1차 목표는 **Google AdSense 승인**, 2차 목표는 대용량 파일 처리 API 를 포함한 하이브리드 서비스로의 확장입니다.

## 현재 상태 (2026-04-23 기준)

- 프로젝트 디렉터리: `E:\01_DEV\01_claude\2026_google_ads\json-beautifier`
- 기존 코드: 없음 (신규 그린필드)
- 배포 대상: **Oracle Cloud Infrastructure (Always Free Tier)** — bidMaster 와 동일 VM **공유** (확정, 2026-04-23)
- 도메인: **`beautifier.aidalabs.kr`** (정적 사이트, AdSense 대상) + **`beautifier-api.aidalabs.kr`** (백엔드 API, Phase 6)
- 백엔드 스택: **FastAPI + Uvicorn** (포트 8001, Phase 6 도입)
- 수익 모델 v1: **AdSense 단독** — API Pro · 제휴는 승인·트래픽 확보 후 재검토
- 사이트 UI·콘텐츠 언어: **영문 (글로벌 타깃)**
- 문서 언어: 한국어 (내부 기획용)
- 운영 총비용: **연 0원** (도메인 기보유, OCI Always Free)

이 프로젝트는 옆 디렉터리 `../bidMaster/` 의 Claude 플레이북에서 검증된 배포 패턴을 그대로 재사용합니다. 플레이북 원문은 `docs/07-claude-playbook.md` 참고.

## 문서 목록

| # | 문서 | 요지 |
|---|---|---|
| — | [PRD](PRD.md) | ★ **제품 요구사항 집약판** — 한 번에 제품의 무엇·누구·왜·어떻게 파악 |
| 01 | [비전 및 범위](01-vision-and-scope.md) | 문제 정의, 타겟, 수익 모델, 성공 지표 |
| 02 | [로드맵](02-roadmap.md) | Phase 0~7, 예상 공수 |
| 03 | [아키텍처 의사결정](03-architecture-decision.md) | **★ Phase 0 필수** — 서브도메인명·백엔드 스택 옵션 |
| 04 | [콘텐츠 계획](04-content-plan.md) | 영문 사이트맵, 도구 페이지, 가이드 10편, 용어사전 30+ |
| 05 | [AdSense 체크리스트](05-adsense-checklist.md) | 영문·도구형 SaaS 특화 점검 항목 |
| 06 | [배포 및 도메인](06-deployment-and-domain.md) | 정적 + API 이중 서브도메인 Nginx·Let's Encrypt·CI/CD |
| 07 | [Claude 플레이북](07-claude-playbook.md) | bidMaster 에서 검증된 AdSense 정적 사이트 배포 메타 지도 (원본) |

## 다음 액션

Phase 0 완료. 남은 미확정 항목 2개는 Phase 1~3 중 채움:
- 브랜드명 (`<SERVICE_NAME>`) — Phase 1 스캐폴드 시 BaseLayout 에 삽입할 때 확정
- Let's Encrypt 이메일 (`<EMAIL>`) — Phase 3 bootstrap 직전 확정

**다음 단계**: `02-roadmap.md` Phase 1 착수 — Astro 스캐폴드 + JSON MVP 도구 페이지 + 법적 페이지 4종.
