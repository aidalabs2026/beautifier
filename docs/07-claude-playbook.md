# 07. Claude 배포 플레이북 — AdSense 목표 정적 사이트용

> **이 문서의 목적**: bidMaster 프로젝트에서 검증된 배포 파이프라인과 시행착오를
> 다른 AdSense 목표 프로젝트에서 Claude 가 그대로 재사용할 수 있도록 압축 정리.
> **Claude 에게**: 새 프로젝트에서 유사한 구축 요청이 들어오면 이 문서를 먼저 읽고,
> 이 구조를 기본안으로 제안한 뒤 차이점만 재확인하라.
> **사람(사용자)에게**: 이 문서는 Claude 의 "내비게이션 지도" 이고, 구체 실행은 각
> 프로젝트의 `01~06` 계열 문서에 담긴다.

---

## 1. 프로젝트 청사진 (검증된 표준 구성)

### 1-1. 서비스 구조

```
[사용자 브라우저]
   │
   ▼
[기존 도메인의 서브도메인 (권장)] 또는 [신규 .com 도메인]
   │  (DNS → OCI Public IP, 대부분 가비아 등 국내 registrar)
   ▼
[Oracle Cloud Infrastructure — Ampere A1 VM, Ubuntu 24.04, Always Free]
   │  Nginx + Let's Encrypt (Full Strict)
   ├── server_name A.example.com  → /var/www/A/        (정적 Astro, AdSense 대상)
   └── server_name B.example.com  → 127.0.0.1:PORT     (옵션: Streamlit·API 등, 광고 없음)
```

### 1-2. 표준 기술 스택

| 레이어 | 채택 | 이유 |
|---|---|---|
| 정적 사이트 | **Astro 5** + MDX + Content Collections | SEO·Core Web Vitals 최상, 콘텐츠 풍부 사이트에 최적 |
| 호스팅 | **OCI Always Free** (Ampere A1, ARM) | 장기 무료, 트래픽 증가에도 비용 구조 변동 없음 |
| TLS | **Let's Encrypt** (certbot --nginx) | 자동 갱신, 무료 |
| DNS | registrar 기본 DNS 유지 (가비아 등) | `.kr` 도메인은 Cloudflare NS 이전이 번거로워 지양 |
| CI/CD | **GitHub Actions → SSH rsync** | Vercel/Netlify 대비 비용 0, VM 직접 배포 |
| 폼/제출 | **FormSubmit** (`formsubmit.co`) | 백엔드 없이 이메일 포워딩, 무료 |
| 분석 | Google Search Console (필수) + GA4 (선택) | |
| 광고 | **Google AdSense** — 서브도메인 단위 심사 | |

### 1-3. 비용 구조

| 항목 | 연간 |
|---|---|
| OCI Always Free | 0원 |
| Let's Encrypt TLS | 0원 |
| FormSubmit | 0원 |
| GitHub Actions (public repo) | 0원 |
| 도메인 (신규 구매 시) | 1~2만원, 기보유 도메인 서브도메인 활용 시 0원 |
| **합계** | **연 0~2만원** |

---

## 2. Claude 권한 경계 (자동화 가능성 맵)

### 2-1. Claude 가 자동으로 할 수 있는 것

- 코드·설정 파일 작성/수정 (Write·Edit 도구)
- 로컬 bash 명령 실행 (git, curl, python, npm 등)
- git commit, push (사용자 승인 범위 내)
- 로컬에서 HTTP/HTTPS 엔드포인트 검증 (curl)
- DNS 해석 확인 (nslookup, dig — `+short` 옵션)
- 빌드 전 Python/JS 문법 사전 체크 (`python -m py_compile`, `npm run build` 드라이런)
- GitHub Actions 워크플로우·시크릿 참조 로직 작성
- 배포 실패 시 로그(사용자가 공유한) 분석 및 픽스 push
- 문서·플레이북 작성

### 2-2. Claude 가 할 수 없는 것 (사용자 위임 필요)

