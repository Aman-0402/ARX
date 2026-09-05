# ARX Infotech — website rebuild

Rebuild of arxinfo.tech as a React frontend + Django REST backend.

## Structure

```
frontend/   React 18 + Vite + Tailwind CSS + React Router
backend/    Django 5 + Django REST Framework
```

## Design

- **Palette** — ink `#0E1116` (dark panels), paper `#F6F5F1` (background),
  graphite `#1B1F27` (text), slate `#6B7280` (muted text), amber `#FFB020`
  (signal accent).
- **Type** — Space Grotesk for headings, Inter for body, IBM Plex Mono
  for status/metric readouts.
- **Concept** — a "systems status board": the hero and metrics read like a
  monitoring dashboard (live uptime, response time) rather than generic
  stat cards, since that's literally what the company sells.

Pages: Home, About (incl. Leadership team → Django API), Services (→ Django
API), Blog (list + post detail → Django API), Contact (working form → Django
API). Plus `/login` and a protected `/admin` dashboard — see "Admin
dashboard" below.

## Running locally

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin/
python manage.py runserver
```

Runs on `http://127.0.0.1:8000`. Uses SQLite by default — set `DB_ENGINE=mysql`
in `.env` (plus `DB_NAME`/`DB_USER`/`DB_PASSWORD`/`DB_HOST`) to point at MySQL
instead. `mysqlclient` needs system build tools (`libmysqlclient-dev` on
Debian/Ubuntu) to install.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api/*` to the Django server
(see `vite.config.js`), so the contact form and verify page work against
your local backend with no extra config.

## API

- `POST /api/contact/` — `{ name, email, phone, message }` → creates a
  `ContactSubmission`, visible in `/admin/`.
- `GET /api/blog/` — list of published `BlogPost`s, newest first.
- `GET /api/blog/<slug>/` — a single published post, `404` if not found or
  unpublished.
- `GET /api/services/` — service groups (name + image + items) in display
  order, for the public Services page.
- `GET /api/team/` — team members (name, role, bio, photo) in display order,
  for the About page's Leadership section.

Uploaded images (service group images, team photos) are served from
`/media/` in dev (`backend/media/`, gitignored — not committed). Requires
`Pillow` (in `requirements.txt`) for Django's `ImageField`.

Note: the backend still exposes `GET /api/verify/<code>/` and the
`VerificationRecord` model — no public frontend page consumes it (the
Verify page was removed), but it's fully manageable from the admin
dashboard below.

## Admin dashboard

`/login` — session-based login (staff users only). On success, redirects to
`/admin`, a sidebar-nav dashboard:

- **Overview** — stat cards (published/draft posts, unhandled contacts,
  verification records, service groups), each linking to its section.
- **Blog posts** — create/edit/delete, including unpublished drafts.
- **Contact submissions** — view messages from the public contact form,
  mark handled/unhandled, delete.
- **Verification records** — create/edit/delete the codes looked up by
  `GET /api/verify/<code>/`.
- **Services** — create/edit/delete/reorder the groups shown on the public
  Services page, each with an optional image.
- **Team** — create/edit/delete/reorder the Leadership entries (name, role,
  bio, photo) shown on the About page.

Backed by:

- `GET /api/auth/csrf/`, `POST /api/auth/login/`, `POST /api/auth/logout/`,
  `GET /api/auth/me/`
- `GET /api/admin/stats/`
- `/api/admin/blog/`, `/api/admin/verify/`, `/api/admin/services/`,
  `/api/admin/team/` — full CRUD, staff-only, session + CSRF protected
  (services/team accept `multipart/form-data` for image/photo uploads)
- `/api/admin/contact/` — same, but read/patch(`handled`)/delete only, no
  create (submissions only come from the public contact form)

Django's own `/admin/` (the built-in admin site) still works too, as a
fallback / for anything not covered above.

## What's not built yet

- Deployment config (the original stack was cPanel/PHP; this assumes a
  standard Django + static-hosted React deploy — happy to add a
  Docker/Nginx setup or adapt to your actual host).
- Email notifications on new contact submissions (currently just stored
  in the DB — wire up `django.core.mail` once you have SMTP creds).
- Real verification data — `VerificationRecord` is seeded with nothing;
  add real certificate/record rows via `/admin/`.
