#!/usr/bin/env bash
#
# Beautifier OCI VM Bootstrap — shared-VM safe
#
# This VM already hosts bidMaster (or other sites). This script only ADDS
# the beautifier site; it must NEVER touch existing sites-enabled entries.
#
# Usage (on the VM):
#   cd ~/beautifier-setup   # where you scp'd the deploy/ tree
#   EMAIL=you@example.com sudo -E bash deploy/scripts/bootstrap.sh
#
# Idempotent — safe to re-run.
#
set -euo pipefail

PROJECT="beautifier"
DOMAIN_SITE="beautifier.aidalabs.kr"
SITE_DIR="/var/www/${PROJECT}"
NGINX_CONF_NAME="${DOMAIN_SITE}.conf"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DEPLOY_DIR="$( cd "${SCRIPT_DIR}/.." && pwd )"

log()  { echo -e "\n\033[1;34m==> $*\033[0m"; }
warn() { echo -e "\033[1;33m!! $*\033[0m" >&2; }

if [[ $EUID -ne 0 ]]; then
   echo "root required: sudo -E bash $0" >&2
   exit 1
fi

EMAIL="${EMAIL:-}"
if [[ -z "$EMAIL" ]]; then
    read -r -p "Let's Encrypt contact email: " EMAIL
fi

# ---------------------------------------------------------------------------
# Shared VM detection (informational)
# ---------------------------------------------------------------------------
log "Detecting existing Nginx sites (shared VM safety)"
EXISTING_SITES=()
if [[ -d /etc/nginx/sites-enabled ]]; then
    while IFS= read -r f; do
        [[ "$f" == "default" ]] && continue
        EXISTING_SITES+=("$f")
    done < <(ls -1 /etc/nginx/sites-enabled/ 2>/dev/null)
