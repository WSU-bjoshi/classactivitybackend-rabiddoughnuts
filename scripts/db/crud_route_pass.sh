#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE_URL:-http://localhost:3000}"
TS="$(date +%s)"
EMAIL="crud-pass-${TS}@example.com"
PASS="pass123"
NAME="crud pass user"
OUT="/tmp/crud_pass_results.txt"
: > "$OUT"

run_test() {
  local id="$1"
  local method="$2"
  local url="$3"
  local auth_token="${4:-}"
  local body="${5:-}"

  local args=(-sS -X "$method" "$url" -H "Content-Type: application/json")
  if [ -n "$auth_token" ]; then
    args+=(-H "Authorization: Bearer $auth_token")
  fi
  if [ -n "$body" ]; then
    args+=(-d "$body")
  fi

  local resp
  resp=$(curl "${args[@]}" -w "\nHTTP_CODE:%{http_code}")
  local code
  code=$(printf '%s' "$resp" | sed -n 's/^HTTP_CODE://p' | tail -n1)
  local body_only
  body_only=$(printf '%s' "$resp" | sed '/^HTTP_CODE:/d')
  printf '%s|%s|%s\n' "$id" "$code" "$body_only" >> "$OUT"
}

run_test T1 POST "$BASE/api/auth/register" "" "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}"
TOKEN=$(grep '^T1|' "$OUT" | cut -d'|' -f3- | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.token||'')}catch{process.stdout.write('')}})")

run_test T2 POST "$BASE/api/auth/login" "" "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}"
run_test T3 POST "$BASE/api/auth/login" "" "{\"email\":\"$EMAIL\",\"password\":\"badpass\"}"
run_test T4 POST "$BASE/api/auth/register" "" "{\"name\":\"x\",\"email\":\"missing-pass-${TS}@example.com\"}"
run_test T5 GET "$BASE/api/todos"
run_test T6 GET "$BASE/api/todos" "$TOKEN"
run_test T7 POST "$BASE/api/todos" "$TOKEN" "{\"tasks\":\"crud smoke task\"}"
TODO_ID=$(grep '^T7|' "$OUT" | cut -d'|' -f3- | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j.todo?.task_id||''))}catch{process.stdout.write('')}})")
run_test T8 GET "$BASE/api/todos/$TODO_ID" "$TOKEN"
run_test T9 PATCH "$BASE/api/todos/$TODO_ID/toggle" "$TOKEN"
run_test T10 GET "$BASE/api/todos/incomplete" "$TOKEN"
run_test T11 DELETE "$BASE/api/todos/$TODO_ID" "$TOKEN"
run_test T12 GET "$BASE/api/todos/$TODO_ID" "$TOKEN"
run_test T13 DELETE "$BASE/api/todos/delete/$TODO_ID" "$TOKEN"
run_test T14 GET "$BASE/api/admin/todos"
run_test T15 GET "$BASE/api/admin/users"

cat "$OUT"
