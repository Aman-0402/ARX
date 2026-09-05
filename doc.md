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
  `GET /api/verify/<code>/`. Managed via the admin dashboard's
  `/api/admin/verify/` (full CRUD, `lookup_field='code'`) or `/admin/`.
- `BlogPost` — title, slug (unique), excerpt, content, cover_image (optional
  URL), published flag, published_at. Public `GET /api/blog/` and
  `GET /api/blog/<slug>/` only return `published=True` posts. Full CRUD
  (drafts included) at `/api/admin/blog/`, staff-only.
- `ServiceGroup` — name, order, items (`TextField`, one item per line —
  `items_list()` splits it for the public serializer). Public
  `GET /api/services/` returns groups ordered by `order`, `items` as a list.
  Full CRUD at `/api/admin/services/`.

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

Every admin `ModelViewSet` (`BlogPostAdminViewSet`, `VerificationRecordAdminViewSet`,
`ServiceGroupAdminViewSet`) is separate from its public read-only view(s), so
drafts/full record data never leak through the public endpoints.
`ContactSubmissionAdminViewSet` overrides `http_method_names` to
`['get', 'patch', 'delete', ...]` — no create, since submissions only come
from the public `POST /api/contact/`. `AdminStatsView` is a plain `APIView`
doing `.count()`/`.filter().count()` queries, no caching — fine at this scale.

## Admin dashboard (`frontend/src/`)

- `hooks/use-auth.jsx` — `AuthProvider`/`useAuth`, fetches the CSRF cookie
  and current session (`/api/auth/me/`) once on mount; exposes
  `login`/`logout`.
- `components/RequireAuth.jsx` — redirects to `/login` if not authed;
  wraps the whole `/admin` route tree in `App.jsx`, not each page.
- `components/admin/AdminLayout.jsx` — sidebar + topbar shell, renders
  `<Outlet/>` for the nested `/admin/*` routes (`App.jsx`): index
  (`pages/admin/Overview.jsx`), `blog` (`AdminBlog.jsx`), `contact`
  (`AdminContact.jsx`), `verify` (`AdminVerify.jsx`), `services`
  (`AdminServices.jsx`).
- `components/admin/Field.jsx` — shared labeled-input wrapper reused by the
  three CRUD forms (blog/verify/services).
- Public chrome (`Navbar`, `Footer`) is hidden on `/login` and `/admin*` —
  see the `isBareLayout` check in `App.jsx`.

## Pages (`frontend/src/pages/`)

Home, About, Services, Blog (`Blog.jsx` list + `BlogPost.jsx` detail, at
`/blog` and `/blog/:slug`), Contact, Login (`/login`) — matches the public
API surface above. Admin dashboard pages live under `pages/admin/` — see
above.

## Open items

See "What's not built yet" in [README.md](README.md): deployment config,
email notifications on contact submissions, real verification data.
