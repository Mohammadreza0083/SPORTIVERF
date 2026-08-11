#!/usr/bin/env bash

# ==============================================================================
# Telegram Universal Notification Script
# ==============================================================================

TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-8921060827:AAHUNo_mdKGBwTlbysIf3nbBYd3BIX9k1Pw}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-269309616}"

EVENT_TYPE="${1:-INFO}"
TITLE="${2:-Notification}"
MESSAGE="${3:-No detailed message provided.}"
EXTRA_DETAILS="${4:-}"

# Emojis based on event type
case "${EVENT_TYPE}" in
  "BUILD_START")     EMOJI="🔨" ;;
  "BUILD_SUCCESS")   EMOJI="✅" ;;
  "BUILD_FAILED")    EMOJI="❌" ;;
  "DEPLOY_START")    EMOJI="🚀" ;;
  "DEPLOY_SUCCESS")  EMOJI="🎉" ;;
  "DEPLOY_FAILED")   EMOJI="🔥" ;;
  "ROLLBACK")        EMOJI="🔄" ;;
  "HEALTH_FAILED")   EMOJI="🚨" ;;
  "DAILY_REPORT")    EMOJI="📊" ;;
  "ALERT")           EMOJI="⚠️" ;;
  *)                 EMOJI="ℹ️" ;;
esac

TIMESTAMP=$(date -u "+%Y-%m-%d %H:%M:%S UTC")

TEXT="<b>${EMOJI} [SportivERF SRE] ${TITLE}</b>

<b>Message:</b> ${MESSAGE}
<b>Time:</b> <code>${TIMESTAMP}</code>"

if [ -n "${EXTRA_DETAILS}" ]; then
  TEXT="${TEXT}
<b>Details:</b>
<code>${EXTRA_DETAILS}</code>"
fi

# Send Telegram Message via HTTP API
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=${TEXT}" \
  -d "parse_mode=HTML" \
  -d "disable_web_page_preview=true" > /dev/null

echo "Telegram notification sent [${EVENT_TYPE}]: ${TITLE}"
