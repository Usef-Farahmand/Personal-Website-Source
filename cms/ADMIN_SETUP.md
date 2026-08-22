# CMS Admin Panel — Setup Guide

This covers getting the Local CMS running on your machine and finding
your way around `/admin` for the first time. The CMS lives in `cms/`
and is a separate Next.js app from the public website at the repo root
— running one doesn't require the other.

There's no login — the admin panel has no authentication (by design,
for a local single-author tool). Anyone who can reach the dev server
can use it, so only run it locally, not deployed publicly as-is.

---

## 1. Prerequisites

- **Node.js 20+** (tested on Node 22)
- No database server to install — the CMS uses a local SQLite file
  (`cms/prisma/dev.db`), created automatically

## 2. Install dependencies

```bash
cd cms
npm install
```

## 3. Set up the environment file

```bash
cp .env.example .env
```

The default `.env` points at the local SQLite file
(`cms/prisma/dev.db`) — no changes needed unless you move the database.

## 4. Generate the Prisma client

```bash
npm run db:generate
```

This reads `prisma/schema.prisma` and generates the typed database
client the app imports from `@prisma/client`. Re-run this any time the
schema changes (e.g. after pulling new migrations).

> If this fails with a network/checksum error fetching Prisma's engine
> binaries, your network is blocking `binaries.prisma.sh`. Allow that
> domain, or set `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` as a
> workaround if you're offline and already have the engines cached.

## 5. Apply database migrations

```bash
npm run db:migrate
```

This applies any pending migrations in `prisma/migrations/` to your
local `dev.db`, creating it if it doesn't exist yet. Safe to re-run —
already-applied migrations are skipped.

## 6. (First time only) Migrate existing Project data

If `dev.db` doesn't have your real Projects yet — e.g. this is a fresh
clone — import the existing website Project data:

```bash
npm run migrate:projects
```

This reads `src/content/projects/projects.data.ts` directly (the
actual source of truth, not a copy) and creates/updates matching
Projects, translations, links, gallery media, and Team members in the
CMS. It prints a report at the end, including any referenced image
files it couldn't find locally — that's expected if `public/projects/`
assets aren't present yet; copy them in and re-run the command to pick
them up (it won't create duplicates).

## 7. Run the dev server

```bash
npm run dev
```

The CMS runs at **http://localhost:4000**. Open
**http://localhost:4000/admin** to reach the panel.

---

## Finding your way around `/admin`

- **Dashboard** (`/admin`) — overview of Projects and Articles.
- **Projects** (`/admin/projects`) — list, create, and edit Projects.
  Opening a Project shows:
  - **General** — slug, status, featured, technologies, platforms,
    dates, release year, display order, and related project/article
    IDs (see note below).
  - **Links** — the fixed CTA slots (website, playable demo, download,
    app store, Google Play, repository) plus open-ended external links.
  - **Gallery** — ordered media attached to the project.
  - **Team** — collaborators and their links (LinkedIn, personal site,
    etc.). Not every member needs a link.
  - **EN / FA translation tabs** — title, descriptions, problem,
    solution, lessons learned, target audience, my role, feature
    highlights, and SEO fields, per locale.
- **Articles** (`/admin/articles`) — same idea, for articles.
- **Media** (`/admin/media`) — the shared media library that Projects
  and Articles pick images from.
- **Settings** (`/admin/settings`) — site-level settings.

**Related project/article IDs** are stored as plain ID references, not
picked from a dropdown yet — enter the exact `Project.id` (e.g.
`prj-simulix`) or the original external article/experience ID.
Articles and Experience aren't fully migrated into the CMS with
matching IDs yet, so those two specifically may not resolve to
anything clickable until that happens in a future task.

## Everyday commands, once set up

| Command | What it does |
|---|---|
| `npm run dev` | Start the admin panel at `:4000` |
| `npm run db:studio` | Open Prisma Studio — a GUI to browse/edit the raw database |
| `npm run db:generate` | Regenerate the Prisma client after a schema change |
| `npm run db:migrate` | Apply new migrations |
| `npm run migrate:projects` | Re-sync Projects from `projects.data.ts` |
| `npm run build` / `npm run start` | Production build / run |

## Troubleshooting

- **"Cannot find module '@prisma/client'" or type errors on Prisma
  models** — you skipped step 4; run `npm run db:generate`.
- **Admin pages show stale/missing data after a schema change** — run
  `npm run db:generate` again, then restart `npm run dev`.
- **Want a clean slate** — stop the dev server, delete
  `cms/prisma/dev.db`, then repeat steps 5–6.
