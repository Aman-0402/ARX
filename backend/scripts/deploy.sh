#!/bin/sh
# Redeploy after pulling new changes. Run from inside the app's activated
# virtualenv, from anywhere — this cds into backend/ itself.
#
# Builds the frontend on-server if npm is available (cPanel "Setup Node.js
# App" or similar); otherwise skips that step with a reminder to upload
# frontend/dist/ yourself (see DEPLOY.md section 5).
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")/.." && pwd)
BACKEND_DIR="$SCRIPT_DIR"
REPO_DIR=$(cd "$BACKEND_DIR/.." && pwd)

cd "$REPO_DIR"
echo "==> Pulling latest..."
git pull

cd "$BACKEND_DIR"
echo "==> Installing Python dependencies..."
pip install -r requirements.txt

if command -v npm >/dev/null 2>&1; then
  echo "==> Building frontend..."
  (cd "$REPO_DIR/frontend" && npm ci && npm run build)
else
  echo "==> npm not found in this environment — skipping frontend build."
  echo "    Upload your locally-built frontend/dist/ to $REPO_DIR/frontend/dist/ before restarting."
fi

sh scripts/migrate.sh

echo "==> Restart the app now (cPanel 'Restart' button, or: touch tmp/restart.txt)."
