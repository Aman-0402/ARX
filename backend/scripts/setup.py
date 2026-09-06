#!/usr/bin/env python
"""First-time setup after cloning the repo and creating the Python App in
cPanel. Run with the app's Python (after activating its virtualenv):

    python scripts/setup.py

What it does: installs deps, checks .env exists, migrates, collects
static, seeds demo content, creates the admin superuser (if
DJANGO_SUPERUSER_* env vars are set — see create_superuser.py).
"""
import os
import shutil
import subprocess
import sys

sys.stdout.reconfigure(line_buffering=True)

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPTS_DIR)
sys.path.insert(0, SCRIPTS_DIR)

import migrate as migrate_script  # noqa: E402
import seed_data as seed_data_script  # noqa: E402


def main():
    print('==> Installing Python dependencies...')
    subprocess.run(
        [sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
        cwd=BACKEND_DIR, check=True,
    )

    env_path = os.path.join(BACKEND_DIR, '.env')
    if not os.path.exists(env_path):
        print('==> No .env found — copying .env.example. EDIT IT before continuing '
              '(secret key, ALLOWED_HOSTS, DB creds).')
        shutil.copyfile(os.path.join(BACKEND_DIR, '.env.example'), env_path)
        sys.exit(1)

    migrate_script.main()
    seed_data_script.main()

    if os.environ.get('DJANGO_SUPERUSER_USERNAME') and os.environ.get('DJANGO_SUPERUSER_PASSWORD'):
        subprocess.run([sys.executable, os.path.join(SCRIPTS_DIR, 'create_superuser.py')], check=True)
    else:
        print('==> Skipping superuser creation — set DJANGO_SUPERUSER_USERNAME/EMAIL/PASSWORD '
              'and re-run scripts/create_superuser.py to create one.')

    print("==> Setup complete. Restart the app in cPanel (or: touch tmp/restart.txt).")


if __name__ == '__main__':
    main()
