#!/bin/sh
# Apply migrations and collect static files. Safe to re-run.
# Run from inside the app's activated virtualenv, from backend/.
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$SCRIPT_DIR"

echo "==> Applying migrations..."
python manage.py migrate

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Done."
