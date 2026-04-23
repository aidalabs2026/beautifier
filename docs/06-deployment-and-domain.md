# 06. 배포 및 도메인 전략

전제:
- 배포: **Oracle Cloud Infrastructure (OCI) Always Free Tier** — bidMaster 와 동일 VM 공유 권장
- 도메인: **기보유 `aidalabs.kr` 의 서브도메인 활용** (추가 등록 비용 0원)
- 서브도메인 (03 결정): **`beautifier.aidalabs.kr`** (정적 사이트) + **`beautifier-api.aidalabs.kr`** (백엔드, Phase 6)
- 하이브리드 구조: `<SITE_HOST>` (정적) + `<API_HOST>` (백엔드, Phase 6)
- 백엔드 스택 (03 결정): **FastAPI + Uvicorn**, 포트 `8001`
- VM: **bidMaster VM 공유**, bootstrap 비파괴 모드 필수
- 총 운영 비용: **연 0원**

## 1. Oracle Cloud Always Free 스펙 (재확인, bidMaster 06 참고)

bidMaster 와 공유하는 VM 기준:
- Shape: **VM.Standard.A1.Flex** (Ampere ARM)
- 사양: OCPU 4 / RAM 24 GB (Always Free 최대)
- Image: Ubuntu 22.04 또는 24.04 (ARM)
- Reserved Public IP 1개
- 네트워크 아웃바운드 월 10 TB

**리전**: bidMaster 가 이미 특정 리전에 있다면 **동일 리전** 사용. 새 VM 을 띄우는 경우 `ap-tokyo-1` 또는 `ap-chuncheon-1` 권장.

## 2. 배포 아키텍처 (하이브리드, 옵션 C 계열)

```
[사용자: https://<SITE_HOST>  /  https://<API_HOST>]
   │  443 포트 (사용자 직접 접속)
   ▼
[OCI Ampere A1 VM — Ubuntu, Reserved Public IP]
   │  Nginx (Host 헤더로 분기)
   │
   ├── server_name bidmaster.aidalabs.kr      → /var/www/bidmaster/       (bidMaster, 기존)
   ├── server_name bidmaster-app.aidalabs.kr  → 127.0.0.1:8501            (bidMaster 앱, 기존, 옵션)
   │
   ├── server_name <SITE_HOST>                → /var/www/<PROJECT>/       (본 프로젝트 Astro 정적 빌드, AdSense 대상)
   └── server_name <API_HOST>                 → 127.0.0.1:<APP_PORT>      (본 프로젝트 백엔드, Phase 6)
```

**핵심 원칙**:
- 기존 `sites-enabled/default` · bidmaster 설정을 **절대 삭제하지 않음**. 공유 VM 비파괴 모드.
- AdSense 심사는 `<SITE_HOST>` 만 대상. `<API_HOST>` 에는 광고 스니펫 미삽입.

## 3. 도메인 구조 (옵션 A 예시 기준)

옵션 A (`beautifier.aidalabs.kr`) 선택 시:

| 용도 | 서브도메인 | 비고 |
|---|---|---|
| 정적 사이트 (AdSense 대상) | `beautifier.aidalabs.kr` | Astro 빌드 결과, Nginx 서빙 |
| 백엔드 API (Phase 6+) | `beautifier-api.aidalabs.kr` | Nginx → `127.0.0.1:8001` (FastAPI) |

옵션 B / C 는 `<SITE_HOST>` / `<API_HOST>` 만 치환.

**중요**: Phase 3 에서는 **`<SITE_HOST>` 만 DNS 등록** 하고, `<API_HOST>` 는 Phase 6 시작 시점에 추가해도 됨. 다만 Let's Encrypt 다중 발급을 한 번에 처리하려면 Phase 3 시점에 미리 DNS 예약해두는 것도 유효.

## 4. 초기 구축 절차 (OCI)

### 4-1. 사전 조건 확인 (사용자 확인 필요)

