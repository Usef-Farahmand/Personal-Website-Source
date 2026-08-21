# Commit Message

## Header

feat(cms): implement Task 02 database schema — enums, SEO fields, seed data

## Description

Builds on Task 01's foundation. Inspected the existing schema and the
public website's content models first, then implemented Task 02's
specific requirements: native Prisma enums for closed vocabularies, a
`description` field rename, per-locale SEO metadata, explicit cascade
behavior, targeted indexes, and a minimal idempotent seed script.

### Enums: switched from Zod-only Strings to real Prisma enums

Task 01 used plain `String` columns for `status`/`locale`/media `type`,
validated only by Zod, because SQLite has no native enum type. Since
then I confirmed Prisma ORM 6.2.0+ actually does accept `enum` blocks
for the SQLite connector — the column is still `TEXT` underneath (SQLite
still won't reject an invalid value at the DB level), but the Prisma
Client and schema validation now enforce it, and the generated
TypeScript types become real string-literal unions instead of `string`.
That's a strictly better fit for Task 02's "use a Prisma enum if
appropriate," so:

- `ContentStatus` (`DRAFT` | `PUBLISHED` | `ARCHIVED`) is now a Prisma
  enum, used by both `Project.status` and `Article.status`.
- `Locale` (`en` | `fa`) is now a Prisma enum.
- `MediaType` (`IMAGE` | `VIDEO` | `PDF` — uppercase per Task 02, was
  lowercase in Task 01) is now a Prisma enum.

`category` (Project/Article) deliberately stays a plain `String`,
validated by Zod only — see the schema's file-level comment for why:
it's a closed vocabulary, but keeping it out of Prisma's enum system
avoids a second DB-level source of truth that has to stay in sync with
the public site's `ProjectCategory`/`ArticleCategory` unions.

### Avoiding duplicated types (Task 02 §18)

`src/lib/validation/shared.ts` no longer hardcodes the status/locale/
media-type value lists — it derives its Zod schemas directly from the
Prisma-generated enum objects (`Object.values(ContentStatus)`, etc.), so
the Zod layer and the Prisma schema can't drift out of sync the way two
independently-maintained lists could.

### Field changes to match Task 02's spec exactly

- `ProjectTranslation.fullDescription` → `description` (Task 01 named it
  `fullDescription`; Task 02's field list says `description`).
- Added `seoTitle`/`seoDescription` (both optional) to
  `ProjectTranslation` and `ArticleTranslation`.
- `tags` (Json string[]) on both translation models is **retained** from
  Task 01 even though Task 02's restated field list omits it — nothing
  asked to remove it, and it's exercised by the existing public site
  model. Flagged as an assumption below.
- `Article.sourceUrl` is **retained** from Task 01 for the same reason —
  structurally required for "external publication" metadata to mean
  anything, even though Task 02's restated field list doesn't repeat it.

### Cascade behavior (Task 02 §13) — made explicit, not left to defaults

- `ProjectTranslation`/`ArticleTranslation` → parent: `onDelete: Cascade`
  (unchanged from Task 01). Deleting a Project/Article removes its
  translations; no orphans possible.
- `ProjectMedia` → `Project`: `onDelete: Cascade`. Deleting a Project
  removes its gallery join rows (not the underlying Media).
- `ProjectMedia` → `Media`: `onDelete: Cascade`. Deleting a Media item
  removes any gallery join rows pointing at it — the reverse direction
  from "deleting a join row must never delete Media" (which was already
  true: nothing cascades from the join row to Media).
- `Project.logo`/`Project.cover`/`Article.headerImage` → `Media`: now
  explicitly `onDelete: SetNull` (previously relied on Prisma's
  unstated default). Deleting a Media item used as someone's logo/cover/
  header image detaches it gracefully instead of blocking the deletion
  or cascading into deleting the Project/Article itself.

### Indexes (Task 02 §14) — added with reasoning, not blindly

- `Project.status`, `Article.status` — kept from Task 01 (status-first
  filtering, used constantly by both the CMS UI and the future export
  step).
- `Article.publishedAt` — new. Articles are listed newest-first, same
  as the public site's existing ArticleGrid sort.
- `ProjectTranslation.locale`, `ArticleTranslation.locale` — new,
  supplementing the existing `[projectId/articleId, locale]` unique
  composite (which already covers "translations of one project/article"
  lookups efficiently as the leading column).
- `Project.logoMediaId`, `Project.coverMediaId`, `Article.headerMediaId`,
  `ProjectMedia.mediaId` — new. Foreign keys aren't auto-indexed by
  SQLite the way some other engines index them; these support reverse
  lookups ("which content uses this Media item") that the future Media
  Library will need before allowing a deletion.
- Not added: a standalone index on `ProjectTranslation.projectId` /
  `ArticleTranslation.projectId` alone — already the leading column of
  the unique composite index, so a second single-column index would be
  redundant.

### Files added

- `prisma/seed.ts` — one demo Project (EN + FA translations, a logo, a
  cover, one gallery item) and one demo Article (EN + FA translations,
  a header image) — 4 Media records total. Every string is prefixed
  `(Demo)` / `(نمونه)` so it's unmistakable in any future Admin UI. Uses
  `upsert` on natural keys throughout, so `npx prisma db seed` is safe
  to run repeatedly rather than throwing a unique-constraint error on
  the second run.

### Files modified

- `prisma/schema.prisma` — enums, field rename, SEO fields, explicit
  cascade behavior, new indexes (all described above).
- `src/lib/validation/shared.ts` — enums now derived from
  `@prisma/client` instead of hardcoded.
- `src/lib/validation/project.schema.ts`,
  `src/lib/validation/article.schema.ts` — `description` rename,
  `seoTitle`/`seoDescription` added to match the schema.
- `src/lib/validation/media.schema.ts` — unchanged in content;
  `mediaTypeSchema` now automatically reflects `IMAGE`/`VIDEO`/`PDF`
  since it's derived from the Prisma enum rather than a local array.
- `prisma.config.ts` — added `migrations.seed: "tsx prisma/seed.ts"` and
  `datasource.url` (the latter lets `prisma db seed` and other CLI
  commands resolve the database file directly from config).
- `package.json` — added `tsx` (runs the TypeScript seed script) and a
  `db:seed` script (`prisma db seed`).

## Packages added

- `tsx` (dev dependency) — runs `prisma/seed.ts` directly without a
  separate compile step. No other new dependencies; the Prisma/SQLite
  stack from Task 01 (`@prisma/client`, `@prisma/adapter-libsql`,
  `@libsql/client`, `prisma`) is unchanged.

## Assumptions

1. `tags` (ProjectTranslation/ArticleTranslation) and `Article.sourceUrl`
   are retained from Task 01 despite not appearing in Task 02's restated
   field lists — treated as "already-reviewed and still needed" rather
   than silently dropped. Flag if either should actually go.
2. `category` stays outside the Prisma enum system, validated by Zod
   only — same reasoning as Task 01, restated in the schema's file-level
   comment.
3. No "role" field was added to `ProjectMedia` — Task 02 offered it as
   optional ("if useful"), but with `logo`/`cover` as separate dedicated
   relations, everything reachable through `ProjectMedia` is
   unambiguously gallery content, so a role column would have exactly
   one value in practice today.

## Issues discovered

None in the existing Task 01 foundation — the enum/index/cascade changes
above are refinements Task 02 specifically asked for, not fixes to
anything broken.

## Migration & seed result

**Not run in this sandbox** — same limitation as Task 01: this
environment's network allowlist doesn't include `binaries.prisma.sh`,
so `prisma generate`/`migrate`/`validate` all fail here with a 403
fetching the schema engine, unrelated to the schema itself. `tsc
--noEmit` confirms the code is internally consistent against the new
schema: the only errors are the expected "not yet generated" ones for
`PrismaClient`, `ContentStatus`, `Locale`, and `MediaType` — nothing
else. `eslint` and `prettier --check` are clean.

**On your machine:** the schema changed enough (column rename, enum
types) that Prisma's migration diffing may want to drop-and-recreate
rather than cleanly rename a column. Since nothing but seed/placeholder
data exists in `dev.db` right now, the simplest path is a clean reset
rather than a diffed migration:

```
cd cms
del prisma\dev.db
rmdir /s /q prisma\migrations
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Please run this and confirm: the migration completes, `npx prisma db
seed` reports "Seed complete" with the Project/Article/Media counts,
and the dashboard at `localhost:4000` shows **1 Project, 1 Article, 4
Media** instead of the all-zero counts from Task 01.
