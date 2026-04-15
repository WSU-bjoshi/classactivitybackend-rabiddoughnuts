#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CRUD_SCRIPT="$ROOT_DIR/scripts/db/crud_route_pass.sh"
TEST_DB_NAME="${TEST_DB_NAME:-todo_db_test}"
TEST_PORT="${TEST_PORT:-3001}"
BASE_URL="${BASE_URL:-http://localhost:${TEST_PORT}}"
SERVER_LOG="/tmp/backend_crud_harness_server.log"
RESULTS_FILE="/tmp/crud_pass_results.txt"
SERVER_PID=""

if [ ! -x "$CRUD_SCRIPT" ]; then
  echo "Error: CRUD script not found or not executable at '$CRUD_SCRIPT'."
  exit 1
fi

wait_for_backend() {
  for _ in {1..30}; do
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/todos" || true)
    if [ "$code" = "401" ] || [ "$code" = "200" ]; then
      return 0
    fi
    sleep 1
  done
  return 1
}

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

# OLD_BEHAVIOR_REFERENCE
# if is_backend_ready; then
#   echo "Using already-running backend at $BASE_URL"
# else
#   echo "Backend not running; resetting DB and starting backend for harness..."
#   (
#     cd "$ROOT_DIR"
#     npm run db:reset
#   )
#
#   (
#     cd "$ROOT_DIR"
#     npm run start > "$SERVER_LOG" 2>&1
#   ) &
#   SERVER_PID=$!
#   STARTED_SERVER=1
#
#   if ! wait_for_backend; then
#     echo "Error: backend did not become ready in time."
#     echo "Last server log lines:"
#     tail -n 40 "$SERVER_LOG" || true
#     exit 1
#   fi
# fi

echo "Resetting isolated test database '$TEST_DB_NAME'..."
(
  cd "$ROOT_DIR"
  DB_NAME_OVERRIDE="$TEST_DB_NAME" npm run db:reset
)

echo "Starting isolated backend on port $TEST_PORT using DB '$TEST_DB_NAME'..."
(
  cd "$ROOT_DIR"
  DB_NAME_OVERRIDE="$TEST_DB_NAME" PORT="$TEST_PORT" npm run start > "$SERVER_LOG" 2>&1
) &
SERVER_PID=$!

if ! wait_for_backend; then
  echo "Error: backend did not become ready in time."
  echo "Last server log lines:"
  tail -n 40 "$SERVER_LOG" || true
  exit 1
fi

echo "Running CRUD route pass script..."
BASE_URL="$BASE_URL" bash "$CRUD_SCRIPT" > "$RESULTS_FILE"

# Expected route contract statuses for current backend behavior.
declare -A EXPECTED=(
  [T1]=201 [T2]=200 [T3]=401 [T4]=400 [T5]=401
  [T6]=200 [T7]=201 [T8]=200 [T9]=200 [T10]=200
  [T11]=200 [T12]=404 [T13]=404 [T14]=200 [T15]=200
)

TEST_IDS=(T1 T2 T3 T4 T5 T6 T7 T8 T9 T10 T11 T12 T13 T14 T15)
FAILURES=0

for id in "${TEST_IDS[@]}"; do
  actual=$(awk -F'|' -v id="$id" '$1==id {print $2}' "$RESULTS_FILE" | tail -n1)
  expected="${EXPECTED[$id]}"

  if [ -z "$actual" ]; then
    echo "FAIL $id: no result line found"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  if [ "$actual" != "$expected" ]; then
    echo "FAIL $id: expected $expected, got $actual"
    FAILURES=$((FAILURES + 1))
  else
    echo "PASS $id: $actual"
  fi
done

if [ "$FAILURES" -ne 0 ]; then
  echo "CRUD harness failed with $FAILURES failing checks."
  echo "Raw results file: $RESULTS_FILE"
  exit 1
fi

echo "CRUD harness passed: all endpoint checks matched expected statuses."