| 작업 | 수행자 | 비고 |
|---|---|---|
| OCI VM 생성·관리 콘솔 조작 | 사용자 | OCI Web Console |
| DNS 레코드 등록 (가비아 등) | 사용자 | registrar 웹 UI |
| SSH 키 생성 (`ssh-keygen`) | 사용자 | 로컬 머신에서 |
| VM 의 `~/.ssh/authorized_keys` 편집 | 사용자 | VM SSH 세션 |
| GitHub Secrets 등록 | 사용자 | GitHub 웹 UI |
| Google Search Console 소유권 확인 | 사용자 | Google 계정 |
| AdSense 신청 | 사용자 | Google 계정 |
| FormSubmit 첫 제출 후 이메일 확인 클릭 | 사용자 | 메일함 |
| `gh` CLI 로그인, GitHub App 설치 | 사용자 | OAuth |

### 2-3. 하이브리드 (Claude 가 초안·사용자가 실행)

- bootstrap.sh 가 실행될 **VM 로컬 환경** — Claude 는 스크립트만 작성, 사용자가 VM 에서 실행
- Let's Encrypt 인증서 발급 (certbot 명령) — Claude 는 명령을 제공, 실제 실행은 VM
- 이미지·로고 에셋 생성 — Claude 는 브리프만, 제작은 외부

**Claude 행동 원칙**: 사용자 액션이 필요한 단계는 **단계별 복붙 가능한 명령** 으로 제공하고, "이 줄까지 실행하고 결과를 붙여 주세요" 식으로 대화를 쪼갠다.

---

## 3. 마스터 배포 시퀀스

이 순서대로 진행하면 MVP 가 약 3~5 시간의 **순수 작업 시간** 에 올라간다 (네트워크 전파·SSL 발급 대기 제외).

### Phase 0. 사전 점검 (5분, 사용자+Claude)

- [ ] **도메인 보유 여부**: 사용자가 도메인을 이미 갖고 있는가? (→ 서브도메인 활용 / 신규 구매 결정)
- [ ] **OCI 계정**: Always Free Tier 인스턴스 생성 여부. 없으면 **사용자가 먼저 계정 생성**
- [ ] **공유 VM 여부**: 해당 OCI VM 에 이미 다른 사이트가 돌고 있는가? (→ 비파괴 bootstrap 모드 필요)
- [ ] **GitHub 저장소**: private / public, 기존 remote 설정 여부
- [ ] **배포 대상 서브도메인·앱 서브도메인 이름 확정**

Claude 는 이 단계에서 `docs/` 아래 `01-vision-and-scope.md`, `03-architecture-decision.md`, `06-deployment-and-domain.md` 를 프로젝트별 맞춤으로 생성한다. 템플릿은 이 플레이북의 7장 참고.

### Phase 1. 리포지토리 스캐폴드 (Claude 단독, 30분)

아래 파일을 **한 커밋으로** 생성. 초기에는 `[skip ci]` 로 첫 push 시 워크플로우 실행 방지.

