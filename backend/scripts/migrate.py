#!/usr/bin/env python
"""Apply migrations and collect static files. Safe to re-run.

Run with the app's Python (whatever's on PATH after activating the
virtualenv — cPanel's "Enter to the virtual environment" command):

    python scripts/migrate.py
"""
import os
import subprocess
import sys

sys.stdout.reconfigure(line_buffering=True)  # keep our prints in order with subprocess output

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(args):
    print(f"==> {' '.join(args)}")
    subprocess.run([sys.executable, 'manage.py', *args], cwd=BACKEND_DIR, check=True)


def main():
    run(['migrate'])
    run(['collectstatic', '--noinput'])
    print('==> Done.')


if __name__ == '__main__':
    main()
