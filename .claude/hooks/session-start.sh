#!/bin/bash
# SessionStart hook for Claude Code on the web (docs/revamp/05-claude-code-playbook.md).
# Installs dependencies (which regenerates src/api from api/openapi.json) and points Playwright
# at the container's preinstalled Chromium.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

# npm install (not ci) so the cached container state is reused between sessions.
npm install --no-audit --no-fund

if [ -n "${CLAUDE_ENV_FILE:-}" ] && [ -x /opt/pw-browsers/chromium ]; then
  echo "export PLAYWRIGHT_CHROMIUM_EXECUTABLE=/opt/pw-browsers/chromium" >> "$CLAUDE_ENV_FILE"
fi

echo "ResiliSense web dev environment ready (npm run dev · test · test:e2e · storybook)."