```
<project>/
├── .gitignore                             # Python·Node·SSH 키 제외 필수
├── .github/workflows/
│   ├── ci.yml                             # 최소 문법 체크
│   ├── deploy-site.yml                    # Astro build + rsync
│   └── deploy-app.yml                     # (옵션) 앱 서브도메인 배포
├── site/                                  # Astro 정적 사이트
│   ├── package.json                       # astro, @astrojs/mdx, @astrojs/sitemap
│   ├── astro.config.mjs                   # site, sitemap, mdx 통합
│   ├── tsconfig.json                      # astro/tsconfigs/strict
│   ├── public/robots.txt
│   └── src/
│       ├── content.config.ts              # glob loader (.md, .mdx)
│       ├── components/
│       │   ├── Callout.astro              # info/warning/tip, SVG 아이콘
│       │   ├── Steps.astro                # <ol class="steps">
│       │   └── Step.astro                 # <li class="step"><slot /></li>
│       ├── content/
│       │   ├── guide/_TEMPLATE.mdx        # 가이드 템플릿
│       │   └── reviews/_TEMPLATE.md       # (옵션) 사용자 후기 템플릿
│       ├── layouts/BaseLayout.astro       # 메타, 내비, 푸터
│       ├── styles/base.css                # 전역 + guide content 스타일
│       └── pages/
│           ├── index.astro
│           ├── about.astro
│           ├── privacy.astro              # ★ AdSense 필수
│           ├── terms.astro                # ★ AdSense 필수
│           ├── contact.astro              # FormSubmit 폼
│           └── guide/
│               ├── index.astro
│               └── [...slug].astro        # hero + TOC + scroll-spy
├── deploy/
│   ├── nginx/<site-domain>.conf           # 정적 서빙 (80 only; certbot 이 443 추가)
│   ├── nginx/<app-domain>.conf            # (옵션) 리버스 프록시 + WebSocket
│   ├── systemd/<app>.service              # (옵션)
│   ├── scripts/bootstrap.sh               # 멱등, 공유 VM 감지, UFW 조건부
│   └── README.md                          # 사용자용 수동 작업 가이드
└── docs/
    ├── README.md
    ├── 01-vision-and-scope.md
    ├── 02-roadmap.md
    ├── 03-architecture-decision.md
    ├── 04-content-plan.md
    ├── 05-adsense-checklist.md
    └── 06-deployment-and-domain.md
```

핵심 템플릿 코드는 7장 참고.

### Phase 2. 사용자 수동 인프라 셋업 (사용자, 20~30분)

**Claude 는 이 단계에서 지시만 내리고 대기한다.** 사용자에게 한 번에 최대 2~3 단계씩 복붙 명령을 제공.

1. **DNS A 레코드 추가** (registrar 콘솔)
   - `<site>` → OCI Public IP
   - `<app>` → OCI Public IP (옵션)
2. **OCI Security List** 80/443 Ingress 추가
3. **Reserved Public IP 할당** (Ephemeral 은 재부팅 시 변경됨)
4. **SSH 키 생성** (로컬에서): 기존 OCI 접속 키가 있으면 그것을 그대로 GitHub Secret 에 재사용 가능 (별도 github-deploy 키는 선택 사항)

### Phase 3. VM 부트스트랩 (사용자 + Claude 협업, 15~30분)

```bash
# 로컬에서 (사용자)
scp -i <OCI_SSH_KEY> -r deploy ubuntu@<OCI_IP>:~/
ssh -i <OCI_SSH_KEY> ubuntu@<OCI_IP>

# VM 에서
EMAIL=<사용자_이메일> sudo -E bash ~/deploy/scripts/bootstrap.sh
```

`bootstrap.sh` 가 다음을 멱등·비파괴 방식으로 수행:
- apt 패키지 설치 (shared VM 에서 ufw 충돌 감지·회피)
- iptables 80/443 idempotent 추가
- `/var/www/<site>/` · `/home/ubuntu/<app>/` 디렉터리 생성
- Nginx 사이트 링크 (default 제거 **금지** — shared VM 에서 aidalabs.kr 같은 기존 사이트 보존)
- systemd 서비스 등록 (있을 경우)
- sudoers drop-in (GitHub Actions 의 SSH 세션이 `systemctl restart` 무비번 실행)
- Let's Encrypt 발급 시도 (DNS 가 자기 IP 를 가리키는지 확인 후)

### Phase 4. GitHub Secrets + 첫 배포 (사용자, 10분)

1. GitHub repo → Settings → Secrets and variables → Actions:
   - `OCI_HOST` — VM Public IP
   - `OCI_SSH_USER` — `ubuntu` (AMD E2 는 `opc`)
   - `OCI_SSH_KEY` — private key 전체 원문 (**LF 줄바꿈**, 마지막 빈 줄 포함)
2. Actions 탭 → Deploy Static Site → **Run workflow** → main

### Phase 5. 콘텐츠 + AdSense 준비 (Claude 중심, 5~15일)

