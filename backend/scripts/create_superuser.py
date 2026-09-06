#!/usr/bin/env python
"""Non-interactive superuser creation/reset — safe to re-run.

Usage:
    DJANGO_SUPERUSER_USERNAME=admin \
    DJANGO_SUPERUSER_EMAIL=admin@arxinfo.tech \
    DJANGO_SUPERUSER_PASSWORD='choose-a-strong-one' \
    python scripts/create_superuser.py

If the username already exists, its password/email are updated instead
of failing (Django's own `createsuperuser --noinput` errors out on an
existing username).
"""
import os
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django  # noqa: E402

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402


def main():
    required = ['DJANGO_SUPERUSER_USERNAME', 'DJANGO_SUPERUSER_EMAIL', 'DJANGO_SUPERUSER_PASSWORD']
    missing = [name for name in required if not os.environ.get(name)]
    if missing:
        sys.exit(f"Missing env var(s): {', '.join(missing)}")

    username = os.environ['DJANGO_SUPERUSER_USERNAME']
    email = os.environ['DJANGO_SUPERUSER_EMAIL']
    password = os.environ['DJANGO_SUPERUSER_PASSWORD']

    User = get_user_model()
    user, created = User.objects.get_or_create(username=username, defaults={'email': email})
    user.email = email
    user.is_staff = True
    user.is_superuser = True
    user.set_password(password)
    user.save()

    print('created' if created else 'updated', username)


if __name__ == '__main__':
    main()