- [ ] OCI 계정 및 Ampere A1 VM 존재 (bidMaster 가 이미 사용 중이면 재확인만)
- [ ] VM Public IP 확보 (Reserved)
- [ ] SSH 키 보유 (bidMaster 에 사용 중인 키 재사용 가능)
- [ ] OCI Security List Ingress 80/443 TCP 열림

### 4-2. DNS A 레코드 추가 (registrar 콘솔, 사용자 수동)

`aidalabs.kr` DNS 관리 콘솔 (가비아/후이즈/Cloudflare 등):

1. A 레코드 추가:
   - 호스트: `<SITE_HOST 의 서브 부분>` (예: `beautifier`)
   - 값: `<OCI Reserved Public IP>`
   - TTL: 3600
2. (선택) A 레코드 추가:
   - 호스트: `beautifier-api`
   - 값: `<OCI Reserved Public IP>`
3. 전파 대기 (10분~1시간)

```bash
dig <SITE_HOST> +short     # OCI IP 확인
dig <API_HOST> +short      # (선택) 확인
```

### 4-3. 서버 bootstrap (Claude 작성, 사용자가 VM 에서 실행)

플레이북 7-4 의 `bootstrap.sh` 를 본 프로젝트에 맞춰 치환한 버전을 `deploy/scripts/bootstrap.sh` 로 작성. 핵심 포인트:

- **공유 VM 감지**: `/etc/nginx/sites-enabled/` 에 bidmaster 관련 설정이 있으면 "비파괴 모드" 로 전환.
- `apt` 패키지: nginx, certbot, python3-certbot-nginx, rsync, git, (Phase 6 시점) python3-venv / Node.
- iptables 80/443 INSERT (idempotent).
- **`rm sites-enabled/default` 금지** — 기존 bidmaster 호스트 설정 보존.
- sudoers drop-in 작성 (GitHub Actions 에서 `systemctl reload nginx` 무비번).

로컬에서 VM 으로 `deploy/` 업로드 후 실행:

```bash
# 사용자 로컬
scp -i <OCI_SSH_KEY> -r deploy ubuntu@<OCI_IP>:~/

# VM 에서
ssh -i <OCI_SSH_KEY> ubuntu@<OCI_IP>
EMAIL=<EMAIL> sudo -E bash ~/deploy/scripts/bootstrap.sh
```

### 4-4. Nginx 설정 (정적 + API)

`deploy/nginx/<PROJECT>-site.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name <SITE_HOST>;

    root /var/www/<PROJECT>;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
}
```

`deploy/nginx/<PROJECT>-api.conf` (Phase 6 에 사용):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name <API_HOST>;

    # CORS: <SITE_HOST> 에서의 fetch 허용
    location / {
        proxy_pass http://127.0.0.1:<APP_PORT>;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 600s;       # 대용량 파일 처리 여유
        client_max_body_size 200m;     # 업로드 상한
    }
}
```

활성화:

```bash
sudo cp deploy/nginx/<PROJECT>-site.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/<PROJECT>-site.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4-5. HTTPS — Let's Encrypt

```bash
# Phase 3 (site only)
sudo certbot --nginx \
    -d <SITE_HOST> \
    --agree-tos -m <EMAIL> --redirect --non-interactive --keep-until-expiring

# Phase 6 (site + api)
sudo certbot --nginx \
    -d <SITE_HOST> -d <API_HOST> \
    --agree-tos -m <EMAIL> --redirect --non-interactive --keep-until-expiring
```

- 자동 갱신은 `/etc/cron.d/certbot` 에 기본 등록됨.
- DNS 전파 전에 certbot 실행 시 challenge 실패 → `dig <host> +short` 로 IP 확인 후 재시도.

### 4-6. CI/CD — GitHub Actions

`.github/workflows/deploy-site.yml` (플레이북 7-5 기반, 본 프로젝트 변수 치환):

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
            "${{ secrets.OCI_SSH_USER }}@${{ secrets.OCI_HOST }}:/var/www/<PROJECT>/"
