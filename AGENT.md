# Agent Instructions

Rules for AI agents (Claude Code etc.) working in this repo.

## Project

ARX Infotech website rebuild — React 18 + Vite + Tailwind frontend (`frontend/`),
Django 5 + DRF backend (`backend/`). Public marketing site (Home/About/Services/Blog/
Contact) plus a session-authenticated `/admin` dashboard for managing all of it
(blog posts incl. public submission approval, services, team, testimonials, contact
submissions, verification records). See [README.md](README.md) for structure, design
system, and run commands, and [doc.md](doc.md) for architecture notes.

## Commit & Push Policy

- Every phase, update, or change gets committed and pushed to GitHub (`origin main`).
- No separate confirmation step needed before pushing normal (non-destructive) commits.
- Never force-push or rewrite history without explicit ask.
- Commits carry a `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer —
  this is enforced by the harness and cannot be dropped, even though the user asked
  for no co-author line.

## Conventions

- Backend: Django REST Framework, SQLite by default, MySQL via `DB_ENGINE=mysql` env.
  Models live in `backend/core/models.py`; migrations must be generated
  (`python manage.py makemigrations`) and committed, not hand-written.
- Every content model follows the same admin pattern: a public read-only
  `ListAPIView`/`RetrieveAPIView` (published-only where relevant) plus a separate
  `ModelViewSet` under `/api/admin/<thing>/` (`IsAuthenticated`) — never expose drafts
  or admin fields through the public endpoint. Models with an image (`ServiceGroup`,
  `TeamMember`, `BlogPost`) use a real `ImageField` + `MultiPartParser` on the admin
  viewset, not a URL field.
- Frontend: pages in `frontend/src/pages/` (admin pages in `pages/admin/`), shared UI
  in `frontend/src/components/` (scroll/animation primitives in `components/motion/`),
  API calls centralized in `frontend/src/lib/api.js` (`apiFetch` for JSON,
  `apiFetchForm` for file uploads — admin forms with an image field always build
  `FormData` and use the latter). Vite dev server proxies `/api/*` to Django
  (`vite.config.js`) — no hardcoded backend URLs in components.
- Design system: blue base palette + 5 accent colors (amber/coral/mint/sunbeam/grape,
  `tailwind.config.js`) used for per-card/per-item color-coding across the site.
  Motion via `framer-motion` — reuse `components/motion/Reveal.jsx` (scroll-in),
  `StaggerGrid`/`StaggerItem` (staggered grids), `GradientBlobs`/`StarField`
  (decorative backgrounds) rather than one-off animations. New public pages/sections
  should match this system, not introduce a different visual language.
- Keep `.env` out of git; update `.env.example` when adding new backend env vars.
