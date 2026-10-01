feat(content): add SnapshotAll Medium article and show it on the project page

Add the "Meet SnapshotAll: The Clean, Privacy-First Snapshot Tool Built
for Everyday Workflows" article (Medium, 2026-10-01, 3 min read) to
`generated/articles.json` with en + fa translations, and link it to the
SnapshotAll project in both directions:

- `art-snapshot-all.relatedProjectIds` -> `prj-snapshot-all`
- `prj-snapshot-all.relatedArticleIds` -> `art-snapshot-all`

The project detail page already renders `relatedArticleIds` through
`getArticlesByIds`, so the article now appears in its "Related Articles"
section with no component changes. The article reuses the project's
cover image as its header image and uses `order: 0` (the articles list
itself is sorted by `publishedDate`, newest first).

Note: `articles.json` / `projects.json` are derived output of
`cms/scripts/export-content.ts`; the same article and relation must be
added in the CMS source, otherwise the next `npm run content:export`
will drop them.