**AdSense 승인 병목은 거의 언제나 콘텐츠.** 최소 기준:

- 가이드 글 10편 이상 (편당 1,500~2,500자)
- 용어사전 / FAQ 30개 이상 (옵션이지만 권장)
- 법적 페이지 4종 완비 (privacy, terms, about, contact)
- 총 실질 페이지 20+ 개

완비 후 Search Console 등록 → 사이트맵 제출 → 주요 URL 수동 색인 요청 → 2~4주 운영 후 AdSense 신청.

---

## 4. 필수 실행 체크리스트 (Claude 가 새 프로젝트 시작 시 따라갈 순서)

아래는 **Claude 가 일관되게 수행해야 할 액션** 이다. 사용자가 "배포 시작" 이라 말하는 순간부터 이 순서.

1. [ ] `docs/01-vision-and-scope.md` 작성 (타겟·수익모델·성공지표)
2. [ ] `docs/03-architecture-decision.md` 작성 후 **사용자에게 옵션 A/B/C 선택 받기**
3. [ ] 도메인·VM 상태 **질문 3개로 확정**: (a) 기존 도메인? (b) 기존 aidalabs 류 사이트 돌고 있음? (c) 앱(동적 백엔드) 필요?
4. [ ] 리포지토리 스캐폴드 (Phase 1 전체를 한 번의 커밋으로, `[skip ci]` 포함)
5. [ ] push
6. [ ] 사용자에게 Phase 2 (DNS + Security List + SSH 키) **복붙 가능한 명령** 제공
7. [ ] 사용자가 Phase 2 완료 보고하면 Phase 3 (VM 부트스트랩) 명령 제공
8. [ ] 부트스트랩 완료 보고 → `curl` 로 사이트·앱 서브도메인 200 확인
9. [ ] Phase 4 (GitHub Secrets + 첫 워크플로우) 지시
10. [ ] 첫 배포 실패 시 **로그 요청** (사용자가 스크린샷 또는 텍스트로 공유)
11. [ ] 성공 후 Search Console 소유권 확인 메타태그 / DNS TXT 요청
12. [ ] 콘텐츠 작성 페이즈 진입

---

## 5. 자주 부딪히는 이슈와 표준 해결

### 5-1. SSH / GitHub Actions

| 증상 | 원인 | 해결 |
|---|---|---|
| `Load key ... error in libcrypto` | SSH private key 의 CRLF 줄바꿈 | 워크플로우 Setup SSH 단계에서 `tr -d '\r'` 로 정제. `ssh-keygen -y -f` 로 사전 검증 |
| `Permission denied (publickey)` | 공개키가 VM authorized_keys 에 없음 | 사용자에게 `cat ... >> ~/.ssh/authorized_keys` 지시 |
| `Host key verification failed` | ssh-keyscan 실패 또는 결과 누락 | `-T 10` 타임아웃, stderr 표시 (`2>/dev/null` 제거) |
| `sudo: a password is required` | sudoers drop-in 미설치 | bootstrap.sh 가 `/etc/sudoers.d/<project>` 작성하도록 |

### 5-2. OCI Ubuntu 24.04 특이사항

| 항목 | 대응 |
|---|---|
| `iptables-persistent` 와 `ufw` 충돌 | `dpkg -l iptables-persistent` 검사 후 이미 있으면 UFW 설치 건너뜀 |
| Ubuntu 기본 iptables 룰이 22만 허용 | bootstrap 이 80/443 INSERT 추가 (idempotent 체크) |
| Python 3.12 의 PEP 668 (system pip 차단) | venv 필수. `python3 -m venv .venv` |
| netfilter-persistent 미설치 시 save 실패 | `command -v netfilter-persistent` 체크 후 조건부 save |

### 5-3. Astro + MDX

