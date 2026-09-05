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
  pipeline yet. No frontend page consumes this anymore (Verify page removed);
  the model and endpoint are still live.
- `BlogPost` — title, slug (unique), excerpt, content, cover_image (optional
  URL), published flag, published_at. `GET /api/blog/` and
  `GET /api/blog/<slug>/` only return `published=True` posts. Managed via
  `/admin/` — `slug` auto-fills from `title` there.

## Pages (`frontend/src/pages/`)

Home, About, Services, Blog (`Blog.jsx` list + `BlogPost.jsx` detail, at
`/blog` and `/blog/:slug`), Contact — matches the API surface above.
Shared chrome in `frontend/src/components/` (Navbar, Footer, StatusBoard).

## Open items

See "What's not built yet" in [README.md](README.md): deployment config,
email notifications on contact submissions, real verification data.
