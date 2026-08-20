# Commit Message

## Header

content(projects): update GT Racing with real gallery/playable build, fix its and Farmand's category

## Description

Updated the existing "GT Racing" project entry
(src/content/projects/projects.data.ts, id `prj-gt-racing`) with real
project data supplied for it, replacing placeholder/stand-in values:

- Removed the `externalLinks` "Gameplay Video" YouTube link — replaced
  by the actual playable ad build itself (see below), which is a more
  direct and accurate artifact than a video walkthrough.
- Added `links.playable` pointing at the actual shipped playable-ad
  HTML build (public/projects/gt-racing/index.html — the real
  Cocos Creator/TypeScript export for Berga Games, previously not
  hosted anywhere on the site). This drives the existing "Play Game"
  CTA on the project hero (src/components/sections/ProjectHero.tsx),
  which was defined in the type/UI already but had no project wired
  up to it yet.
- Added 4 real gameplay screenshots to `gallery` (car selection, color
  customization, upgrades/stats, and a city night-race shot), stored
  under public/projects/gt-racing/. The pre-existing single cover-image
  gallery entry is kept as-is.
- Extended `technologies` with Cocos2d, Playable Ads, and 2D Animation
  (previously only listed Cocos Creator and TypeScript).
- Corrected `endDate` from 2021-04-01 (same day as `startDate`, clearly
  a placeholder) to 2021-05-31, reflecting the real Apr 2021 – May 2021
  project window.

Not changed: `experienceId` (`exp-wds-intern`) already correctly links
this project to the White Designers Studios internship experience, so
no update was needed there. English/Farsi translation copy
(summary/problem/solution/etc.) was left as-is since none of the new
information contradicted it.

## Follow-up fix (same feature)

GT Racing and Farmand were both miscategorized as `category: "game"`.
Both are playable ads (interactive mobile ad units built for other
studios' marketing campaigns), not games in their own right — the
existing closed category set (`ai` | `web` | `mobile` | `game` | `tool`)
had no accurate option for that, so rather than force-fitting them into
`game` or `tool`, added a proper `"playable-ad"` member:

- src/types/content.ts — added `"playable-ad"` to the `ProjectCategory`
  union.
- src/messages/en.json, src/messages/fa.json — added the matching
  `projectCategory.playable-ad` label ("Playable Ad"), following this
  file's existing convention of leaving these short category/status
  labels in English in both locale files (see `game`, `tool`,
  `archived`, etc.).
- src/content/projects/projects.data.ts — changed `category` from
  `"game"` to `"playable-ad"` for both `prj-gt-racing` and `prj-farmand`.
  No other project in the file was using `category: "game"` for a
  playable ad, so no further entries needed this change.

Category is read dynamically everywhere it's used (detail-page label
via the `projectCategory` translation namespace, and the projects
listing page's filter options), so no other file needed updating for
the new category value to work correctly.

fix(routing): add locale-aware not-found page to fix root-layout crash

## Description

Fixes a runtime crash: "Missing <html> and <body> tags in the root
layout." Any unmatched path under a locale (e.g. /en/some-typo) had no
src/app/[locale]/not-found.tsx to catch it, so Next.js fell back to
rendering the app-level not-found page under the intentionally-bare root
layout (src/app/layout.tsx returns only `children`, no <html>/<body> —
that's by design, since only [locale]/layout.tsx knows the visitor's
locale/direction). This is a known Next.js App Router + next-intl gap,
not something introduced by recent content changes.

Three files fix it together:
- src/app/[locale]/[...rest]/page.tsx (new) — catch-all that forces any
  otherwise-unmatched path to actually enter the [locale] segment tree,
  then calls notFound() to defer to the nearest boundary. Without this,
  Next.js never enters [locale] for a structurally-unmatched path at all.
- src/app/[locale]/not-found.tsx (new) — the real localized 404 page;
  renders inside [locale]/layout.tsx, so it gets <html>/<body>, theming,
  and Header/Footer for free. This is the "Error" layout variant
  DefaultLayout's own doc comment already anticipated.
- src/app/not-found.tsx (new) — root-level fallback with its own
  minimal <html>/<body> (imports globals.css directly, since the root
  layout doesn't) for the rare case a request never reaches [locale] at
  all — e.g. a path the proxy/middleware matcher excludes.
- src/messages/en.json, src/messages/fa.json — added a `notFound`
  namespace (title/description/backHome) for the localized page's copy.

No domain, locale-routing, or middleware *behavior* was changed — the
next-intl middleware, routing config, and locale-detection logic are
untouched. This only adds the missing not-found page Next.js requires to
render properly within the existing locale architecture.

## Follow-up fix (same feature)

The first version of this fix introduced its own bug: not-found.tsx
files never receive route params in the App Router, so
getTranslations() inside [locale]/not-found.tsx had no reliable way to
know which locale's messages to load when reached via the catch-all —
producing "MISSING_MESSAGE: Could not resolve `notFound`" even though
the key existed in both message files. Fixed by calling next-intl's
setRequestLocale() explicitly — once in the [locale]/[...rest] catch-all
(with the real locale from its own params), and once in
[locale]/layout.tsx's existing invalid-locale guard (falling back to the
app's default locale, since there's no valid one to use there) — so the
request-scoped locale is always established before notFound() hands off
to the not-found.tsx boundary, regardless of which of the two paths
triggered it.
