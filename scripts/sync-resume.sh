#!/usr/bin/env bash
#
# Push the committed seed (lib/data.ts -> defaultResumeData) into the LIVE
# SQLite database, overwriting every section. Run this after deploying when you
# want the running site to match the committed seed.
#
# This wrapper selects the Node version pinned in .nvmrc before running the
# sync. That matters because scripts/sync-resume.mjs loads the TypeScript seed
# (lib/data.ts) via Node's native type-stripping, which only exists on newer
# Node versions — under an older default Node it fails with
# ERR_UNKNOWN_FILE_EXTENSION. See README "Node version".
#
# Usage: npm run sync-resume
#
# WARNING: destructive. It DELETEs and re-inserts socials, experience, skills,
# projects, and education, and overwrites the profile row, so any edits made
# through /admin that aren't reflected in the seed will be lost.

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
  echo "⚠ nvm not found — running under $(node -v); ensure it matches .nvmrc" >&2
fi

node scripts/sync-resume.mjs
