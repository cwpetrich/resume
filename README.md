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

Built with [Next.js](https://nextjs.org/) (App Router), TypeScript, and
Tailwind CSS. Self-hosted on my own hardware behind a reverse proxy, managed by
PM2, and deployed with a single script.

## Editing the content

**All résumé content lives in one file: [`lib/data.ts`](lib/data.ts).** Edit the
objects there — `profile`, `experience`, `skills`, `projects`, `education`,
`socials` — and the page, the interactive terminal, and the printable PDF all
update automatically. Placeholder text is marked with `// TODO`.

A few things to personalize first:

- `profile.host` — set to your real domain (used in the prompt and meta tags)
- `socials` — your LinkedIn slug
- `experience`, `projects`, `education` — replace the placeholder entries

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

On the server, install the PM2 process once so it survives reboots:

```bash
pm2 startup        # follow the printed instructions once
pm2 save
```

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
app/            Next.js App Router — layout (metadata/SEO) + page
components/     UI sections (Hero, Experience, Skills, …)
  games/        Snake + Matrix-rain easter eggs
lib/data.ts     ← all résumé content lives here
deploy.sh       one-command deploy to the self-hosted box
ecosystem.config.js   PM2 process definition
```
