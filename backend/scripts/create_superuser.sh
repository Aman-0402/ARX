#!/bin/sh
# Non-interactive superuser creation/reset — safe to re-run.
#
# Usage:
#   DJANGO_SUPERUSER_USERNAME=admin \
#   DJANGO_SUPERUSER_EMAIL=admin@arxinfo.tech \
#   DJANGO_SUPERUSER_PASSWORD='choose-a-strong-one' \
#   ./scripts/create_superuser.sh
#
# If the username already exists, its password is updated to
# DJANGO_SUPERUSER_PASSWORD instead of failing (Django's own
# `createsuperuser --noinput` errors out on an existing username).
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$SCRIPT_DIR"

: "${DJANGO_SUPERUSER_USERNAME:?Set DJANGO_SUPERUSER_USERNAME}"
: "${DJANGO_SUPERUSER_EMAIL:?Set DJANGO_SUPERUSER_EMAIL}"
: "${DJANGO_SUPERUSER_PASSWORD:?Set DJANGO_SUPERUSER_PASSWORD}"

python manage.py shell -c "
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ['DJANGO_SUPERUSER_USERNAME']
email = os.environ['DJANGO_SUPERUSER_EMAIL']
password = os.environ['DJANGO_SUPERUSER_PASSWORD']

user, created = User.objects.get_or_create(username=username, defaults={'email': email})
user.email = email
user.is_staff = True
user.is_superuser = True
user.set_password(password)
user.save()

print('created' if created else 'updated', username)
"
