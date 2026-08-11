#!/usr/bin/env bash
set -e

# ==============================================================================
# Disaster Recovery & System Restore Script
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [ -z "$1" ]; then
    echo "Usage: $0 <path_to_backup_archive.tar.gz>"
    exit 1
fi

BACKUP_ARCHIVE="$1"

if [ ! -f "${BACKUP_ARCHIVE}" ]; then
    echo "ERROR: Backup file ${BACKUP_ARCHIVE} not found!"
    exit 1
fi

echo "=== Starting Restoration from ${BACKUP_ARCHIVE} ==="

# Extract backup archive into target location
tar -xzf "${BACKUP_ARCHIVE}" -C "${ROOT_DIR}"

echo "Configurations restored successfully."
echo "Restarting production containers..."

docker compose -f "${ROOT_DIR}/docker-compose.prod.yml" up -d --force-recreate

echo "=== Disaster Recovery Complete ==="