fi
if (( ${#EXISTING_SITES[@]} > 0 )); then
    echo "  Existing sites detected — non-destructive mode enabled:"
    printf '    %s\n' "${EXISTING_SITES[@]}"
else
    echo "  No pre-existing sites. Still runs idempotently."
fi

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

# ---------------------------------------------------------------------------
# Packages — install only what's missing (VM may already have these from bidMaster)
# ---------------------------------------------------------------------------
log "Ensuring required packages"
NEEDED_PKGS=(nginx certbot python3-certbot-nginx rsync curl)
MISSING=()
for pkg in "${NEEDED_PKGS[@]}"; do
    if ! dpkg -l "$pkg" 2>/dev/null | grep -q "^ii"; then
        MISSING+=("$pkg")
    fi
done
if (( ${#MISSING[@]} > 0 )); then
    echo "  Installing: ${MISSING[*]}"
    apt-get update
    apt-get install -y "${MISSING[@]}"
else
    echo "  All required packages already installed."
fi

# ---------------------------------------------------------------------------
# Firewall — 80/443 allowed? (idempotent; do not flip UFW state)
# ---------------------------------------------------------------------------
log "Verifying 80/443 firewall rules (non-destructive)"
for port in 80 443; do
    if ! iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null; then
        iptables -I INPUT -p tcp --dport "$port" -j ACCEPT
        echo "  iptables: ${port} rule added"
    else
        echo "  iptables: ${port} already allowed"
    fi
done
if command -v netfilter-persistent >/dev/null 2>&1; then
    netfilter-persistent save >/dev/null 2>&1 \
        || warn "netfilter-persistent save failed — rules may not survive reboot"
fi
if ufw status 2>/dev/null | grep -q "Status: active"; then
    ufw allow 'Nginx Full' >/dev/null 2>&1 || true
    echo "  UFW: active, Nginx Full rule ensured"
fi

# ---------------------------------------------------------------------------
# Document root
# ---------------------------------------------------------------------------
log "Preparing document root ${SITE_DIR}"
install -d -o ubuntu -g ubuntu -m 755 "$SITE_DIR"

# Placeholder so Nginx returns 200 before the first rsync deploy
if [[ ! -f "$SITE_DIR/index.html" ]]; then
    cat > "$SITE_DIR/index.html" <<'HTML'
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Beautifier</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:system-ui,sans-serif;max-width:600px;margin:80px auto;padding:0 20px;color:#333}</style>
</head><body>
<h1>Beautifier</h1>
<p>Coming soon. First deploy replaces this placeholder.</p>
</body></html>
HTML
    chown ubuntu:ubuntu "$SITE_DIR/index.html"
    echo "  Placeholder index.html created"
fi

# ---------------------------------------------------------------------------
# Nginx — copy our config, symlink, validate, reload
# ---------------------------------------------------------------------------
log "Installing Nginx config (preserving other sites)"
cp "$DEPLOY_DIR/nginx/${NGINX_CONF_NAME}" /etc/nginx/sites-available/
ln -sf "/etc/nginx/sites-available/${NGINX_CONF_NAME}" "/etc/nginx/sites-enabled/"

# IMPORTANT: never remove sites-enabled/default here. aidalabs.kr root or
# other subdomains may depend on it. Our server_name is explicit.

echo "  Currently enabled sites:"
ls -1 /etc/nginx/sites-enabled/ | sed 's/^/    /'

nginx -t
systemctl reload nginx

# ---------------------------------------------------------------------------
# sudoers — let GitHub Actions reload nginx without a password
# ---------------------------------------------------------------------------
log "sudoers drop-in for reload-on-deploy"
cat > /etc/sudoers.d/${PROJECT} <<'EOF'
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
EOF
chmod 440 /etc/sudoers.d/${PROJECT}
visudo -cf /etc/sudoers.d/${PROJECT}

# ---------------------------------------------------------------------------
# DNS + Let's Encrypt
# ---------------------------------------------------------------------------
log "Checking DNS"
RESOLVED_SITE=$(getent hosts "$DOMAIN_SITE" | awk '{print $1}' | head -n1 || true)
MY_IP=$(curl -s https://api.ipify.org || true)

echo "  ${DOMAIN_SITE} → ${RESOLVED_SITE:-(not set)}"
echo "  this VM public IP → ${MY_IP:-(lookup failed)}"

DNS_OK=false
if [[ -n "$MY_IP" && "$RESOLVED_SITE" == "$MY_IP" ]]; then
    DNS_OK=true
fi

if [[ "$DNS_OK" == "true" ]]; then
    log "Let's Encrypt issuance"
    # --keep-until-expiring avoids re-issuing on repeated runs
    certbot --nginx \
        -d "$DOMAIN_SITE" \
        --agree-tos -m "$EMAIL" --redirect --non-interactive --keep-until-expiring \
        || warn "certbot failed. After DNS propagation run:
    sudo certbot --nginx -d $DOMAIN_SITE --agree-tos -m $EMAIL --redirect"
else
    warn "DNS does not point to this VM yet. Skipping certbot."
    warn "After registering the A record, re-run manually:"
    warn "    sudo certbot --nginx -d $DOMAIN_SITE --agree-tos -m $EMAIL --redirect"
fi

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
log "Bootstrap complete"
cat <<SUMMARY

=====================================================
  Beautifier — OCI bootstrap complete
    site:  https://${DOMAIN_SITE}
    root:  ${SITE_DIR}
=====================================================

Next steps:
  1. Register GitHub repository secrets:
       OCI_HOST     = <this VM's public IP>
       OCI_SSH_USER = ubuntu
       OCI_SSH_KEY  = OpenSSH private key (LF line endings, trailing blank line)

     If you are re-using the bidMaster deploy key on this repo, copy the
     SAME private key contents into this repo's Secrets. Secrets are NOT
     shared across repositories.

  2. git push to main → the 'Deploy Static Site' workflow runs and rsyncs
     dist/ into ${SITE_DIR}.

  3. Verify:  curl -I https://${DOMAIN_SITE}

SUMMARY