| 증상 | 원인 | 해결 |
|---|---|---|
| `[@mdx-js/rollup] Could not parse expression with acorn` | `$$` LaTeX 수식 또는 다른 백슬래시 시퀀스 | LaTeX 사용 금지. 수식은 `<Callout>` 으로 대체 또는 텍스트화 |
| `Some specified paths were not resolved, unable to cache` | `setup-node@v4` 의 `cache: 'npm'` 이 package-lock.json 못 찾음 | 로컬에서 `npm install` 해서 lock 커밋, 또는 cache 옵션 제거 |
| MDX 컴포넌트 내부 markdown 파싱 오류 | 태그 안 컨텐츠 앞뒤 **빈 줄 부족** | `<Step>` 과 `## 제목` 사이에 빈 줄 반드시 삽입 |
| TOC 에 Step 내부 제목 안 잡힘 | 컴포넌트 prop 으로 전달된 title 은 headings 에 안 잡힘 | Step 내부에 `## 제목` 마크다운 작성하도록 설계 |

### 5-4. Nginx / TLS

| 증상 | 원인 | 해결 |
|---|---|---|
| 기존 사이트가 깨짐 | bootstrap 이 `sites-enabled/default` 를 지움 | shared VM 에서는 **삭제 금지**. server_name 명시면 기존 사이트와 공존 |
| certbot 이 challenge 실패 | DNS 전파 미완료 | `dig <host> +short` 로 IP 확인 후 재시도. `--preferred-challenges http` 시도 |
| WebSocket 프록시 끊김 | Upgrade/Connection 헤더 누락 | `proxy_http_version 1.1;` + Upgrade/Connection 헤더 추가 |

### 5-5. FormSubmit

- **첫 제출 시 확인 메일** 이 옴 (`contact@...` 로 수신). 링크 클릭 전까지는 폼 작동 안 함.
- `_captcha: false` 설정 필수, 아니면 사용자가 reCAPTCHA 화면 봄.
- `_next` 로 성공 리다이렉트 URL 지정. 쿼리 파라미터(`?sent=1`) 로 배너 표시.
- 허니팟 필드 `_honey` 는 `display: none` 스타일 적용, tabindex="-1".

### 5-6. Windows 로컬 개발 + Linux VM 배포

- **CR/LF 라인엔딩**: git 이 커밋 시 LF 로 저장하지만 checkout 시 Windows 로 가면 CRLF. 배포 대상 파일(.sh, nginx conf)은 git 히스토리에서 LF 유지됨. VM 에서 git clone 하면 안전.
- **scp 시 CRLF 보존**: `scp` 는 바이트 그대로 전송. Windows 에서 scp 하면 CRLF 그대로 감. 이 경우 VM 에서 `sed -i 's/\r$//' <file>` 또는 `dos2unix` 로 변환 필요.
- **.gitignore 에 SSH 키 반드시 추가**: `*.key`, `*.pem`, `id_rsa`, `github-deploy*` 패턴. 사용자가 프로젝트 폴더에 키 파일을 두는 경우가 많음.

---

## 6. AdSense 승인 최적화 요약

### 6-1. 신청 전 체크리스트 (요약판, 상세는 `docs/05-adsense-checklist.md`)

- [ ] HTTPS 유효
- [ ] 4 법적 페이지: privacy (쿠키·AdSense 명시), terms, about, contact
- [ ] 총 실질 페이지 20+ (가이드 10편, 용어사전 또는 FAQ 다수, 법적 페이지)
- [ ] 각 페이지 500자+ 고유 콘텐츠
- [ ] 헤더/푸터 내비게이션에서 모든 주요 페이지 접근 가능
- [ ] sitemap.xml 생성 및 Search Console 제출, 10+ URL 색인됨
- [ ] 페이지별 고유 `<title>`·meta description·canonical
- [ ] Core Web Vitals Good (LCP < 2.5s)
- [ ] Google Search Console 소유권 확인 완료
- [ ] 사이트 공개 후 최소 2~4주 운영

### 6-2. 서브도메인 심사 주의

