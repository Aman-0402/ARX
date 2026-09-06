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
- `BlogPost` — title, slug (unique), excerpt, content (`TextField`, holds
  HTML from the rich text editor — rendered public-side via
  `dangerouslySetInnerHTML` in `BlogPost.jsx`, styled by the `.rich-content`
  rules in `index.css` since there's no `@tailwindcss/typography`),
  cover_image (`ImageField`, optional), published flag, published_at,
  submitter_name/submitter_email (blank for admin-authored posts, filled in
  for public submissions). Public `GET /api/blog/` and
  `GET /api/blog/<slug>/` only return `published=True` posts. Full CRUD
  (drafts included) at `/api/admin/blog/`, staff-only.
  `POST /api/blog/submit/` (`BlogPostSubmitView`, `AllowAny`) is the public
  "write for us" intake — always forces `published=False` and stamps
  `published_at=now()` in `perform_create`, regardless of what the client
  sends, so a submission can only ever land as a pending draft, never
  auto-publish. `_unique_blog_slug()` (module-level helper in
  `serializers.py`) generates the slug for both this and the admin
  serializer's create path — shared so the numbering suffix (`-2`, `-3`, …)
  stays consistent between the two entry points.
- `ServiceGroup` — name, order, image (`ImageField`, optional), items
  (`TextField`, one item per line — `items_list()` splits it for the public
  serializer). Public `GET /api/services/` returns groups ordered by
  `order`, `items` as a list. Full CRUD at `/api/admin/services/`.
- `TeamMember` — name, role, bio (optional), photo (`ImageField`, optional),
  order. Public `GET /api/team/` returns members ordered by `order`. Full
  CRUD at `/api/admin/team/`. Shown on the About page's Leadership section.
- `Testimonial` — quote, name, org (optional), order, published flag.
  Public `GET /api/testimonials/` only returns `published=True`, ordered by
  `order`. Full CRUD (drafts included) at `/api/admin/testimonials/`. Shown
  in the homepage's running (marquee) testimonial strip — see Home.jsx note
  below.

Both `ImageField`s need `Pillow` (`requirements.txt`) and
`MEDIA_URL`/`MEDIA_ROOT` (`config/settings.py`) — files land in
`backend/media/` (gitignored) and are served at `/media/*` only when
`DEBUG=True` (`config/urls.py`'s `static()` helper); a real deploy needs its
own media serving (nginx, S3, whatever).

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
`ServiceGroupAdminViewSet`, `TeamMemberAdminViewSet`, `TestimonialAdminViewSet`) is separate from its
public read-only view(s), so drafts/full record data never leak through the
public endpoints. `BlogPostAdminViewSet`, `ServiceGroupAdminViewSet`, and
`TeamMemberAdminViewSet` set `parser_classes = [MultiPartParser, FormParser,
JSONParser]` so they accept both plain JSON and `multipart/form-data`
(needed for the image/photo file uploads — the frontend always sends
`FormData` for these three, even when no file is attached, since
`apiFetchForm` in `lib/api.js` doesn't JSON-encode).

`BlogPostSubmitView` is `AllowAny` + the same multipart parsers, but plain
`fetch` (`submitBlogPost` in `lib/api.js`) rather than `apiFetchForm` — no
`X-CSRFToken` header, same as `submitContact`. This works because DRF's
`APIView.as_view()` wraps the view in Django's `csrf_exempt`, and
`SessionAuthentication.enforce_csrf` (DRF's own CSRF layer) only fires for
an *authenticated* request — an anonymous POST hits neither check. Don't
copy this pattern onto an endpoint that's ever reachable while
authenticated, or it becomes a real CSRF hole.
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
  (`AdminServices.jsx`), `team` (`AdminTeam.jsx`), `testimonials`
  (`AdminTestimonials.jsx`).
- `components/admin/Field.jsx` — shared labeled-input wrapper reused by all
  the CRUD forms.
- `AdminServices.jsx`/`AdminTeam.jsx`/`AdminBlog.jsx` build a `FormData` on
  submit and always go through `apiFetchForm`, never `apiFetch` — mixing
  JSON and multipart bodies on the same endpoint works fine server-side
  (see parser_classes above) but the frontend picks one per-entity and
  sticks to it.
- `components/RichTextEditor.jsx` — thin wrapper around `react-quill`
  (`ql-toolbar`/`ql-container` restyled in `index.css` under
  `.rich-editor`), used by both `AdminBlog.jsx` and the public
  `BlogSubmit.jsx` for the `content` field. Its `onChange` hands back an
  HTML string, stored as-is in `BlogPost.content`.
- `AdminBlog.jsx` surfaces public submissions (`!post.published &&
  post.submitter_name`) in a banner above the form, listing who submitted
  what; clicking one loads it into the edit form (with the submitter's
  name/email shown read-only) so a staff member can review, tweak, and flip
  `published` on to approve — or just delete it to reject.
- Public chrome (`Navbar`, `Footer`) is hidden on `/login` and `/admin*` —
  see the `isBareLayout` check in `App.jsx`.

## Pages (`frontend/src/pages/`)

Home, About, Services, Blog (`Blog.jsx` list + `BlogPost.jsx` detail +
`BlogSubmit.jsx` public write-up form, at `/blog`, `/blog/:slug`, and
`/blog/submit`), Contact, Login (`/login`) — matches the public API surface
above. Admin dashboard pages live under `pages/admin/` — see above.

`BlogSubmit.jsx` posts straight to `POST /api/blog/submit/` (no auth) and
shows an inline "submitted for review" confirmation state rather than
redirecting — the post won't appear on `/blog` until a staff member
approves it in `AdminBlog.jsx`. In `App.jsx`, `/blog/submit` is a sibling
route of `/blog/:slug`; React Router v6 ranks static path segments over
dynamic ones automatically, so route declaration order there doesn't
matter (unlike Django's `urls.py`, where `blog/submit/` has to come before
`blog/<slug:slug>/`).

`Home.jsx`'s testimonials section fetches `GET /api/testimonials/` (no
static fallback array anymore) and renders an infinite horizontal marquee:
the fetched list is duplicated once (`[...testimonials, ...testimonials]`)
inside a `flex w-max` track running the `.animate-marquee` CSS animation
(`index.css` — `@keyframes marquee` translates -50%, so the duplicate seam
is invisible; pauses on `:hover`). Each card's accent color cycles through
`testimonialAccents` (5 colors) by `original index % testimonials.length %
5`, not by duplicated-array index, so colors stay consistent across the
seam. `prefers-reduced-motion` already disables all animations globally
(`index.css`), covering this one too.

## Open items

See "What's not built yet" in [README.md](README.md): deployment config,
email notifications on contact submissions, real verification data.
