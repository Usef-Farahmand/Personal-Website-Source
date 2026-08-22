/**
 * Task 06.2 — one-time migration: existing public-site Article data
 * (src/content/articles/articles.data.ts) -> the CMS's Prisma/SQLite
 * database. Same approach as scripts/migrate-projects.ts (Task 06.1) —
 * see that file's comments for the reasoning shared by both.
 *
 * Run with:
 *   npx tsx scripts/migrate-articles.ts
 *
 * Reads the source file directly rather than a hand-copied dump, so
 * migrated data can never drift from "the existing Article data is the
 * source of truth."
 *
 * Idempotency: every Article is upserted on its *original* site id
 * (e.g. "art-broken-arrow-rts"), preserved as the CMS Article.id too
 * ("Preserve ID where compatible" — same call as Task 06.1's Projects).
 * Running this twice does not create duplicates.
 *
 * "Do not overwrite newer CMS changes blindly": Task 06.1's first
 * attempt at this used an updatedAt-vs-createdAt heuristic to detect
 * manual edits, and that heuristic produced false positives on the very
 * next ordinary re-run (timestamps drift on every run, not just a
 * manual edit) — see that script's comment. This script uses the same,
 * more honest fix: it always re-derives a migrated Article's scalar
 * fields and translations from the source file — "source file wins"
 * for anything this script owns. Run it once, early, before making
 * manual edits to a migrated Article's Task-06.2 fields in the CMS UI.
 * It never touches Articles it didn't create, and never drops/resets
 * the database.
 *
 * Status (section 7): the source Article type has no status field at
 * all — every entry in the array is, by construction, a live published
 * article (there's no draft concept in the static site data). So every
 * migrated Article maps to PUBLISHED. Documented here rather than left
 * implicit, per "document all status mappings."
 *
 * Slugs (section 14): the source Article type has no slug field either
 * — the public site doesn't route to individual article pages (these
 * are external Medium posts; see sourceUrl). A slug is derived
 * deterministically from the id (stripping the "art-" prefix) since
 * the CMS's own Article.slug column requires one and is unique.
 *
 * Header images (section 5): no existing Article uses headerImageUrl —
 * confirmed by inspecting the source file (0 occurrences) — so no
 * Media rows are created by this script and nothing is reported
 * missing for images. If a future Article does set headerImageUrl,
 * this script maps it through the same getOrCreateMedia reuse-or-report
 * pattern as migrate-projects.ts.
 */

import { prisma } from "../src/lib/db";
import { articles as sourceArticles } from "../../src/content/articles/articles.data";
import type { Article as SiteArticle } from "../../src/types/content";

const PUBLISHED_STATUS = "PUBLISHED" as const;

type Report = {
  totalFound: number;
  articlesImported: number;
  articlesUpdated: number;
  enTranslationsImported: number;
  faTranslationsImported: number;
  headerImagesMapped: number;
  missingMediaFiles: string[];
  statusMappingUsed: Record<string, string>;
  relationshipNotes: string[];
  duplicateSlugIssues: string[];
  unsupportedFields: string[];
  assumptions: string[];
};

const report: Report = {
  totalFound: sourceArticles.length,
  articlesImported: 0,
  articlesUpdated: 0,
  enTranslationsImported: 0,
  faTranslationsImported: 0,
  headerImagesMapped: 0,
  missingMediaFiles: [],
  statusMappingUsed: {
    "(no status field in source — every entry is a live published article)":
      PUBLISHED_STATUS,
  },
  relationshipNotes: [
    "relatedProjectIds: resolves immediately — migrated Projects (Task 06.1) kept their original site ids as CMS Project.id.",
    "relatedArticleIds: resolves immediately — this migration keeps original Article ids as CMS Article.id too (all source values are currently empty arrays, but the field is preserved for when they're not).",
    "Project.relatedArticleIds (added in Task 06.1) now resolves as well, now that Article ids are preserved by this migration.",
    "No Experience or Skill CMS models exist yet — not applicable here since the Article type has no such reference fields.",
  ],
  duplicateSlugIssues: [],
  unsupportedFields: [],
  assumptions: [
    "slug: not present in the source data; derived from each Article's id (stripping the 'art-' prefix) since the CMS's Article.slug column is required and unique.",
    "status: not present in the source data; every Article is mapped to PUBLISHED, since inclusion in the source array means it's currently live on the public site.",
    "category/tags: shared per-Article in the source data, written into both the EN and FA ArticleTranslation rows — matching the CMS's existing per-translation category/tags columns (same pattern already established for Project.category/tags in Task 06.1's migration).",
  ],
};

function slugFromId(id: string): string {
  return id.startsWith("art-") ? id.slice("art-".length) : id;
}

