#!/usr/bin/env bash
set -euo pipefail

BACKEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="${FRONTEND_DIR:-$BACKEND_DIR/../classactivityfrontend-rabiddoughnuts}"
ENV_FILE="$BACKEND_DIR/.env"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

DB_HOST="${DB_HOST_OVERRIDE:-${DB_HOST:-localhost}}"
DB_USER="${DB_USER_OVERRIDE:-${DB_USER:-root}}"
DB_PASS="${DB_PASS_OVERRIDE:-${DB_PASS:-}}"

if command -v mariadb-admin >/dev/null 2>&1; then
  DB_PING_BIN="mariadb-admin"
elif command -v mysqladmin >/dev/null 2>&1; then
  DB_PING_BIN="mysqladmin"
else
  echo "Error: neither mariadb-admin nor mysqladmin was found in PATH."
  exit 1
fi

DB_PING_ARGS=("-h" "$DB_HOST" "-u" "$DB_USER")
if [ -n "$DB_PASS" ]; then
  DB_PING_ARGS+=("-p$DB_PASS")
fi

db_ready() {
  timeout 5 "$DB_PING_BIN" "${DB_PING_ARGS[@]}" ping --silent >/dev/null 2>&1
}

start_db_service() {
  if ! command -v systemctl >/dev/null 2>&1; then
    return 1
  fi

  if systemctl start mariadb >/dev/null 2>&1 || systemctl start mysql >/dev/null 2>&1; then
    return 0
  fi

  if command -v sudo >/dev/null 2>&1; then
    if sudo -n systemctl start mariadb >/dev/null 2>&1 || sudo -n systemctl start mysql >/dev/null 2>&1; then
      return 0
    fi
  fi

  return 1
}

if db_ready; then
  echo "Database is reachable."
else
  echo "Database is not reachable. Attempting to start DB service..."
  start_db_service || true

  for _ in {1..20}; do
    if db_ready; then
      echo "Database is now reachable."
      break
    fi
    sleep 1
  done

  if ! db_ready; then
    echo "Error: database is still not reachable at host '$DB_HOST'."
    echo "Start DB manually and rerun this script."
    exit 1
  fi
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Error: frontend directory not found at '$FRONTEND_DIR'."
  exit 1
fi

echo "Starting backend (npm run start) in $BACKEND_DIR"
(
  cd "$BACKEND_DIR"
  npm run start
) &
BACKEND_PID=$!

echo "Starting frontend (npm run dev) in $FRONTEND_DIR"
(
  cd "$FRONTEND_DIR"
  npm run dev
) &
FRONTEND_PID=$!

cleanup() {
  echo "Stopping backend/frontend processes..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

wait -n "$BACKEND_PID" "$FRONTEND_PID"
STATUS=$?

echo "A process exited with status $STATUS."
exit "$STATUS"
