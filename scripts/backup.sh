#!/usr/bin/env bash
set -e

# ==============================================================================
# Automated VPS Backup Script
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

BACKUP_DIR="${ROOT_DIR}/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="sportiverf_backup_${TIMESTAMP}.tar.gz"

TELEGRAM_SCRIPT="${SCRIPT_DIR}/telegram-notify.sh"
chmod +x "${TELEGRAM_SCRIPT}" 2>/dev/null || true

mkdir -p "${BACKUP_DIR}"

echo "=== Starting Backup Process ==="

# Create compressed archive containing Nginx configs, SSL certs, and env configurations
tar -czf "${BACKUP_DIR}/${ARCHIVE_NAME}" \
    -C "${ROOT_DIR}" nginx docker-compose.prod.yml \
    -C /etc/letsencrypt . 2>/dev/null || true

# Retention policy: Keep backups for last 14 days
find "${BACKUP_DIR}" -type f -name "sportiverf_backup_*.tar.gz" -mtime +14 -exec rm -f {} \;

BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${ARCHIVE_NAME}" | cut -f1)

echo "Backup created successfully: ${ARCHIVE_NAME} (${BACKUP_SIZE})"
"${TELEGRAM_SCRIPT}" "INFO" "Automated Backup Completed" "Backup archive generated: <code>${ARCHIVE_NAME}</code> (${BACKUP_SIZE})"
