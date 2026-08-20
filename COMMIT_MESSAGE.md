# Commit Message

## Header

feat(cms): scaffold local-only CMS foundation as an independent Next.js app

## Description

Adds `cms/` — a separate, local-only Next.js + TypeScript + Prisma/SQLite
application for authoring website content. It is not part of the public
website's build, is never deployed, and has no runtime dependency on the
public site. Deliberately foundation-only: no Admin UI, no Projects/
Articles CRUD, no auth, no Media Library — see doc discussion for what's
intentionally deferred.

### Why a separate app, not a folder inside the existing Next app

The public website (`src/`) is a single Next.js app with no workspace
tooling. The task's hardest constraint is that the public site must
never depend on the CMS or its database, even indirectly — "if the CMS
is closed, the public website must continue working normally," and
"do not import Prisma into the public website UI." A folder under the
existing `src/app` can't guarantee that: any shared `node_modules`,
build, or route tree creates a path for Prisma/CMS code to leak into
the public site's bundle or for a CMS build failure to break the public
site's build. Two independent Next.js apps, each with its own
`package.json`, `node_modules`, dev server (CMS on port 4000), and
`.next` output, make that boundary structural rather than
convention-enforced. This does mean two `npm install`s instead of one —
an accepted, explicit trade-off for a two-app boundary that can't be
violated by accident.

### Files added

- `cms/package.json` — independent app manifest. Next 16.2.10, React
  19.2.4 (pinned to match the public site's versions, since both will
  likely run on the same machine), Prisma 7 + `@prisma/client`, Zod 4,
  Tailwind v4. `dev`/`start` run on port 4000 so both apps can run
  side-by-side without a port clash.
- `cms/prisma/schema.prisma` — the data model: `Project`,
  `ProjectTranslation`, `Article`, `ArticleTranslation`, `Media`,
  `ProjectMedia` (ordered join table for the gallery relation). SQLite
  has no native array or enum type, so short closed vocabularies
  (`status`, `locale`, `category`, media `type`) are plain `String`
  columns validated by the Zod layer, and open lists (`technologies`,
  `platforms`, `tags`) are `Json`. See the schema's file-level comment
  and inline field comments for the full reasoning, including the two
  documented deviations from the task's literal field list (`category`/
  `tags` as localized per Task 01's explicit instruction, despite the
  public site treating category as a shared taxonomy key; and an added
  `coverMediaId` on `Project`, not in Task 01's field list but required
  by the existing public site's `Project.coverImageUrl`).
- `cms/src/lib/db.ts` — the single Prisma client singleton. Every future
  service imports the database through this file; nothing else is
  allowed to instantiate `PrismaClient` directly. This is also the
  concrete enforcement point for the CMS/public-website boundary: there
  is no import path from `src/` (public website) into `cms/src/lib/db.ts`
  at all, since they're separate npm packages.
- `cms/src/lib/validation/shared.ts`, `project.schema.ts`,
  `article.schema.ts`, `media.schema.ts` — Zod schemas that are the
  actual source of truth for every closed vocabulary and required-field
  rule the database itself can't enforce (per Task 01's Security
  section: "Use typed schemas. Validate database operations."). Not
  wired to any create/update service yet — CRUD is out of scope for this
  task — but this is the contract that service will validate against.
- `cms/src/app/layout.tsx`, `page.tsx`, `globals.css` — minimal app
  shell plus a read-only dashboard showing Project/Article/Media counts.
  Exists only to prove the app boots and reads through the Prisma
  singleton correctly; not a preview of the real Admin UI.
- `cms/next.config.ts`, `tsconfig.json`, `postcss.config.mjs`,
  `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
  `.gitignore`, `.env.example` — standard app config, mirroring the
  public site's conventions (strict TS, `@/*` alias, same ESLint/
  Prettier setup) where there was no reason to diverge.

### Not included in this delivery

Per the task's explicit exclusions: no Admin UI beyond the placeholder
dashboard, no Projects/Articles CRUD screens or services, no Media
Library UI, no authentication, no publish/export implementation (the
Zod schemas and Prisma models establish the CMS-side shape that a
future export step will read from — see the chat reply's "Publish
boundary" section for the design). The public website (`src/`) was not
modified.

## Verification

- `npm install` inside `cms/` — clean install, no peer-dependency
  conflicts.
- `npx tsc --noEmit` — passes, with one expected exception:
  `src/lib/db.ts` cannot resolve `PrismaClient` until `npx prisma
  generate` has been run locally (see note below).
- `npx eslint .` — clean, no errors or warnings.
- `npx prettier --check .` — clean.
- **Not verified in this environment:** `npx prisma generate`,
  `npx prisma migrate dev`, and `npm run build`. This sandbox's network
  allowlist doesn't include `binaries.prisma.sh`, which Prisma's CLI
  needs to download its query/schema engine binaries — `prisma generate`
  fails here with a 403, unrelated to the schema or code itself. Run
  `cd cms && npm install && npx prisma migrate dev --name init` on your
  machine to create `dev.db` and generate the client; `npm run build`
  should then succeed. Flagging this rather than silently skipping it.
