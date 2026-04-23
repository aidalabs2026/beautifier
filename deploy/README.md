# deploy/ — Beautifier 배포 가이드

이 디렉터리는 Beautifier 사이트를 OCI VM (bidMaster 와 공유) 에 추가 배포하는 데 필요한 템플릿·스크립트를 담고 있습니다.

- `nginx/beautifier.aidalabs.kr.conf` — 정적 사이트용 Nginx server 블록 (HTTP, certbot 이 HTTPS 를 자동 추가)
- `scripts/bootstrap.sh` — OCI VM 에서 1회 실행할 멱등·비파괴 스크립트
- 루트 `.github/workflows/deploy-site.yml` — GitHub Actions CI/CD (파일은 `deploy/` 밖에 위치)

---

## 전체 흐름 요약

```
[로컬]                                           [OCI VM]                         [GitHub]
 ├─ git init & push 1st commit  ────────────▶    (변화 없음)                      repo 생성
 ├─ DNS A 레코드 등록 (registrar)                                                    │
 │   beautifier → <OCI_IP>                                                           │
 │                                                                                   │
 ├─ scp deploy/ → VM                       ────▶ ~/beautifier-setup/                 │
 │                                                                                   │
 ├─ ssh VM                                 ────▶ bootstrap.sh                        │
 │                                                  • apt ensure                     │
 │                                                  • /var/www/beautifier            │
 │                                                  • nginx conf + reload            │
 │                                                  • certbot --nginx                │
 │                                                                                   │
 ├─ Secrets 등록 (GitHub Settings) ──────────────────────────────────────▶  OCI_HOST, OCI_SSH_USER, OCI_SSH_KEY
 │                                                                                   │
 └─ git push main   ───────────────────────────────────────────────────────▶  Workflow 실행
                                                 ◀─── rsync dist/ ────────  npm run build
                                                 ◀─── systemctl reload ───
```

---

## 사용자 수동 작업 (7 스텝)

### 1. Git 저장소 준비

아직 git 저장소가 없다면:

```bash
# 로컬에서 (프로젝트 루트)
cd E:/01_DEV/01_claude/2026_google_ads/json-beautifier
git init -b main
git add .
git commit -m "Phase 1 scaffold: Astro site + JSON MVP + docs"
```

GitHub 에 빈 저장소 생성 후:

```bash
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

> **참고**: Windows 에서 push 하기 전에 `.gitattributes` 로 `*.sh text eol=lf` 지정해두면 bootstrap.sh 의 CRLF 문제를 예방할 수 있습니다. 본 스캐폴드는 아직 없으므로 필요하면 추가 요청.

### 2. DNS A 레코드 등록

`aidalabs.kr` 을 관리 중인 registrar 콘솔(가비아 등):

- 호스트: `beautifier`
- 타입: `A`
- 값: `<OCI VM Public IP>` (bidMaster 에서 쓰는 IP 와 동일)
- TTL: `3600`

전파 확인:

```bash
dig beautifier.aidalabs.kr +short
# → OCI IP 가 나와야 함
```

### 3. deploy/ 를 VM 으로 업로드

로컬에서:

```bash
scp -i <OCI_SSH_KEY_PATH> -r deploy ubuntu@<OCI_IP>:~/beautifier-setup-deploy
```

(폴더명은 bidMaster 의 것과 겹치지 않도록 `beautifier-setup-deploy` 사용)

### 4. VM 에서 bootstrap 실행

```bash
ssh -i <OCI_SSH_KEY_PATH> ubuntu@<OCI_IP>
cd ~/beautifier-setup-deploy
EMAIL=you@example.com sudo -E bash scripts/bootstrap.sh
```

성공 시 마지막 로그에서:

```
✅ Beautifier — OCI bootstrap complete
   site:  https://beautifier.aidalabs.kr
```

브라우저에서 `https://beautifier.aidalabs.kr` 접속 → 임시 placeholder 페이지가 보이면 OK.

### 5. GitHub Secrets 등록

저장소 → Settings → Secrets and variables → Actions → **New repository secret**:

| Name | Value |
|---|---|
| `OCI_HOST` | VM 의 Public IP |
| `OCI_SSH_USER` | `ubuntu` |
| `OCI_SSH_KEY` | **GitHub Actions 용 SSH private key 전체 내용** (LF 줄바꿈, 끝에 빈 줄 1개) |

> `OCI_SSH_KEY` 는 bidMaster 에서 사용 중인 키를 그대로 복붙해도 됩니다 (secret 은 저장소별 독립).
> 키를 새로 만들고 싶다면 로컬에서:
> ```bash
> ssh-keygen -t ed25519 -f github-deploy-beautifier -N '' -C github-actions-beautifier
> # 공개키를 VM 의 ~/.ssh/authorized_keys 에 append
> cat github-deploy-beautifier.pub | ssh ubuntu@<OCI_IP> 'cat >> ~/.ssh/authorized_keys'
> # github-deploy-beautifier (private) 내용을 OCI_SSH_KEY 로 등록
> ```

### 6. 첫 자동 배포

```bash
git push origin main
```

- Actions 탭에서 `Deploy Static Site` 워크플로우 실행 확인
- 성공 시 VM 의 `/var/www/beautifier/` 가 Astro 빌드 산출물로 교체됨

### 7. 검증

```bash
curl -I https://beautifier.aidalabs.kr
# HTTP/2 200
# server: nginx/...
# content-type: text/html
```

브라우저에서 다음 확인:
- [ ] `/` 정상 렌더 (히어로 + 카드)
- [ ] `/json/` 도구 동작 (JSON beautify · Web Worker 작동)
- [ ] `/privacy/` · `/terms/` · `/about/` · `/contact/` 모두 200
- [ ] `https://beautifier.aidalabs.kr/sitemap-index.xml` XML 반환
- [ ] 자물쇠 아이콘 (Let's Encrypt 인증서)
- [ ] PageSpeed Insights 모바일·데스크톱 Good

---

## 롤백 / 재시도

- **Nginx 설정에 문제**: VM 에서 `sudo nginx -t` 로 진단 후 `/etc/nginx/sites-available/beautifier.aidalabs.kr.conf` 직접 수정 → `sudo systemctl reload nginx`
- **certbot 실패**: DNS 전파가 안 된 상태에서 실행했을 가능성. `dig beautifier.aidalabs.kr +short` 로 IP 확인 후 `sudo certbot --nginx -d beautifier.aidalabs.kr --agree-tos -m <email> --redirect` 수동 재시도
- **deploy 워크플로우 실패**: Actions 로그에서 에러 확인. 자주 발생하는 케이스는 `docs/07-claude-playbook.md` §5-1 참고
- **배포를 통째로 되돌리고 싶을 때**: VM 에서 `/etc/nginx/sites-enabled/beautifier.aidalabs.kr.conf` 심볼릭 링크 제거 후 `sudo systemctl reload nginx`. `/var/www/beautifier/` 디렉터리와 Let's Encrypt 인증서는 남겨도 안전.

---

## 확장 (Phase 6 백엔드 추가 시)

- `nginx/beautifier-api.aidalabs.kr.conf` 추가 작성
- `DNS`: A 레코드 `beautifier-api` 등록
- `bootstrap.sh` 를 API 도메인 추가하여 재실행하거나, 수동으로 `certbot --nginx -d beautifier-api.aidalabs.kr` 실행
- `systemd/beautifier-api.service` 생성
- `.github/workflows/deploy-api.yml` 추가

본 시점에는 Phase 6 착수 시점에 작성.
