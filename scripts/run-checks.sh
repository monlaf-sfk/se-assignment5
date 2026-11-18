#!/usr/bin/env bash
# Runs the project's quality gates and prints exact commands, output tail and exit codes.
# Usage: scripts/run-checks.sh [label]   (run from repository root)
set -u
cd "$(dirname "$0")/../app" || exit 1
label="${1:-checks}"
echo "# ${label} — commit $(git rev-parse --short HEAD)$(git diff --quiet HEAD -- . || echo ' (+uncommitted)') — $(date '+%Y-%m-%d %H:%M %Z')"
echo "# node $(node -v), npm $(npm -v), $(uname -sm)"
overall=0
run() {
  echo; echo "\$ $*"
  out="$("$@" 2>&1)"; code=$?
  printf '%s\n' "$out" | sed 's/\x1b\[[0-9;]*m//g' | tail -n "${TAIL:-40}"
  echo "[exit code: $code]"
  return $code
}
run npm ci --no-audit --no-fund || overall=1
run npx vitest run || overall=1
run npm run typecheck || overall=1
run npm run lint || overall=1
run npm run build || overall=1
run npm audit --omit=dev
run npm audit
echo; echo "# gates (ci, test, typecheck, lint, build): $([ $overall -eq 0 ] && echo PASS || echo FAIL)"
exit $overall
