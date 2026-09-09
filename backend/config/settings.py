import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-only-insecure-key-change-me')
DEBUG = os.getenv('DJANGO_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Canonical public URL, used for robots.txt/sitemap.xml and SEO canonical
# links — no trailing slash.
SITE_URL = os.getenv('SITE_URL', 'https://arxinfo.tech')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Defaults to SQLite for local development. Set DB_ENGINE=mysql to use MySQL
# (matches the original project's MySQL/PostgreSQL plan).
if os.getenv('DB_ENGINE') == 'mysql':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'arx_infotech'),
            'USER': os.getenv('DB_USER', 'root'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', '127.0.0.1'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'OPTIONS': {'charset': 'utf8mb4'},
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# The built React app (frontend/dist/, produced by `npm run build`) lives
# next to this project. Its hashed asset files (frontend/dist/assets/*) are
# collected as Django static files and served by whitenoise; index.html is
# served separately by the SPA catch-all view in config/urls.py.
FRONTEND_DIST = BASE_DIR.parent / 'frontend' / 'dist'

STATIC_URL = '/assets/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [FRONTEND_DIST / 'assets'] if (FRONTEND_DIST / 'assets').exists() else []
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle'],
    'DEFAULT_THROTTLE_RATES': {'anon': '30/min'},
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework.authentication.SessionAuthentication'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
}

CORS_ALLOWED_ORIGINS = [
    origin for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173'
    ).split(',')
    if origin
]
CORS_ALLOW_CREDENTIALS = True

# Only matters if the frontend is ever served from a different origin than
# this backend (e.g. a subdomain split). The current prod setup serves both
# from the same origin (arxinfo.tech), so this is empty by default — set
# DJANGO_CSRF_TRUSTED_ORIGINS if that ever changes.
#
# In dev, Vite's proxy (changeOrigin: true) rewrites the Host header to
# 127.0.0.1:8000 when forwarding to Django, but the browser's Origin header
# still says localhost:5173 — Django's CSRF Origin check rejects that
# mismatch unless it's explicitly trusted. Default to the Vite dev origin
# when DEBUG and nothing else is configured, so `npm run dev` works out of
# the box without every contributor needing to edit .env.
csrf_trusted = os.getenv('DJANGO_CSRF_TRUSTED_ORIGINS', '')
if csrf_trusted:
    CSRF_TRUSTED_ORIGINS = csrf_trusted.split(',')
elif DEBUG:
    CSRF_TRUSTED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']
else:
    CSRF_TRUSTED_ORIGINS = []

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
