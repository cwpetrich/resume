# resume

My résumé and landing page as a live, self-hosted web app — a working
demonstration that I can design, build, and operate the thing, not just list it
on a CV.

It's a **terminal-themed single page** with:

- A full résumé (about, experience, skills, projects, education, contact)
- An **interactive shell** visitors can actually type into (`help`, `whoami`,
  `skills`, `projects`, …)
- **Hidden games & easter eggs** for anyone who pokes around — try `snake`,
  `matrix`, `guess`, `theme amber`, `sudo`, or the Konami code
  (`↑ ↑ ↓ ↓ ← → ← → B A`)
- A **print-to-PDF résumé** — the "download résumé" button reflows the page
  into a clean, ATS-friendly document via a dedicated print stylesheet
- **SEO / Open Graph / JSON-LD** metadata for sharing and search
- A **password-protected admin panel** (`/admin`) for editing every section
  through forms — content is stored in **SQLite** and published to the live
  site instantly

Built with [Next.js](https://nextjs.org/) (App Router), TypeScript, Tailwind
CSS, and SQLite. Self-hosted on my own hardware behind a reverse proxy, managed
by PM2, and deployed with a single script.

## Editing the content

There are two ways to manage content:

1. **The admin panel (recommended for live edits).** Log in at `/admin` and edit
   any section through forms — profile, socials, experience, skills, projects,
   education — with add / remove / reorder. Changes are written to SQLite and
   published immediately. See **Admin panel & authentication** below to set your
   password.

2. **Seed defaults in [`lib/data.ts`](lib/data.ts).** `defaultResumeData` is used
   to **seed the database the first time the app runs**. Editing it changes the
   *starting* content of a fresh install; it does not affect a database that's
   already been seeded. To push the seed into the live database, run
   `npm run sync-resume` on the server.

> **Keep the two in sync.** `sync-resume` is destructive: it overwrites every
> section of the live database with the seed, so any `/admin` edits that aren't
> also in `lib/data.ts` are lost. Copy admin edits back into the seed before
> syncing.

## Admin panel & authentication

A single admin login guards `/admin`. Auth uses a scrypt-hashed password, a
signed httpOnly session cookie (JWT via `jose`), and edge middleware that gates
the route; every save action also re-checks the session server-side.

**1. Generate your credentials:**

```bash
npm run set-password -- "your-strong-password" your-username
```

This prints three values — paste them into a `.env.local` file (it is
git-ignored; never commit it):

```dotenv
ADMIN_USERNAME=your-username
ADMIN_PASSWORD_HASH=<generated>
AUTH_SECRET=<generated>
# optional — defaults to ./data/resume.db
# DATABASE_PATH=/var/lib/resume/resume.db
# required for the "tailor résumé to a job" admin tool
# ANTHROPIC_API_KEY=sk-ant-...
# optional — defaults to claude-sonnet-4-5
# TAILOR_MODEL=claude-sonnet-4-5
```

**2. Restart the app.** Then visit `/admin`, log in, and edit away.

> Without these env vars the public site still works (read-only); only the admin
> login is disabled. In production, `AUTH_SECRET` is required.

## Tailoring a résumé to a job posting

From `/admin`, the **"Tailor résumé to a job"** panel lets you paste a job
description and a label (e.g. "Acme Corp — Staff Engineer"). An LLM
(Anthropic's API, configured via `ANTHROPIC_API_KEY`) reorders your real skill
groups and experience, and selects/reorders which of each job's *existing*
highlight bullets to foreground for that posting — it never invents new
highlight text, companies, dates, or skills; only the tailored intro summary
paragraph is freshly written, and only from facts already in your résumé.

Every generated version is saved (labeled, timestamped) and viewable at
`/admin/tailored/<id>`, with its own "download résumé (.pdf)" button that
reuses the same print pipeline as the main résumé. Saved versions can be
deleted from the admin panel. This tool and its output are admin-only — there
is no public job-tailoring page.

### Building up richer experience data for tailoring

Each experience highlight can carry an optional category: scope, achievement,
metric, challenge, leadership, or collaboration. In the admin **Experience**
editor, instead of guessing what to write, use the quick-add prompt buttons
("+ Scope & scale", "+ Quantified impact", "+ Technical challenge", etc.) —
each adds a blank highlight pre-tagged with that category and the underlying
question as a placeholder, so you just fill in the answer. Add as many per
category as you want per role — the tailoring tool sees all of them and uses
each one's category to match what a job posting is actually asking for (e.g.
surfacing "leadership" highlights for a posting that emphasizes mentorship).
Highlights saved before this feature still work — they just come back
uncategorized.

Each highlight also has a "generic" checkbox (checked by default). Only
checked highlights show on the public résumé and the default PDF — uncheck it
to keep a fact in the bank for tailoring only, without cluttering the generic
résumé with niche details. This lets you build a deep fact bank per role (lots
of highlights across every category) while keeping the default résumé tight.

## Data & persistence

Content lives in a SQLite database at `DATABASE_PATH` (default `./data/resume.db`).
The `data/` directory is git-ignored and is **not** touched by the deploy script,
so your edits persist across deploys. To back up your content, copy that file.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build   # compile
npm run start   # serve the production build on :3000
```

## Tests

```bash
npm test
```

Covers the job-tailoring reconciliation logic in `lib/tailorPlan.ts` — the
code that guarantees the LLM can only reorder/select real résumé data and
never fabricate companies, dates, skills, or highlight text. Uses Node's
built-in test runner (via `tsx`, no extra framework) since this project has
no other test suite yet.

## Self-hosting (how this site actually runs)

The app runs under [PM2](https://pm2.keymetrics.io/) using
[`ecosystem.config.js`](ecosystem.config.js), which serves `next start` on port
3000. A reverse proxy (e.g. Nginx) terminates TLS and forwards traffic to it.

[`deploy.sh`](deploy.sh) does a one-command deploy: build locally, `rsync` the
runtime artifacts to the server, install production deps, and zero-downtime
reload PM2.

```bash
# defaults target conrad@clay:/var/www/resume — override via env vars:
DEPLOY_HOST=user@host DEPLOY_DIR=/srv/resume ./deploy.sh
```

On the server, **once**: create `.env.local` with your admin credentials (see
**Admin panel & authentication**), then install the PM2 process so it survives
reboots:

```bash
pm2 startup        # follow the printed instructions once
pm2 save
```

`better-sqlite3` ships prebuilt binaries, so no compiler is needed on a standard
x64 Linux box. If the prebuilt binary is unavailable for your platform, install
build tools (`build-essential`, `python3`) so it can compile on `npm ci`.

#### Node version (avoid native-module mismatches)

`better-sqlite3` is a native module, so the Node version used to **build** it
(`npm ci`) must match the Node version PM2 **runs** the app with — otherwise you
get `NODE_MODULE_VERSION` / `ERR_DLOPEN_FAILED` crashes at runtime. The project
pins a version in [`.nvmrc`](.nvmrc) to keep these in sync.

Three things must all agree on that version:

1. **The build** — `nvm use` before `npm ci`. (On the git-pull deploy box, the
   `post-merge` git hook does this automatically.)
2. **The PM2 daemon** — if nvm's default Node has changed since the daemon
   started, run `pm2 update` to respawn it under the current Node, then
   `pm2 restart resume`.
3. **The reboot unit** — `pm2 startup` bakes the *current* Node path into the
   systemd service. **If you bump `.nvmrc`, re-run `pm2 startup` (with the new
   path) followed by `pm2 save`**, or a reboot will resurrect PM2 under the old
   Node and reintroduce the mismatch.

### Example Nginx reverse proxy

```nginx
server {
    server_name resume.example.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Project layout

```
app/
  page.tsx        public résumé (server-rendered from the DB)
  layout.tsx      metadata / SEO / JSON-LD
  login/          login page + auth action
  admin/          protected editor page + save actions
  admin/tailored/[id]/  view + download one saved tailored résumé
components/
  …               public UI sections (Hero, Experience, Skills, …)
  PrintResume.tsx print/PDF résumé (multi-page, full detail)
  games/          Snake + Matrix-rain easter eggs
  admin/          admin forms + reusable form primitives
lib/
  data.ts         types + seed defaults (defaultResumeData)
  db.ts           SQLite connection, schema, first-run seeding
  resume.ts       read (getResumeData) + per-section writes + tailored-résumé CRUD
  tailorPlan.ts   pure prompt-building + plan reconciliation (unit-tested)
  tailor.ts       Anthropic API call + wiring (server-only, uses tailorPlan.ts)
  auth.ts         password hashing + session cookie (Node runtime)
  session.ts      JWT sign/verify (edge-safe, used by middleware)
middleware.ts     gates /admin
scripts/
  set-password.mjs  generates ADMIN_* + AUTH_SECRET env values
  sync-resume.*     pushes the seed (lib/data.ts) into the live database
  redeploy.sh       server-side rebuild + PM2 reload
deploy.sh         one-command deploy to the self-hosted box
ecosystem.config.js   PM2 process definition
data/             SQLite database (git-ignored, lives only on the server)
```
