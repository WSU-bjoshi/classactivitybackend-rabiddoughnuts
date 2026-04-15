#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
RESET_SQL="$ROOT_DIR/scripts/db/reset_tables.sql"
SCHEMA_SQL="$ROOT_DIR/database.sql"
SCHEMA_TMP=""

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# DB_HOST="${DB_HOST:-localhost}"
# DB_USER="${DB_USER:-root}"
# DB_PASS="${DB_PASS:-}"
# DB_NAME="${DB_NAME:-todo_db}"
DB_HOST="${DB_HOST_OVERRIDE:-${DB_HOST:-localhost}}"
DB_USER="${DB_USER_OVERRIDE:-${DB_USER:-root}}"
DB_PASS="${DB_PASS_OVERRIDE:-${DB_PASS:-}}"
DB_NAME="${DB_NAME_OVERRIDE:-${DB_NAME:-todo_db}}"
DB_PROTOCOL="${DB_PROTOCOL_OVERRIDE:-${DB_PROTOCOL:-}}"

# if command -v mysql >/dev/null 2>&1; then
#   DB_CLIENT="mysql"
# elif command -v mariadb >/dev/null 2>&1; then
if command -v mariadb >/dev/null 2>&1; then
  DB_CLIENT="mariadb"
elif command -v mysql >/dev/null 2>&1; then
  DB_CLIENT="mysql"
else
  echo "Error: neither mariadb nor mysql client was found in PATH."
  exit 1
fi

# Keep previous selection branch for class-reference history.
: <<'OLD_CLIENT_SELECTION'
if command -v mysql >/dev/null 2>&1; then
  DB_CLIENT="mysql"
elif command -v mariadb >/dev/null 2>&1; then
  DB_CLIENT="mariadb"
else
  echo "Error: neither mysql nor mariadb client was found in PATH."
  exit 1
fi
OLD_CLIENT_SELECTION

# DB_ARGS=("-h" "$DB_HOST" "--protocol=TCP" "--connect-timeout=10" "-u" "$DB_USER")
DB_ARGS=("-h" "$DB_HOST" "--connect-timeout=10" "-u" "$DB_USER")
if [ -n "$DB_PROTOCOL" ]; then
  DB_ARGS+=("--protocol=$DB_PROTOCOL")
fi
if [ -n "$DB_PASS" ]; then
  DB_ARGS+=("-p$DB_PASS")
fi

echo "Creating database '$DB_NAME' if needed..."
# "$DB_CLIENT" "${DB_ARGS[@]}" -e "CREATE DATABASE IF NOT EXISTS \\`$DB_NAME\\`;"
"$DB_CLIENT" "${DB_ARGS[@]}" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;"

echo "Dropping existing tables in '$DB_NAME'..."
"$DB_CLIENT" "${DB_ARGS[@]}" "$DB_NAME" < "$RESET_SQL"

echo "Rebuilding schema in '$DB_NAME' from database.sql..."
# "$DB_CLIENT" "${DB_ARGS[@]}" < "$SCHEMA_SQL"
SCHEMA_TMP="$(mktemp /tmp/rebuild_schema.XXXXXX.sql)"

cleanup() {
  if [ -n "$SCHEMA_TMP" ] && [ -f "$SCHEMA_TMP" ]; then
    rm -f "$SCHEMA_TMP"
  fi
}

trap cleanup EXIT INT TERM

sed \
  -e "s/^CREATE DATABASE IF NOT EXISTS todo_db;$/CREATE DATABASE IF NOT EXISTS $DB_NAME;/" \
  -e "s/^USE todo_db;$/USE $DB_NAME;/" \
  "$SCHEMA_SQL" > "$SCHEMA_TMP"

"$DB_CLIENT" "${DB_ARGS[@]}" < "$SCHEMA_TMP"

echo "Done. Database '$DB_NAME' reset and schema reapplied."
