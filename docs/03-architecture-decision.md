# 03. 아키텍처 의사결정

> **Phase 0 에서 반드시 결론을 내야 하는 문서.** 뒤늦은 전환은 리포지토리 구조·Nginx·CI/CD 파일명을 전부 이관해야 함.

## 문제

본 프로젝트는 다음 제약을 동시에 만족해야 한다:

- **AdSense 승인 가능**한 정적 콘텐츠 사이트 (영문)
- **대용량 파일·REST API** 제공을 위한 백엔드
- **OCI Always Free** 한도 내 운영 (추가 비용 0)
- bidMaster 가 이미 사용 중인 같은 VM 을 **공유** 해도 기존 사이트 파괴 없음

플레이북 기준 **옵션 C (하이브리드)** 에 해당. 본 문서는 하위 결정을 옵션 제시한다.

## 전제: 호스팅은 OCI Always Free (확정)

OCI Ampere A1 인스턴스 1대를 bidMaster 와 공유. 동일 VM 에서 server_name 분기로 다음 3개 서비스를 공존:

```
bidMaster: 기존 사이트 (Streamlit 또는 Astro) + 부속 앱
Beautifier: 본 프로젝트 정적 사이트
Beautifier API: 본 프로젝트 백엔드 서브도메인
```

Nginx `sites-enabled/` 를 파괴하지 않는 것이 부트스트랩 스크립트의 핵심 요구사항이다 (플레이북 5-4).

## 옵션 1 — 서브도메인 이름

### 옵션 A. `beautifier.aidalabs.kr` ⭐ 권장 후보 1

| 항목 | 내용 |
|---|---|
| 장점 | 범용(JSON/XML/HTML 모두 커버), 확장 시 이름 유지, 브랜드명 = 호스트명 |
| 단점 | "JSON" 키워드 정확 매칭 점수 약간 손실 |
| SEO | 도메인 키워드는 현대 구글에서 순위 기여도 낮음 → 크게 불리하지 않음 |
| API | `beautifier-api.aidalabs.kr` (대시 분리) |

### 옵션 B. `jsonbeautifier.aidalabs.kr` ⭐ 권장 후보 2 (단기 SEO ↑)

| 항목 | 내용 |
|---|---|
| 장점 | "JSON beautifier" 검색 시 호스트명 정확 매칭 → 초기 유입에 약간 유리 |
| 단점 | XML/HTML 확장 시 브랜드·호스트 미스매치 ("jsonbeautifier" 가 XML 도?) |
| SEO | Phase 1~5 JSON 단독 시기에만 유리, Phase 6 확장 시 이름 재브랜딩 필요 |
| API | `jsonbeautifier-api.aidalabs.kr` |

### 옵션 C. `format.aidalabs.kr` 또는 `pretty.aidalabs.kr`

| 항목 | 내용 |
|---|---|
| 장점 | 짧음, 브랜딩 유연, 확장성 ↑ |
| 단점 | 검색 노출 약함, 추상적 |
| API | `format-api.aidalabs.kr` |

## 옵션 2 — 백엔드 기술 스택

(Phase 6 에 도입 예정, 본 문서에서 미리 확정하면 디렉터리 구조·CI/CD 를 일관되게 설계 가능)

### 옵션 P. FastAPI + Uvicorn (Python) ⭐ 권장

| 항목 | 내용 |
|---|---|
| 장점 | bidMaster 가 Python/Streamlit 사용 중이면 VM 의 Python 생태계 재활용. Uvicorn 성능 충분. |
| 장점 | 대용량 JSON 파싱에 `orjson`, XML 에 `lxml` 등 고성능 라이브러리 풍부 |
| 단점 | Node 백엔드와 달리 프론트·백엔드 언어 분리 |
| 포트 | 기본 `8001` (bidMaster 8501 과 겹치지 않도록) |
| 배포 | systemd 서비스, venv, bootstrap 에서 `sudoers` drop-in |

### 옵션 N. Node.js + Hono (또는 Fastify)

| 항목 | 내용 |
|---|---|
| 장점 | 프론트(Astro)와 동일 언어, 타입 공유 용이 |
| 장점 | Hono 는 번들 수십 KB, 초경량. `prettier`·`js-beautify` 등 포맷 라이브러리를 서버에서도 재사용 가능 |
| 단점 | 대용량 JSON 파싱 성능은 Python `orjson` 대비 약세 |
| 포트 | 기본 `3001` |

## 옵션 3 — 광고 대상 서브도메인과 API 서브도메인 분리 (확정 전제)

**AdSense 는 서브도메인 단위 심사.** API 서브도메인에 광고 미삽입, 도구·가이드 서브도메인에만 삽입.

```
<SITE_HOST>   (광고 대상, Astro 정적 빌드)
<API_HOST>    (광고 없음, API only, CORS 로 <SITE_HOST> 에서 호출)
```

