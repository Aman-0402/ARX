"""Entry point for cPanel's "Setup Python App" (Passenger).

cPanel generates its own passenger_wsgi.py stub in the app directory when
you create the Python App — replace its contents with this file (or copy
this one over it) so Passenger finds Django's WSGI application.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from config.wsgi import application  # noqa: E402
