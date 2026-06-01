#!/usr/bin/env bash
#
# Deploy the résumé site to the self-hosted box.
#
# Strategy: build locally, rsync the runtime artifacts to the server, install
# production deps there, then (re)start the app under PM2 using
# ecosystem.config.js. Idempotent — safe to run repeatedly.
#
# Requirements on the server: node + pm2 installed, SSH access to $HOST.

set -euo pipefail

# --- config -----------------------------------------------------------------
HOST="${DEPLOY_HOST:-conrad@clay}"          # override with DEPLOY_HOST=...
REMOTE_DIR="${DEPLOY_DIR:-/var/www/resume}" # override with DEPLOY_DIR=...
BRANCH="${DEPLOY_BRANCH:-master}"

echo "▸ Switching to branch $BRANCH and pulling latest"
git checkout "$BRANCH"
git pull

echo "▸ Building production bundle"
npm ci
npm run build

echo "▸ Ensuring remote directory exists: $HOST:$REMOTE_DIR"
ssh "$HOST" "mkdir -p '$REMOTE_DIR'"

echo "▸ Syncing runtime artifacts to $HOST:$REMOTE_DIR"
# Only the files `next start` actually needs at runtime.
rsync -az --delete \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.mjs \
  ecosystem.config.js \
  "$HOST:$REMOTE_DIR/"

echo "▸ Installing production dependencies on the server"
ssh "$HOST" "cd '$REMOTE_DIR' && npm ci --omit=dev"

echo "▸ (Re)starting the app under PM2"
# `startOrReload` starts it the first time and zero-downtime reloads thereafter.
ssh "$HOST" "cd '$REMOTE_DIR' && pm2 startOrReload ecosystem.config.js && pm2 save"

echo "✓ Done — resume is live (proxy port 3000)."