AdSense 는 **서브도메인 단위** 로 심사한다. `app.example.com` 의 트래픽/콘텐츠는 `www.example.com` 심사에 영향 없음. 광고 심사 대상 서브도메인에 콘텐츠 집중 필요.

### 6-3. 신청 후 대응

- 심사 중 사이트 구조 변경 금지
- 반려 사유 코드별 대응 (docs/05 체크리스트)
- 재신청 2~4주 간격

---

## 7. 핵심 코드 템플릿 (프로젝트마다 재사용)

### 7-1. `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://<subdomain>.<domain>',
  integrations: [mdx(), sitemap()],
  build: { format: 'directory' },
  compressHTML: true,
});
```

### 7-2. `content.config.ts`

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guide = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guide' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['basics', 'process', 'terms', 'strategy', 'faq']),
    lastUpdated: z.coerce.date(),
    order: z.number().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { guide };
```

### 7-3. Nginx (정적 + 리버스 프록시)

```nginx
# 정적
server {
    listen 80;
    listen [::]:80;
    server_name <site>.<domain>;
    root /var/www/<site>;
    index index.html;
    location / { try_files $uri $uri/ $uri.html =404; }
    location ~* \.(css|js|jpg|jpeg|png|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
}

# 리버스 프록시 (WebSocket 포함)
server {
    listen 80;
    listen [::]:80;
    server_name <app>.<domain>;
    location / {
        proxy_pass http://127.0.0.1:<PORT>;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
    }
}
```

### 7-4. bootstrap.sh 의 핵심 구조

```bash
#!/usr/bin/env bash
set -euo pipefail

# 공유 VM 감지
if [[ -d /etc/nginx/sites-enabled ]] && \
   [[ $(ls -1 /etc/nginx/sites-enabled/ 2>/dev/null | grep -v '^default$' | wc -l) -gt 0 ]]; then
    log "⚠️  기존 Nginx 사이트 감지 — 비파괴 모드"
fi

# apt — ufw 조건부
COMMON_PKGS=(nginx certbot python3-certbot-nginx python3-venv python3-pip rsync git curl fail2ban unattended-upgrades)
if dpkg -l iptables-persistent 2>/dev/null | grep -q "^ii"; then
    echo "  iptables-persistent 감지 — UFW 설치 생략"
else
    COMMON_PKGS+=(ufw iptables-persistent)
fi
apt-get install -y "${COMMON_PKGS[@]}"

# iptables 80/443 idempotent
for port in 80 443; do
    iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null || \
        iptables -I INPUT -p tcp --dport "$port" -j ACCEPT
done
command -v netfilter-persistent >/dev/null && netfilter-persistent save >/dev/null || true

# Nginx — default 건드리지 않음 (중요!)
cp "$DEPLOY_DIR/nginx/"*.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/*.conf /etc/nginx/sites-enabled/
# ※ rm /etc/nginx/sites-enabled/default ← shared VM 에서 절대 하지 말 것

# sudoers — GitHub Actions 용
cat > /etc/sudoers.d/<project> <<'EOF'
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl restart <app>.service
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
EOF
chmod 440 /etc/sudoers.d/<project>
visudo -cf /etc/sudoers.d/<project>

# Let's Encrypt — DNS 확인 후
MY_IP=$(curl -s https://api.ipify.org)
if [[ "$(getent hosts <site>.<domain> | awk '{print $1}' | head -n1)" == "$MY_IP" ]]; then
    certbot --nginx -d <site>.<domain> [-d <app>.<domain>] \
        --agree-tos -m "$EMAIL" --redirect --non-interactive --keep-until-expiring
fi
```

### 7-5. GitHub Actions — Deploy Static Site

