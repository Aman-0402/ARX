#!/bin/sh
# Seeds demo content (service groups, testimonials, a sample blog post).
# Idempotent — safe to re-run, won't duplicate existing rows.
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$SCRIPT_DIR"

python manage.py seed_demo_data
