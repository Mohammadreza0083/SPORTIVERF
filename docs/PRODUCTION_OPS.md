# Production SRE Runbook & Infrastructure Documentation

This document serves as the authoritative operational runbook for deploying, securing, monitoring, and maintaining the **SportivERF** Astro web platform on a Linux VPS.

---

## 1. System Architecture Overview

```
[ Developer Push ]
       │
       ▼
[ GitHub Actions CI/CD Pipeline ]
  ├─ Lint & Type Check (npm run check)
  ├─ Static Build Compilation (npm run build)
  ├─ Docker Image Multi-Stage Build
  └─ Telegram Notification: "Build Succeeded"
       │
       ▼ SSH Deploy
[ Linux VPS Host ]
  ├─ Firewall (UFW) & Fail2Ban Protection
  ├─ Nginx Alpine Reverse Proxy (Container / Host)
  │    ├─ Port 80 -> Port 443 HTTPS 301 Redirect
  │    ├─ Let's Encrypt SSL (TLS 1.2 / TLS 1.3)
  │    ├─ Security Headers (HSTS, CSP, X-Frame-Options)
  │    ├─ Asset Caching (1yr immutable for /_astro/*)
  │    └─ Gzip Compression & Rate Limiting
  ├─ Production Web Container (sportiverf-prod)
  │    └─ Health Endpoint: http://localhost/health (HTTP 200 OK)
  └─ Telemetry & Monitoring (Cron + Telegram Alerts)
```

---

## 2. Linux VPS Provisioning & Security Hardening

### 2.1 Firewall Configuration (UFW)

Enforce minimal open ports on the VPS:

```bash
# Enable UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow essential ports
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
sudo ufw enable
sudo ufw status verbose
```

### 2.2 Fail2Ban Protection

Install and configure Fail2Ban to block brute-force SSH attacks and Nginx abuse:

```bash
sudo apt update && sudo apt install -y fail2ban
```

Create jail configuration `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s

[nginx-req-limit]
enabled  = true
filter   = nginx-limit-req
action   = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath  = /var/log/nginx/error.log
findtime = 600
maxretry = 10
bantime  = 7200
```

Restart Fail2Ban:

```bash
sudo systemctl restart fail2ban
```

---

## 3. SSL Certificate Setup (Let's Encrypt & Certbot)

Generate free trusted SSL certificates via Certbot:

```bash
sudo apt install -y certbot

# Generate certificate using webroot
sudo certbot certonly --standalone -d sportiverf.com -d www.sportiverf.com

# Auto-renewal cron verification
sudo certbot renew --dry-run
```

Certificates will be mounted into the Docker container via:
`/etc/letsencrypt:/etc/letsencrypt:ro`

---

## 4. GitHub Secrets Management

Configure the following environment secrets in your GitHub Repository under **Settings > Secrets and variables > Actions**:

| Secret Name          | Description                                     | Example / Default                                |
| :------------------- | :---------------------------------------------- | :----------------------------------------------- |
| `VPS_HOST`           | IP address or domain of the VPS                 | `192.0.2.1`                                      |
| `VPS_USERNAME`       | SSH User (e.g. `root` or `deploy`)              | `deploy`                                         |
| `VPS_SSH_KEY`        | Private SSH Key for passwordless authentication | `-----BEGIN OPENSSH PRIVATE KEY-----...`         |
| `VPS_PORT`           | SSH Port (Default: 22)                          | `22`                                             |
| `TELEGRAM_BOT_TOKEN` | Bot Access Token                                | `8921060827:AAHUNo_mdKGBwTlbysIf3nbBYd3BIX9k1Pw` |
| `TELEGRAM_CHAT_ID`   | Telegram Chat / Channel ID                      | `269309616`                                      |

---

## 5. Telemetry & Monitoring Setup

To enable automated server health monitoring and daily status reports on the VPS:

1. Copy scripts to `/opt/sportiverf/scripts/`
2. Make scripts executable:
   ```bash
   chmod +x /opt/sportiverf/scripts/*.sh
   ```
3. Add cron jobs for continuous background monitoring and daily reports:
   ```bash
   crontab -e
   ```
   Insert the following schedule:
   ```cron
   # Check server metrics every 5 minutes and send immediate Telegram alerts if unhealthy
   */5 * * * * /opt/sportiverf/scripts/server-monitor.sh >/dev/null 2>&1

   # Send daily health summary report at 08:00 UTC
   0 8 * * * /opt/sportiverf/scripts/server-monitor.sh --daily >/dev/null 2>&1

   # Run automated configuration backup daily at 02:00 UTC
   0 2 * * * /opt/sportiverf/scripts/backup.sh >/dev/null 2>&1
   ```

---

## 6. Zero-Downtime Deployment & Manual Rollback Commands

### Automatic CI/CD Deployment Flow

Every push to `main` executes `.github/workflows/deploy.yml`:

1. Linting & type checking (`npm run check`).
2. Static compilation (`npm run build`).
3. Multi-stage Docker image build.
4. SSH into VPS and trigger `./deploy/deploy.sh`.
5. Healthcheck loop polling `http://localhost/health`.
6. Automatic rollback to `sportiverf-web:previous` if healthcheck fails.
7. Real-time Telegram notification dispatched for every phase.

### Manual VPS Commands

#### Run Production Stack

```bash
docker compose -f docker-compose.prod.yml up -d
```

#### Check Container Logs

```bash
docker compose -f docker-compose.prod.yml logs -f web
```

#### Check Container Health Status

```bash
docker inspect --format='{{json .State.Health}}' sportiverf-prod
```

#### Manual Rollback

```bash
./deploy/deploy.sh --rollback
```

#### Manual Backup

```bash
./scripts/backup.sh
```

#### Manual Restore

```bash
./scripts/restore.sh backups/sportiverf_backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## 7. Security Hardening Checklist

- [x] **Non-Root Execution**: Production Docker container runs under `USER nginx` (UID 101).
- [x] **Resource Caps**: CPU usage capped at 1.5 cores, RAM memory capped at 1024MB in `docker-compose.prod.yml`.
- [x] **Log Rotation**: Docker JSON log driver configured with `max-size: 10m` and `max-file: 3`.
- [x] **HSTS & TLS Hardening**: Forced TLS 1.2/1.3 with modern cipher suites and HSTS header (`max-age=63072000`).
- [x] **Rate Limiting**: Nginx rate-limiting zone active at 10 req/sec per IP with burst capabilities.
- [x] **Immutable Asset Caching**: 1-year browser cache for `/_astro/*` bundled assets.
- [x] **Automated Telemetry**: Telegram alerting engine watching CPU, RAM, Disk, Docker, Nginx, SSL expiration, and HTTP response times.
