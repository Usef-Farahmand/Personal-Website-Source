feat(cms): add Draft/Preview/Publish workflow for Projects and Articles

Replace the free-form status <select> (which let an ordinary Save
silently change or publish content) with an explicit, contextual
workflow: Draft -> Preview -> Publish, plus Unpublish/Archive/Restore.

Workflow
- Save never touches status any more - locked server-side to "DRAFT"
  on create, or the item's own current status on edit.
- New WorkflowActionBar (shared by Project/Article editors): Publish,
  Unpublish, Archive, Restore to Draft - each behind its own
  confirmation, contextual to current status (section 24's action
  lists). Calls new publish/unpublish/archive/restore server actions.
- New lib/content-workflow.ts: the shared state machine (Draft <->
  Published, Draft/Published -> Archived, Archived -> Draft only - no
  Archived -> Published shortcut) plus translation-completeness checks.
- Publish requires both English and Persian translations to exist
  (same policy the old status=PUBLISHED save-time check already
  enforced - just relocated to the explicit action). Missing-locale
  errors name what's missing.
- Project.publishedAt (new) and Article.cmsPublishedAt (new, kept
  deliberately separate from Article's existing hand-entered
  *external* publishedAt) are set once on first publish and never
  reset by later edits or unpublish->republish cycles.

Preview
- New /admin/projects/[id]/preview and /admin/articles/[id]/preview
  routes - CMS-only, reachable from the editor and both list tables.
  Reads the same getProjectById/getArticleById the editor uses, so
  Draft/Archived content previews exactly as saved.
- Locale switcher (EN/FA); a missing translation shows an explicit
  notice and a link to the locale that *is* available - never a
  silent fallback to the other language.
- Purpose-built preview components inside the CMS rather than
  importing the public site's actual components - the two are
  separate Next apps (see next.config.ts's turbopack.root scoping);
  see delivery notes for the full trade-off.

Export boundary (prep only, not the exporter itself)
- New lib/queries/publishable.ts: getPublishedProjects/
  getPublishedArticles/getPublishedMedia - the only sanctioned
  status=PUBLISHED read path for a future static-export task. No
  Prisma exposed beyond this module; public website untouched.

Fixes
- SuccessBanner hardcoded "Project ..." even when used on Article
  pages - now takes a `type` prop and covers the four new workflow
  outcomes (published/unpublished/archived/restored).

No authentication, roles, scheduling, revision history, or static
export/deployment added - out of scope per the task.

BREAKING CHANGE: adds Project.publishedAt and Article.cmsPublishedAt
(both nullable). Requires `npx prisma migrate dev` after pulling
(migration 20260824000000_content_workflow_publish_dates included).
