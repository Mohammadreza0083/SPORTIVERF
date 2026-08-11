#!/usr/bin/env bash

# ==============================================================================
# VPS Server Monitoring & Health Alerting Engine
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TELEGRAM_SCRIPT="${SCRIPT_DIR}/telegram-notify.sh"
chmod +x "${TELEGRAM_SCRIPT}" 2>/dev/null || true

DOMAIN="sportiverf.com"
URL="https://${DOMAIN}"
CPU_THRESHOLD=85
RAM_THRESHOLD=90
DISK_THRESHOLD=85
SSL_DAYS_THRESHOLD=14

IS_DAILY_REPORT=false
if [ "$1" == "--daily" ]; then
    IS_DAILY_REPORT=true
fi

ALERT_TRIGGERED=false
ALERT_DETAILS=""

# 1. CPU Utilization Check
CPU_IDLE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print $1}')
if [ -n "${CPU_IDLE}" ]; then
    CPU_USAGE=$(awk "BEGIN {print 100 - ${CPU_IDLE}}")
    CPU_INT=${CPU_USAGE%.*}
else
    CPU_INT=0
    CPU_USAGE="0"
fi

if [ "${CPU_INT}" -gt "${CPU_THRESHOLD}" ]; then
    ALERT_TRIGGERED=true
    ALERT_DETAILS="${ALERT_DETAILS}• High CPU Usage: ${CPU_USAGE}%\n"
fi

# 2. RAM Utilization Check
RAM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
RAM_USED=$(free -m | awk '/Mem:/ {print $3}')
RAM_USAGE=$(( RAM_USED * 100 / RAM_TOTAL ))

if [ "${RAM_USAGE}" -gt "${RAM_THRESHOLD}" ]; then
    ALERT_TRIGGERED=true
    ALERT_DETAILS="${ALERT_DETAILS}• High RAM Usage: ${RAM_USAGE}% (${RAM_USED}MB / ${RAM_TOTAL}MB)\n"
fi

# 3. Disk Space Check
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "${DISK_USAGE}" -gt "${DISK_THRESHOLD}" ]; then
    ALERT_TRIGGERED=true
    ALERT_DETAILS="${ALERT_DETAILS}• High Disk Usage: ${DISK_USAGE}%\n"
fi

# 4. Docker Containers Check
DOCKER_DOWN=$(docker ps -a --filter "status=exited" --filter "status=dead" --format "{{.Names}}" | tr '\n' ', ')
if [ -n "${DOCKER_DOWN}" ]; then
    ALERT_TRIGGERED=true
    ALERT_DETAILS="${ALERT_DETAILS}• Unhealthy Docker Containers: ${DOCKER_DOWN}\n"
fi

# 5. Nginx Service Check
if ! docker ps --format '{{.Names}}' | grep -q "sportiverf-prod"; then
    if ! systemctl is-active --quiet nginx 2>/dev/null; then
        ALERT_TRIGGERED=true
        ALERT_DETAILS="${ALERT_DETAILS}• Nginx Web Server is DOWN!\n"
    fi
fi

# 6. SSL Certificate Expiration Check
if command -v openssl >/dev/null 2>&1; then
    SSL_EXP_DATE=$(echo | openssl s_client -servername "${DOMAIN}" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ -n "${SSL_EXP_DATE}" ]; then
        SSL_EXP_EPOCH=$(date -d "${SSL_EXP_DATE}" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "${SSL_EXP_DATE}" +%s)
        NOW_EPOCH=$(date +%s)
        SSL_DAYS_LEFT=$(( (SSL_EXP_EPOCH - NOW_EPOCH) / 86400 ))
        
        if [ "${SSL_DAYS_LEFT}" -lt "${SSL_DAYS_THRESHOLD}" ]; then
            ALERT_TRIGGERED=true
            ALERT_DETAILS="${ALERT_DETAILS}• SSL Certificate expiring in ${SSL_DAYS_LEFT} days!\n"
        fi
    else
        SSL_DAYS_LEFT="N/A"
    fi
else
    SSL_DAYS_LEFT="N/A"
fi

# 7. Website Uptime & Response Time
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}" "${URL}" || echo "000|0")
HTTP_STATUS=$(echo "${HTTP_RESPONSE}" | cut -d'|' -f1)
RESPONSE_TIME=$(echo "${HTTP_RESPONSE}" | cut -d'|' -f2)

if [ "${HTTP_STATUS}" -ne 200 ]; then
    ALERT_TRIGGERED=true
    ALERT_DETAILS="${ALERT_DETAILS}• Website DOWN or Error! HTTP Status: ${HTTP_STATUS}\n"
fi

# ==============================================================================
# Dispatch Notifications
# ==============================================================================

if [ "${ALERT_TRIGGERED}" = true ]; then
    "${TELEGRAM_SCRIPT}" "ALERT" "Server Monitoring Alert" "System anomalies or service unhealthiness detected!" "${ALERT_DETAILS}"
fi

if [ "${IS_DAILY_REPORT}" = true ]; then
    REPORT="• CPU Usage: ${CPU_USAGE}%
• RAM Usage: ${RAM_USAGE}% (${RAM_USED}MB / ${RAM_TOTAL}MB)
• Disk Usage: ${DISK_USAGE}%
• Website Status: HTTP ${HTTP_STATUS}
• Response Time: ${RESPONSE_TIME}s
• SSL Cert Days Left: ${SSL_DAYS_LEFT} days"
    "${TELEGRAM_SCRIPT}" "DAILY_REPORT" "Daily VPS Health Report" "System operating health summary:" "${REPORT}"
fi

echo "Server check completed. Alerts: ${ALERT_TRIGGERED}"
