#!/usr/bin/env bash
set -e

# ==============================================================================
# Zero-Downtime Rolling Deployment & Automated Rollback Engine
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

TELEGRAM_SCRIPT="${ROOT_DIR}/scripts/telegram-notify.sh"
chmod +x "${TELEGRAM_SCRIPT}" 2>/dev/null || true

IMAGE_NAME="sportiverf-web:latest"
BACKUP_IMAGE_NAME="sportiverf-web:previous"
HEALTH_CHECK_URL="http://localhost:80/health"
MAX_RETRIES=10
RETRY_INTERVAL=3

echo "=== Starting Zero-Downtime Deployment ==="
"${TELEGRAM_SCRIPT}" "DEPLOY_START" "Deployment Started" "Deploying commit ${GITHUB_SHA:-latest} to production VPS."

# Step 1: Backup current running image for rollback capability
if docker image inspect "${IMAGE_NAME}" >/dev/null 2>&1; then
    echo "Creating backup tag of current production image..."
    docker tag "${IMAGE_NAME}" "${BACKUP_IMAGE_NAME}"
fi

# Step 2: Rebuild/Pull new production container
echo "Building new production Docker container..."
if ! docker compose -f "${ROOT_DIR}/docker-compose.prod.yml" build web; then
    echo "ERROR: Docker build failed!"
    "${TELEGRAM_SCRIPT}" "BUILD_FAILED" "Docker Build Failed" "Container image compilation error."
    exit 1
fi

# Step 3: Deploy new container with zero downtime
echo "Starting new web container..."
if ! docker compose -f "${ROOT_DIR}/docker-compose.prod.yml" up -d web; then
    echo "ERROR: Failed to start web container!"
    "${TELEGRAM_SCRIPT}" "DEPLOY_FAILED" "Deployment Failed" "Container initialization failed."
    exit 1
fi

# Step 4: Health Check Verification Loop
echo "Polling health endpoint at ${HEALTH_CHECK_URL}..."
HEALTH_PASSED=false

for i in $(seq 1 ${MAX_RETRIES}); do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_CHECK_URL}" || echo "000")
    if [ "${HTTP_CODE}" -eq 200 ]; then
        echo "Health check passed on attempt ${i}/${MAX_RETRIES} (HTTP 200 OK)."
        HEALTH_PASSED=true
        break
    fi
    echo "Health check attempt ${i}/${MAX_RETRIES} returned HTTP ${HTTP_CODE}. Retrying in ${RETRY_INTERVAL}s..."
    sleep ${RETRY_INTERVAL}
done

# Step 5: Decision Logic (Success vs Rollback)
if [ "${HEALTH_PASSED}" = true ]; then
    echo "=== Deployment Successfully Completed ==="
    # Remove stale dangling images
    docker image prune -f >/dev/null 2>&1 || true
    "${TELEGRAM_SCRIPT}" "DEPLOY_SUCCESS" "Deployment Succeeded" "Application is healthy and serving live production traffic."
    exit 0
else
    echo "CRITICAL: Health check failed! Triggering automatic rollback..."
    "${TELEGRAM_SCRIPT}" "HEALTH_FAILED" "Health Check Failed" "Container failed to respond with HTTP 200 at ${HEALTH_CHECK_URL}."
    
    # Trigger Automated Rollback
    echo "=== Executing Automatic Rollback ==="
    if docker image inspect "${BACKUP_IMAGE_NAME}" >/dev/null 2>&1; then
        docker tag "${BACKUP_IMAGE_NAME}" "${IMAGE_NAME}"
        docker compose -f "${ROOT_DIR}/docker-compose.prod.yml" up -d --force-recreate web
        echo "Rollback to previous image completed."
        "${TELEGRAM_SCRIPT}" "ROLLBACK" "Rollback Executed" "Successfully reverted live deployment to previous stable image."
    else
        echo "CRITICAL: No previous backup image found to restore!"
        "${TELEGRAM_SCRIPT}" "DEPLOY_FAILED" "Rollback Failed" "No previous image backup existed on host."
    fi
    exit 1
fi