이 분리는 **옵션 1·2 의 어느 조합에서도 동일 적용**. 심사 리스크 격리를 위해 반드시 별도 서브도메인.

## 권장 조합

**옵션 A + 옵션 P**:
- `beautifier.aidalabs.kr` (정적 사이트)
- `beautifier-api.aidalabs.kr` (FastAPI, 포트 8001)

근거:
1. 제품 이름·호스트명 일치 → 브랜딩 혼선 없음.
2. XML/HTML 로 확장 시 이름 재작명 불필요.
3. FastAPI 는 대용량 JSON 처리에서 `orjson` 가속이 즉시 가능, bidMaster VM 의 Python 환경 재활용.
4. Phase 6 백엔드 도입 전까지는 `beautifier-api.aidalabs.kr` DNS 만 예약해두고 실제 서비스는 나중에 올림 — 비용·복잡도 증가 없음.

## 옵션 B 가 정당화되는 조건

- JSON 단일 포맷으로 **6개월 이상** 운영하며 "JSON beautifier" SEO 를 극한까지 파겠다 → 호스트명 정확 매칭을 활용.
- Phase 6 XML/HTML 확장 시 **별 서브도메인**(예: `xmlbeautifier.aidalabs.kr`) 으로 분리 운영 의지가 있음.

## 옵션 N 이 정당화되는 조건

- 팀·운영자가 **Python 을 쓰지 않는다** 거나, Astro 와 백엔드 간 타입 공유(zod 스키마 재사용) 가 중요하다고 판단.

## 의사결정 체크리스트

- [x] 옵션 1 (서브도메인) 확정 — **A** (`beautifier.aidalabs.kr`)
- [x] 옵션 2 (백엔드 스택) 확정 — **P** (FastAPI + Uvicorn, 포트 8001)
- [x] bidMaster VM 공유 — **공유**. 부트스트랩은 "비파괴 모드"로 작성 필수
- [ ] 브랜드명 확정 (UI 표시용) — 가안 `"Beautifier — Format JSON, XML, HTML Online"`, Phase 1 스캐폴드 시점에 최종 확정
- [x] 아래 "결정 기록"에 최종 선택과 사유 기재

## 결정 기록

| 항목 | 결정 |
|---|---|
| 서브도메인 (옵션 1) | **옵션 A — `beautifier.aidalabs.kr`** |
| 백엔드 스택 (옵션 2) | **옵션 P — FastAPI + Uvicorn** (포트 `8001`) |
| API 서브도메인 | `beautifier-api.aidalabs.kr` (Phase 6 도입) |
| VM | **bidMaster VM 공유** (동일 Ampere A1, Nginx `server_name` 분기) |
| 브랜드명 (`<SERVICE_NAME>`) | 가안 `"Beautifier — Format JSON, XML, HTML Online"` (Phase 1 확정) |
| 수익 모델 (v1) | AdSense 단독. API Pro·제휴는 승인·트래픽 확보 후 재검토 |
| 결정일 | **2026-04-23** |

### 결정 사유 요약

1. **옵션 A**: XML/HTML/CSS/SQL/YAML 단계 확장 로드맵에서 호스트명 재작명이 불필요. 브랜드명과 호스트명 일치로 AdSense 심사·운영에서 정체성 명확.
2. **옵션 P**: bidMaster VM 의 Python 환경을 재활용하면 별도 Node 런타임 설치 불필요. 대용량 JSON/XML 처리에 `orjson`·`lxml` 가속 즉시 사용 가능.
3. **VM 공유**: 추가 비용 0. `aidalabs.kr` 의 모든 프로젝트를 단일 VM 에서 `server_name` 분기로 운영하는 패턴을 유지. bootstrap 은 플레이북 5-4 의 비파괴 원칙을 엄수.
4. **AdSense 단독**: MVP 단계 우선순위는 승인 획득. 유료 API·제휴는 최초 수익 발생 후 유효 수요가 확인된 뒤 도입.

## 부록 — 플레이북 변수 치환 (확정됨)

| 변수 | 값 |
|---|---|
| `<PROJECT>` | `beautifier` |
| `<SERVICE_NAME>` | `Beautifier — Format JSON, XML, HTML Online` (가안, Phase 1 확정) |
| `<DOMAIN>` | `aidalabs.kr` |
| `<SITE_HOST>` | `beautifier.aidalabs.kr` |
| `<API_HOST>` | `beautifier-api.aidalabs.kr` |
| `<APP_PORT>` | `8001` |
| `<EMAIL>` | TBD — Let's Encrypt 발급용, Phase 3 bootstrap 직전 확정 |
| `<OCI_IP>` | bidMaster VM 과 동일 IP (사용자가 Phase 3 착수 시 확정 값 공유) |
| `<OCI_USER>` | `ubuntu` |
| `<CATEGORIES>` | `basics`, `format-guide`, `troubleshooting`, `comparison`, `faq` |