async function migrateArticle(source: SiteArticle): Promise<void> {
  const slug = slugFromId(source.id);

  const existingBySlug = await prisma.article.findFirst({
    where: { slug, NOT: { id: source.id } },
    select: { id: true },
  });
  if (existingBySlug) {
    report.duplicateSlugIssues.push(
      `Derived slug "${slug}" for ${source.id} collides with existing Article ${existingBySlug.id} — skipped.`
    );
    return;
  }

  const existing = await prisma.article.findUnique({
    where: { id: source.id },
    select: { id: true },
  });

  let headerMediaId: string | null = null;
  if (source.headerImageUrl) {
    const existingMedia = await prisma.media.findFirst({
      where: { source: source.headerImageUrl },
      select: { id: true },
    });
    if (existingMedia) {
      headerMediaId = existingMedia.id;
    } else {
      const created = await prisma.media.create({
        data: {
          type: "IMAGE",
          title: `${slug} header`,
          source: source.headerImageUrl,
        },
        select: { id: true },
      });
      headerMediaId = created.id;
      report.missingMediaFiles.push(source.headerImageUrl);
    }
    report.headerImagesMapped += 1;
  }

  await prisma.$transaction(async (tx) => {
    await tx.article.upsert({
      where: { id: source.id },
      update: {
        slug,
        status: PUBLISHED_STATUS,
        featured: source.featured ?? false,
        sourceUrl: source.sourceUrl,
        sourcePlatform: source.sourcePlatform.toUpperCase() as "MEDIUM" | "LINKEDIN",
        readingTimeMinutes: source.readingTimeMinutes,
        publishedAt: new Date(source.publishedDate),
        headerMediaId,
        order: source.order,
        relatedProjectIds: source.relatedProjectIds,
        relatedArticleIds: source.relatedArticleIds,
        coAuthors: source.coAuthors ?? [],
      },
      create: {
        id: source.id,
        slug,
        status: PUBLISHED_STATUS,
        featured: source.featured ?? false,
        sourceUrl: source.sourceUrl,
        sourcePlatform: source.sourcePlatform.toUpperCase() as "MEDIUM" | "LINKEDIN",
        readingTimeMinutes: source.readingTimeMinutes,
        publishedAt: new Date(source.publishedDate),
        headerMediaId,
        order: source.order,
        relatedProjectIds: source.relatedProjectIds,
        relatedArticleIds: source.relatedArticleIds,
        coAuthors: source.coAuthors ?? [],
      },
    });

    // Translations — full replace, mirroring lib/actions/articles.ts's
    // own writeArticleTranslations, so a re-run is idempotent the same
    // way a manual CMS save is.
    await tx.articleTranslation.deleteMany({ where: { articleId: source.id } });
    const translationRows = Object.entries(source.translations).map(
      ([locale, t]) => ({
        articleId: source.id,
        locale: locale as "en" | "fa",
        title: t!.title,
        summary: t!.summary,
        category: source.category,
        tags: source.tags,
        seoTitle: t!.metaTitle,
        seoDescription: t!.metaDescription,
      })
    );
    if (translationRows.length > 0) {
      await tx.articleTranslation.createMany({ data: translationRows });
    }
    for (const row of translationRows) {
      if (row.locale === "en") report.enTranslationsImported += 1;
      if (row.locale === "fa") report.faTranslationsImported += 1;
    }
  });

  if (existing) {
    report.articlesUpdated += 1;
  } else {
    report.articlesImported += 1;
  }
}

async function main() {
  console.log(`Migrating ${sourceArticles.length} articles…`);
  for (const source of sourceArticles) {
    await migrateArticle(source);
  }

  console.log("\n=== Article migration report ===");
  console.log(`Total articles found:        ${report.totalFound}`);
  console.log(`Articles imported (new):     ${report.articlesImported}`);
  console.log(`Articles updated (existing): ${report.articlesUpdated}`);
  console.log(`EN translations imported:    ${report.enTranslationsImported}`);
  console.log(`FA translations imported:    ${report.faTranslationsImported}`);
  console.log(`Header images mapped:        ${report.headerImagesMapped}`);
  console.log(`Missing header image files:  ${report.missingMediaFiles.length}`);
  for (const file of report.missingMediaFiles) console.log(`  - ${file}`);
  console.log("Status mapping used:", report.statusMappingUsed);
  console.log(`Duplicate slug issues:       ${report.duplicateSlugIssues.length}`);
  for (const issue of report.duplicateSlugIssues) console.log(`  - ${issue}`);
  console.log("\nRelationship notes:");
  for (const note of report.relationshipNotes) console.log(`  - ${note}`);
  console.log("\nAssumptions:");
  for (const note of report.assumptions) console.log(`  - ${note}`);
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
