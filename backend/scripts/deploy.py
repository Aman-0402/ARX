#!/usr/bin/env python
"""Redeploy after pulling new changes. Run with the app's Python (after
activating its virtualenv):

    python scripts/deploy.py

Builds the frontend on-server if npm is available (cPanel "Setup Node.js
App" or similar); otherwise skips that step with a reminder to upload
frontend/dist/ yourself (see DEPLOY.md section 5).
"""
import os
import shutil
import subprocess
import sys

sys.stdout.reconfigure(line_buffering=True)

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPTS_DIR)
REPO_DIR = os.path.dirname(BACKEND_DIR)
FRONTEND_DIR = os.path.join(REPO_DIR, 'frontend')

sys.path.insert(0, SCRIPTS_DIR)
import migrate as migrate_script  # noqa: E402


def main():
    print('==> Pulling latest...')
    subprocess.run(['git', 'pull'], cwd=REPO_DIR, check=True)

    print('==> Installing Python dependencies...')
    subprocess.run(
        [sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
        cwd=BACKEND_DIR, check=True,
    )

    npm = shutil.which('npm')
    if npm:
        print('==> Building frontend...')
        subprocess.run([npm, 'ci'], cwd=FRONTEND_DIR, check=True)
        subprocess.run([npm, 'run', 'build'], cwd=FRONTEND_DIR, check=True)
    else:
        print('==> npm not found in this environment — skipping frontend build.')
        print(f'    Upload your locally-built frontend/dist/ to {FRONTEND_DIR}/dist/ before restarting.')

    migrate_script.main()

    print("==> Restart the app now (cPanel 'Restart' button, or: touch tmp/restart.txt).")


if __name__ == '__main__':
    main()
