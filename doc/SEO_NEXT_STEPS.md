# SEO — Recommended Next Steps

Follow-up work after the technical SEO pass (sitemap, robots, canonical/hreflang,
JSON-LD, per-page metadata, image alt text). None of this is required for the
site to be indexable — it's what to do once it's live and getting crawled.

## 1. Search engine setup
- Register the site in **Google Search Console** (and Bing Webmaster Tools)
  for both the `.com` and `.ir` domains.
- Submit `https://www.useffarahmand.com/sitemap.xml` in Search Console.
- After a few weeks, check the **Coverage** and **Page indexing** reports to
  confirm all locales/routes are actually being indexed, not just crawled.

## 2. Canonical domain decision
The project mirrors content across two domains (`.com` / `.ir`) with no
domain switching in the UI (by design — see `MULTILINGUAL_ARCHITECTURE.md`).
Canonical tags currently point at whichever domain `siteUrl` resolves to.
Decide the one domain that should be treated as canonical for the search
engines and set `NEXT_PUBLIC_SITE_URL` accordingly for both deployments.
Consider a `rel="alternate"` note in Search Console if `.ir` needs to stay
independently indexable for regional reasons.

## 3. Measure before optimizing further
Once Search Console has a few weeks of data:
- Look at **Queries** to see what people actually search to find the site,
  and check if the existing page titles/descriptions match that intent.
- Look at **Pages with high impressions but low CTR** — those are the
  highest-value candidates for a better title/description rewrite.
- Don't guess new keywords or rewrite copy without this data — the content
  changes so far were deliberately limited to reusing what was already
  authored, not speculative keyword targeting.

## 4. Content depth (only if data supports it)
If Search Console shows real search demand for topics the site doesn't
cover in depth (e.g. specific technologies used in a project, a game-dev
technique), consider expanding that project's or article's own write-up —
but only with real, factual detail already known about the work, never
padding for length.

## 5. Structured data expansion
`Person`, `WebSite`, `BreadcrumbList`, and `CreativeWork` JSON-LD are in
place. If/when this project starts publishing full in-house articles
(rather than linking out to external platforms), add `Article` JSON-LD to
that future article detail route.

## 6. Performance monitoring
Run the site through **PageSpeed Insights** / Core Web Vitals periodically.
Nothing in this pass touched performance, but Core Web Vitals are a ranking
factor and worth a periodic check as content grows (more projects, more
images).

## 7. Backlinks / off-site
Once on-site SEO is solid, the highest-leverage remaining lever is external:
- Link to the site from GitHub profile, LinkedIn, and any published
  articles' author bios.
- Cross-link from the external article platforms (where allowed) back to
  the relevant project pages on this site.
