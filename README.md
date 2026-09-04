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

Pages: Home, About, Services, Contact (working form → Django API), Verify
(certificate/record lookup by code → Django API).

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
- `GET /api/verify/<code>/` — looks up a `VerificationRecord` by code,
  `404` if not found. Add records via `/admin/` or the Django shell.

## What's not built yet

- Deployment config (the original stack was cPanel/PHP; this assumes a
  standard Django + static-hosted React deploy — happy to add a
  Docker/Nginx setup or adapt to your actual host).
- Email notifications on new contact submissions (currently just stored
  in the DB — wire up `django.core.mail` once you have SMTP creds).
- Real verification data — `VerificationRecord` is seeded with nothing;
  add real certificate/record rows via `/admin/`.
