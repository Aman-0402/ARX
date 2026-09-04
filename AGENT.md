# Agent Instructions

Rules for AI agents (Claude Code etc.) working in this repo.

## Project

ARX Infotech website rebuild — React 18 + Vite + Tailwind frontend (`frontend/`),
Django 5 + DRF backend (`backend/`). See [README.md](README.md) for structure,
design system, and run commands, and [doc.md](doc.md) for architecture notes.

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
- Frontend: pages in `frontend/src/pages/`, shared UI in `frontend/src/components/`,
  API calls centralized in `frontend/src/lib/api.js`. Vite dev server proxies
  `/api/*` to Django (`vite.config.js`) — no hardcoded backend URLs in components.
- Keep `.env` out of git; update `.env.example` when adding new backend env vars.
