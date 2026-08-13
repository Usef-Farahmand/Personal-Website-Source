# Commit Message

## Header

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
