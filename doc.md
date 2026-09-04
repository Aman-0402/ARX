# Documentation

## Architecture

Two-service split, no shared runtime:

- **frontend/** — React 18 + Vite + Tailwind CSS + React Router. Static build,
  served separately from the API. Talks to backend only via `frontend/src/lib/api.js`.
- **backend/** — Django 5 + Django REST Framework. `backend/config/` holds
  settings/urls/wsgi; `backend/core/` holds the one app (models, serializers,
  views, urls, admin).

## Data model (`backend/core/models.py`)

- `ContactSubmission` — name, email, phone, message, created_at, handled flag.
  Written by `POST /api/contact/`, read/managed via Django admin.
- `VerificationRecord` — code (unique), holder_name, record_type
  (certificate / internship / project), issued_on, notes. Read by
  `GET /api/verify/<code>/`, seeded manually via admin or shell — no import
  pipeline yet.

## Pages (`frontend/src/pages/`)

Home, About, Services, Contact, Verify — matches the API surface above.
Shared chrome in `frontend/src/components/` (Navbar, Footer, StatusBoard).

## Open items

See "What's not built yet" in [README.md](README.md): deployment config,
email notifications on contact submissions, real verification data.
