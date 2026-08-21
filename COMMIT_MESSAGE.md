# Commit Message

## Header

fix(cms): pin Turbopack workspace root to stop resolving into the public site

## Description

`npm run dev` failed with `Module not found: Can't resolve
'@/i18n/routing'` from `./src/middleware.ts` — a file that doesn't exist
anywhere in `cms/`. Root cause was the warning Next.js printed just
above the error: because `cms/` sits one directory under the public
website's repo root, and both have their own `package-lock.json`,
Turbopack's automatic workspace-root inference picked the *parent*
folder (the public website) as the root instead of `cms/` itself. Once
that happens, this app's own relative imports resolve against the
public site's `src/` instead of its own — so `./src/middleware.ts`
pointed at the public website's real middleware (which legitimately
imports `@/i18n/routing` for its locale routing), not anything inside
`cms/`.

- `cms/next.config.ts` — added `turbopack.root: __dirname`, pinning the
  workspace root explicitly so Turbopack stops inferring it from
  sibling lockfiles. This is the fix Next.js's own warning message
  points at (`turbopack.root` in `next.config.js`).

No other files changed; no stray files needed removing — the earlier
`i18n/` folder cleanup was a real but separate issue (leftover files
from an earlier copy), already resolved. This fix addresses a different
problem: correct workspace-root resolution, independent of what's
actually inside `cms/src`.

## Verification

- `npx eslint next.config.ts` / `npx prettier --check next.config.ts` —
  clean.
- `npx tsc --noEmit` — same single expected error as before
  (`PrismaClient` unresolved until `prisma generate` runs locally);
  nothing new introduced by this change.
- **Not verified in this sandbox:** actually booting `npm run dev` next
  to a sibling public-website lockfile, since this sandbox doesn't
  reproduce that exact two-lockfile directory layout. This is a
  standard, documented Turbopack fix (see the "Turbopack root
  directory" link in your own warning output) — please confirm `npm run
  dev` boots cleanly and shows the dashboard at `localhost:4000`.
