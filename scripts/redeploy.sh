#!/usr/bin/env bash
#
# Build and redeploy the résumé app on this box (in-place, no git pull).
#
# Bulletproof against the native-module version trap: it selects the Node
# version pinned in .nvmrc before building, so the better-sqlite3 binary always
# matches the runtime PM2 launches the app with. See README "Node version".
#
# Usage: npm run redeploy

set -euo pipefail

cd "$(dirname "$0")/.."

# Select the pinned Node version (nvm can't be sourced from an npm script
# directly, which is why this lives in a shell script).
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
  nvm install   # installs the .nvmrc version if missing, then selects it
  nvm use
else
  echo "⚠ nvm not found — building under $(node -v); ensure it matches .nvmrc" >&2
fi

echo "▸ Building production bundle"
npm run build

echo "▸ Restarting PM2 process"
pm2 restart resume

echo "✓ Resume app redeployed successfully."
