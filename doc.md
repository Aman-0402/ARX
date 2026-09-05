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
  URL), published flag, published_at. Public `GET /api/blog/` and
  `GET /api/blog/<slug>/` only return `published=True` posts. Full CRUD
  (drafts included) at `/api/admin/blog/`, staff-only.

## Auth (session-based, staff-only)

`core/views.py`: `CsrfCookieView`, `LoginView`, `LogoutView`, `MeView` at
`/api/auth/*`. Uses Django's session auth, not tokens — `LoginView` rejects
non-staff users. CSRF is enforced normally: the SPA calls `GET /api/auth/csrf/`
once on load (`hooks/use-auth.jsx`) to get the `csrftoken` cookie, then sends
it back as `X-CSRFToken` on every mutating request (`lib/api.js`'s
`apiFetch`). Works cookie-wise because Vite's dev proxy (`vite.config.js`)
makes `/api/*` same-origin from the browser's perspective — revisit
`SESSION_COOKIE_SAMESITE`/CORS settings if frontend and backend ever get
deployed on genuinely different origins.

`BlogPostAdminViewSet` (`ModelViewSet`, `IsAuthenticated`) backs
`/api/admin/blog/` — separate from the public read-only `BlogPostListView`/
`BlogPostDetailView` so drafts never leak through the public endpoints.

## Pages (`frontend/src/pages/`)

Home, About, Services, Blog (`Blog.jsx` list + `BlogPost.jsx` detail, at
`/blog` and `/blog/:slug`), Contact, Login (`/login`), and the protected
`admin/AdminBlog.jsx` (`/admin`, wrapped in `components/RequireAuth.jsx`) —
matches the API surface above. Shared chrome in `frontend/src/components/`
(Navbar, Footer, StatusBoard) is hidden on `/login` and `/admin` (see the
`isBareLayout` check in `App.jsx`).

## Open items

See "What's not built yet" in [README.md](README.md): deployment config,
email notifications on contact submissions, real verification data.
