#!/usr/bin/env python
"""Seeds demo content (service groups, testimonials, a sample blog post).

Idempotent — safe to re-run, won't duplicate existing rows.

    python scripts/seed_data.py
"""
import os
import subprocess
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    subprocess.run(
        [sys.executable, 'manage.py', 'seed_demo_data'],
        cwd=BACKEND_DIR,
        check=True,
    )


if __name__ == '__main__':
    main()