```yaml
name: Deploy Static Site
on:
  push:
    branches: [main]
    paths: ['site/**', '.github/workflows/deploy-site.yml']
  workflow_dispatch:
concurrency:
  group: deploy-site
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          # package-lock.json 커밋된 경우에만 cache: 'npm' 추가
      - name: Install & build
        working-directory: site
        run: |
          npm install --no-audit --no-fund
          npm run build
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          printf '%s\n' "${{ secrets.OCI_SSH_KEY }}" | tr -d '\r' > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keygen -y -f ~/.ssh/deploy_key > /dev/null || { echo "::error::OCI_SSH_KEY malformed"; exit 1; }
          ssh-keyscan -T 10 -H "${{ secrets.OCI_HOST }}" >> ~/.ssh/known_hosts
      - name: Rsync to OCI
        run: |
          rsync -avz --delete --delay-updates \
            -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=yes" \
            site/dist/ \
            "${{ secrets.OCI_SSH_USER }}@${{ secrets.OCI_HOST }}:/var/www/<site>/"
```

### 7-6. BaseLayout (핵심 메타)

```astro
---
export interface Props {
  title: string;
  description: string;
  canonical?: string;
}
const { title, description, canonical } = Astro.props;
const canonicalURL = new URL(canonical ?? Astro.url.pathname, Astro.site);
const siteName = '<SERVICE_NAME>';
---
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content={Astro.generator} />
    <!-- Google Search Console 소유권 확인 (프로젝트별 교체) -->
    <meta name="google-site-verification" content="<VERIFICATION_STRING>" />
    <title>{title} | {siteName}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:locale" content="ko_KR" />
    <meta name="twitter:card" content="summary" />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <header><!-- nav --></header>
    <main><slot /></main>
    <footer><!-- legal links + disclaimer --></footer>
  </body>
</html>
```

### 7-7. Callout / Steps / Step

간단한 구현. 전체 소스는 프로젝트의 `site/src/components/` 에서 복사.

```astro
<!-- Callout.astro -->
---
export interface Props { type?: 'info'|'warning'|'tip'; title?: string; }
const { type = 'info', title } = Astro.props;
---
<aside class={`callout callout-${type}`}>
  {title && <div class="callout-title">{title}</div>}
  <div class="callout-content"><slot /></div>
</aside>
```

```astro
<!-- Steps.astro --><ol class="steps"><slot /></ol>
<!-- Step.astro --><li class="step"><slot /></li>
```

내부에서 `## 제목` 마크다운을 쓰면 TOC 자동 추출됨.

### 7-8. TOC + Scroll Spy 스크립트

```astro
<script is:inline>
(function () {
  function init() {
    const links = document.querySelectorAll('.toc-desktop a, .toc-mobile a');
    if (!links.length) return;
    const map = new Map();
    links.forEach((l) => {
      const h = l.getAttribute('href'); if (!h?.startsWith('#')) return;
      const id = decodeURIComponent(h.slice(1));
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(l);
    });
    const heads = Array.from(document.querySelectorAll('h2[id], h3[id]')).filter((e) => map.has(e.id));
    const visible = new Set();
    let cur = '';
    function setActive(id) {
      if (id === cur) return; cur = id;
      links.forEach((a) => a.classList.remove('active'));
      (map.get(id) || []).forEach((a) => a.classList.add('active'));
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
      if (visible.size) {
        const top = heads.find((h) => visible.has(h.id));
        if (top) setActive(top.id);
      }
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach((h) => io.observe(h));
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
</script>
```

### 7-9. FormSubmit 폼

```html
<form action="https://formsubmit.co/<email>" method="POST">
  <input type="hidden" name="_subject" value="[<project>] 문의" />
  <input type="hidden" name="_template" value="table" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_next" value="https://<site>.<domain>/<path>?sent=1" />
  <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" />
  <!-- 필드 -->
</form>
```

---

## 8. Claude 판단 트리

### 8-1. 사용자 요청이 "사이트 만들어 줘" 일 때

1. 기존 도메인 있는지 묻기 → 있으면 서브도메인 활용 제안
2. AdSense 승인이 목적인지 확인 → 그렇다면 Astro + 정적 필수
3. 동적 기능(시뮬레이터·폼 처리)이 필요한지 → 옵션 C (하이브리드) 제안
4. 사용자가 JS 포팅 가능한지 → 가능하면 옵션 B (순수 정적), 아니면 C

