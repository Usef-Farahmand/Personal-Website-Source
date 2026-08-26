feat: bridge CMS-published content to the public website via static export

Implements the Task 08 export pipeline: CMS -> Published content ->
npm run content:export -> generated JSON + copied media -> public
website's existing content layer -> npm run build. The public website
never queries Prisma/SQLite at runtime, before or after this change.

CMS (cms/)
- New scripts/export-content.ts: reads only getPublishedProjects()/
  getPublishedArticles() (the Task 07 publishable boundary - status is
  never re-checked here, it's structurally guaranteed by that query).
  Validates exhaustively before writing anything: slugs (format +
  uniqueness), required fields (startDate, problem/solution/
  lessonsLearned, Article publishedAt), translation completeness for
  both locales, link/source URLs, YouTube video ids (id/URL agreement
  too), and that every locally-referenced media file actually exists on
  disk. Any failure aborts with every problem listed and writes
  nothing - "Do NOT partially overwrite the public content."
- Builds output under a temp staging directory, re-parses each written
  JSON file as a final sanity check, then atomically swaps it into the
  public website's src/content/generated/ and public/content-media/ -
  never a partially-written directory.
- New "content:export" script in package.json (npm run content:export,
  from cms/).

Public website (src/)
- src/content/projects/index.ts and articles/index.ts now import from
  the generated JSON instead of the hand-authored .data.ts files - the
  one seam the whole architecture was designed around (services/
  content/*.service.ts and every component are unchanged; they only
  ever consumed { projects }/{ articles } from these index files).
  projects.data.ts/articles.data.ts are no longer imported by anything
  but are left in place as authoring history.
- Bootstrapped src/content/generated/{projects,articles}.json from the
  current .data.ts content, so the site keeps building and looking
  identical immediately after this delivery, before the CMS export has
  ever been run for real.
- Schema gaps found while mapping CMS data onto the public Project/
  Article types, each resolved and documented in the export script:
  - Project.status (active/shipped/paused/archived) has no CMS source
    field - derived via endDate presence (shipped vs active); never
    paused/archived. Flagged as a real gap, not silently invented.
  - ArticleSourcePlatform gained "website"/"other" (CMS already had
    both; public site only modeled medium/linkedin).
  - category/tags are per-translation in the CMS but shared fields on
    the public types - English is canonical.
- MediaFileType gained "youtube" (+ youtubeVideoId on MediaItem) so
  YouTube gallery items - added CMS-side in Task 06.3 - have a public
  representation at all. New YoutubeEmbed.tsx, wired into MediaViewer
  as an additive 4th branch alongside image/video/pdf (none of those
  three changed). ProjectGallery gained a matching thumbnail branch.
  next.config.ts allows img.youtube.com for gallery thumbnails.

Bug found and fixed
- tsconfig.json's `exclude` only listed node_modules, so `npm run
  build` was type-checking the entire cms/ app (a separate Next
  project, nested inside this repo) as part of the public site's own
  TypeScript pass - pre-existing, not introduced by this task, but it
  now actually fails the build once cms/ has a script this strict
  outside its own tsconfig can't resolve. Fixed by excluding "cms".

No CMS API, cloud storage, GitHub automation, or deployment tooling
added - out of scope per the task.

Verified: `npm run content:export`'s logic was type-checked against a
hand-written Prisma-client stub (the CMS's actual `prisma generate`
can't fetch its engine binary in this sandbox - see delivery notes).
`npm run build` was run for real, end-to-end, against the bootstrapped
generated content, and succeeds.
