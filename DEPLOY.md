# Deploying to arxinfo.tech (cPanel shared hosting)

One Python app (Django, via Passenger) serves everything under `arxinfo.tech` —
the API (`/api/*`), Django admin (`/admin/*`), uploaded media (`/media/*`), the
built React app's JS/CSS (`/assets/*`, via whitenoise), and the React app itself
(any other path, so client-side routes like `/about` work on refresh). No
subdomain, no separate static host, no CORS to worry about — it's all one origin.

## 0. Prerequisites

- SSH access to the cPanel account, and "Setup Python App" visible in cPanel.
- A MySQL database created via cPanel's **MySQL® Databases** tool (cPanel
  prefixes both the DB name and username with your cPanel username, e.g.
  `cpaneluser_arx_db` / `cpaneluser_arxadmin` — use the *full* prefixed names
  below, not just `arx_db`).
- `arxinfo.tech` (and `www`) already pointed at this cPanel account's IP.

## 1. Get the code onto the server

SSH in, then clone the **whole repo** (not just `backend/`) somewhere under
your home directory — the backend expects `frontend/dist/` as a sibling
directory (`backend/config/settings.py`'s `FRONTEND_DIST`), so both need to
live under the same parent:

```bash
cd ~
git clone https://github.com/Aman-0402/ARX.git arx
```

## 2. cPanel → Setup Python App

Create a new Python App:

- **Python version**: highest available 3.10+ (3.11 preferred)
- **Application root**: `arx/backend` (relative to home — the folder with
  `manage.py`)
- **Application URL**: `arxinfo.tech` (domain root, no subpath)
- **Application startup file**: leave as `passenger_wsgi.py` (already
  committed at `backend/passenger_wsgi.py` — cPanel's own generated stub
  gets overwritten by the git clone, which is what we want)

Saving this gives you an "Enter to the virtual environment" command shown in
the cPanel UI — copy it, you'll need it below (it looks like
`source /home/<user>/virtualenv/arx/backend/3.11/bin/activate && cd /home/<user>/arx/backend`).

## 3. Install dependencies

```bash
source /home/<user>/virtualenv/arx/backend/3.11/bin/activate && cd ~/arx/backend
pip install -r requirements.txt
```

`mysqlclient` needs `libmysqlclient-dev`/`mysql-devel` to build — if `pip
install` fails on it, ask your host to confirm MySQL client dev headers are
available (most cPanel hosts have these; some need a support ticket).

### Scripts (`backend/scripts/`)

Everything below step 3 has a script so you're not retyping commands on
every deploy:

- `scripts/setup.sh` — first-time only: installs deps, checks `.env` exists,
  migrates, collects static, seeds demo content, creates the superuser (if
  `DJANGO_SUPERUSER_*` env vars are set).
- `scripts/deploy.sh` — every redeploy: `git pull`, reinstall deps, build the
  frontend (if `npm` is on PATH), migrate + collectstatic.
- `scripts/migrate.sh` — just migrate + collectstatic.
- `scripts/seed_data.sh` — (re-)seed demo service groups/testimonials/a
  sample post. Idempotent, safe to re-run.
- `scripts/create_superuser.sh` — create or reset the admin user:
  ```bash
  DJANGO_SUPERUSER_USERNAME=admin \
  DJANGO_SUPERUSER_EMAIL=admin@arxinfo.tech \
  DJANGO_SUPERUSER_PASSWORD='choose-a-strong-one' \
  sh scripts/create_superuser.sh
  ```

All of them assume you've already activated the app's virtualenv (step 2's
"Enter to the virtual environment" command) so `python`/`pip` resolve to the
right interpreter — run them as `sh scripts/<name>.sh` from anywhere.

## 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` (`nano .env`) to the production block at the bottom of that file:

```
DJANGO_SECRET_KEY=<generate one — see below, never reuse the dev default>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=arxinfo.tech,www.arxinfo.tech
DB_ENGINE=mysql
DB_NAME=cpaneluser_arx_db
DB_USER=cpaneluser_arxadmin
DB_PASSWORD=<the password you set in cPanel MySQL Databases>
DB_HOST=localhost
DB_PORT=3306
```

Generate a real secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 5. Build the frontend

**If cPanel also has "Setup Node.js App"** (check first — separate feature
from the Python App), the cleanest path is building on the server:

```bash
cd ~/arx/frontend
source /home/<user>/nodevenv/arx/frontend/22/bin/activate   # path cPanel gives you
npm ci
npm run build
```

**If there's no Node.js option on this hosting plan**, build locally instead
(you already have this working — `cd frontend && npm run build` produces
`frontend/dist/`) and upload just the `dist/` folder to `~/arx/frontend/dist/`
on the server via SFTP/rsync. Re-upload it after every frontend change; it's
gitignored on purpose (build output, not source).

Either way, `frontend/dist/` must end up as a sibling of `backend/` on the
server for Django to find it.

## 6. Migrate, collect static, create the admin user

Back in the Python app's virtualenv (step 3's activate command), run the
first-time setup script — it migrates, collects static, seeds demo content,
and (if you export the `DJANGO_SUPERUSER_*` vars first) creates the admin
user, all in one go:

```bash
cd ~/arx/backend
DJANGO_SUPERUSER_USERNAME=admin \
DJANGO_SUPERUSER_EMAIL=admin@arxinfo.tech \
DJANGO_SUPERUSER_PASSWORD='choose-a-strong-one' \
sh scripts/setup.sh
```

Re-run `sh scripts/migrate.sh` alone whenever you just need to reapply
migrations/collectstatic (e.g. after rebuilding the frontend — that's what
copies the newly-hashed JS/CSS files to where whitenoise serves them from).

## 7. Restart the app

In cPanel's Setup Python App page, click **Restart**. (Or from SSH:
`touch ~/arx/backend/tmp/restart.txt` — Passenger watches for that file.)

## 8. Verify

```bash
curl -I https://arxinfo.tech/api/blog/       # should be 200
curl -I https://arxinfo.tech/admin/          # should be 302 (redirect to login)
curl -I https://arxinfo.tech/                # should be 200, serving the SPA
```

Then open `https://arxinfo.tech/` and `https://arxinfo.tech/admin/` in a
browser. If cPanel's AutoSSL isn't already on for this domain, enable it in
cPanel → SSL/TLS Status, so everything's served over HTTPS.

## Redeploying after future changes

From the app's activated virtualenv: `sh scripts/deploy.sh` — pulls latest,
reinstalls deps, builds the frontend if `npm` is on PATH (uploads it yourself
first if not), migrates + collects static. Restart the app afterward either
way (script reminds you).

Model changes: still run `makemigrations` locally first (project convention —
commit the generated migration file), then `deploy.sh`/`migrate.sh` picks it
up on the server via `git pull` + `migrate`.

## What this setup does *not* cover

- **Media file serving at scale**: uploaded images (blog covers, team photos,
  service images) are served directly by Django (`django.views.static.serve`
  in `config/urls.py`) since there's no separate static file server on this
  host. Fine for a small business site's traffic; if uploads/traffic grow a
  lot, move media to S3/Cloudinary/etc. and point `MEDIA_URL` there instead.
- **Zero-downtime deploys**: restarting the Passenger app briefly interrupts
  requests. Not noticeable for a low-traffic site; matters more at scale.
- **CI/CD**: `.github/workflows/ci.yml` runs build/check on push, but nothing
  auto-deploys to this server — every deploy above is a manual SSH step.