### 8-2. 배포 중 실패 로그 분석 순서

1. 실패한 step 특정 (Setup SSH / Install / Build / Rsync / Restart)
2. 에러 키워드 매칭:
   - `libcrypto` / `OPENSSH` → SSH 키 형식 (CRLF, BEGIN/END)
   - `Could not parse expression with acorn` → MDX 파싱 (LaTeX, JSX 문법)
   - `unable to cache dependencies` → setup-node cache 옵션 문제
   - `Permission denied (publickey)` → authorized_keys
   - `sudo: a password is required` → sudoers
   - `Cannot find module` → npm install 또는 의존성 누락
3. 특정 파일·줄 번호 있으면 Read 로 바로 열어서 픽스

### 8-3. 콘텐츠 작성 순위

1. 법적 페이지 4종 (privacy, terms, about, contact) — AdSense 하드 요구
2. 기초 개념 가이드 1~2편 (홈에서 진입할 수 있는 문)
3. 프로세스 가이드 (핵심 키워드 다수 포함)
4. 용어사전 (검색 유입 쉬움)
5. 전략/실수 사례 (방문자 체류 시간)
6. FAQ (롱테일 SEO)

---

## 9. 운영 단계 (배포 후 지속 작업)

### 9-1. 매주

- Uptime Robot 상태 확인
- `/var/log/nginx/access.log` 주간 리포트 (GoAccess)
- Let's Encrypt 갱신 확인 (`sudo certbot certificates`)

### 9-2. 매월

- 디스크 사용량 (`df -h`)
- OCI 아웃바운드 10 TB 한도 소진 현황
- Search Console 색인 상태
- 가이드 글 최근 수정일 갱신

### 9-3. AdSense 승인 후

- ads.txt 업로드
- 광고 슬롯 배치 (본문 상단/중단/하단 A/B)
- 자동광고 vs 수동 비교 (1~2주 단위)
- RPM 추적, 수익성 낮은 페이지 식별

---

## 10. 이 문서 자체 유지보수

Claude 는 프로젝트마다 이 문서의 **"자주 부딪히는 이슈" (5장)** 섹션을 업데이트해야 한다. 새 프로젝트에서 처음 보는 에러를 만나면:

1. 해결 후
2. 이 문서 5장에 항목 추가 (증상 / 원인 / 해결)
3. 같은 커밋에 포함

이렇게 **문서가 누적 자산**이 되어, N 번째 프로젝트는 N-1 번째보다 빨라진다.

---

## 부록 A. 프로젝트별 커스터마이징 변수 목록

새 프로젝트 시작 시 이 변수들을 먼저 정의하면 템플릿을 사각형 맞추듯 채울 수 있다.

- `<PROJECT>` — 프로젝트 슬러그 (예: `bidmaster`)
- `<SERVICE_NAME>` — 브랜드 이름 (예: `bidMaster — 입찰 초보 가이드`)
- `<DOMAIN>` — 루트 도메인 (예: `aidalabs.kr`)
- `<SITE_HOST>` — 정적 사이트 호스트 (예: `bidmaster.aidalabs.kr`)
- `<APP_HOST>` — (옵션) 앱 호스트 (예: `bidmaster-app.aidalabs.kr`)
- `<APP_PORT>` — (옵션) 앱 내부 포트 (예: `8501`)
- `<EMAIL>` — Let's Encrypt / 운영자 이메일
- `<OCI_IP>` — VM Public IP
- `<OCI_USER>` — `ubuntu` (Ubuntu 이미지) 또는 `opc` (Oracle Linux)
- `<CATEGORIES>` — Content Collection 카테고리 목록 (프로젝트 도메인에 맞춰)
- `<NAV_ITEMS>` — 헤더 내비 링크 목록

이 변수들을 프로젝트 초기에 사용자에게 한 번에 확인받은 뒤, 이후 생성되는 모든 파일에 일관되게 적용.
