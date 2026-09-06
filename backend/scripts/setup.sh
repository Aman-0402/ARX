#!/bin/sh
# First-time setup after cloning the repo and creating the Python App in
# cPanel. Run from inside the app's activated virtualenv (the "Enter to the
# virtual environment" command cPanel gives you), from anywhere — this cds
# into backend/ itself.
#
# What it does: installs deps, checks .env exists, migrates, collects
# static, seeds demo content, creates the admin superuser (if
# DJANGO_SUPERUSER_* env vars are set — see create_superuser.sh).
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$SCRIPT_DIR"

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

if [ ! -f .env ]; then
  echo "==> No .env found — copying .env.example. EDIT IT before continuing (secret key, ALLOWED_HOSTS, DB creds)."
  cp .env.example .env
  exit 1
fi

sh scripts/migrate.sh
sh scripts/seed_data.sh

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  sh scripts/create_superuser.sh
else
  echo "==> Skipping superuser creation — set DJANGO_SUPERUSER_USERNAME/EMAIL/PASSWORD and re-run scripts/create_superuser.sh to create one."
fi

echo "==> Setup complete. Restart the app in cPanel (or: touch tmp/restart.txt)."