```

`.github/workflows/deploy-api.yml` (Phase 6 에 추가): 빌드 단계는 Python 또는 Node 에 맞춰 변경, rsync 후 `sudo systemctl restart <PROJECT>-api.service`.

### 4-7. GitHub Secrets

Repository Settings → Secrets and variables → Actions:

- `OCI_HOST` — VM Public IP
- `OCI_SSH_USER` — `ubuntu` (Ampere) 또는 `opc` (AMD E2)
- `OCI_SSH_KEY` — private key 전체 원문 (**LF 줄바꿈**, 마지막 빈 줄 포함)

⚠️ bidMaster 에서 사용 중인 키를 재사용하는 경우, **별도 secret 이름(예: `AIDALABS_OCI_SSH_KEY`)** 대신 새 repo 에 동일 내용을 복붙 등록. repo 간 secret 공유 불가.

## 5. Phase 6 백엔드 systemd 서비스 (FastAPI 예시, 옵션 P 선택 시)

`/etc/systemd/system/<PROJECT>-api.service`:

```ini
[Unit]
Description=<PROJECT> API (FastAPI / Uvicorn)
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/<PROJECT>-api
ExecStart=/home/ubuntu/<PROJECT>-api/.venv/bin/uvicorn app.main:app \
    --host 127.0.0.1 --port <APP_PORT> --workers 2
Restart=always
Environment="PYTHONUNBUFFERED=1"

[Install]
WantedBy=multi-user.target
```

옵션 N (Node/Hono) 선택 시:

```ini
ExecStart=/usr/bin/node /home/ubuntu/<PROJECT>-api/dist/index.js
Environment="PORT=<APP_PORT>" "NODE_ENV=production"
```

## 6. 운영 체크리스트

### 주간
- [ ] Uptime Robot 상태 확인 (무료 5분 간격 50개 모니터)
- [ ] `/var/log/nginx/access.log` 트래픽 체크 (`goaccess`)
- [ ] Let's Encrypt 갱신 로그 (`sudo certbot certificates`)
- [ ] GitHub Actions 최근 실행 결과

### 월간
- [ ] OCI 아웃바운드 소진 현황 (10 TB 한도)
- [ ] 디스크 사용량 (`df -h`) — `/var/www/<PROJECT>` 성장 추이
- [ ] Search Console 색인 상태 + Core Web Vitals
- [ ] (Phase 6+) API rate limit 도달 IP 패턴 리뷰

### AdSense 승인 후 추가
- [ ] 주간 광고 수익 · RPM
- [ ] 정책 위반 경고 모니터링
- [ ] ads.txt 유효성 점검

## 7. 비용 요약

| 항목 | 연간 |
|---|---|
| OCI Always Free (bidMaster 와 공유) | **0원** |
| 도메인 (`aidalabs.kr` 기보유) | **0원** |
| Let's Encrypt TLS | **0원** |
| GitHub Actions (public repo) | **0원** |
| FormSubmit | **0원** |
| **합계** | **연 0원** |

트래픽 증가 시 구조적 추가 비용 없음. 유료 이행 트리거는 "OCI 아웃바운드 10 TB 초과" 또는 "ARM 리소스 회수" 수준이며, 초기~중기 규모에서는 거의 발생하지 않음.

## 8. 플레이북 치환 변수 요약 (확정됨)

| 변수 | 값 |
|---|---|
| `<PROJECT>` | `beautifier` |
| `<SITE_HOST>` | `beautifier.aidalabs.kr` |
| `<API_HOST>` | `beautifier-api.aidalabs.kr` |
| `<APP_PORT>` | `8001` (FastAPI + Uvicorn) |
| `<EMAIL>` | TBD — Phase 3 bootstrap 직전 확정 |
| `<OCI_IP>` | bidMaster 와 동일 IP (공유 VM) |
| `<OCI_USER>` | `ubuntu` |

이 표를 03 의 "결정 기록" 과 동기화 유지. 변경 시 두 문서 모두 갱신.
