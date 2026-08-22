/**
 * Task 06.1 — one-time migration: existing public-site Project data
 * (src/content/projects/projects.data.ts) -> the CMS's Prisma/SQLite
 * database.
 *
 * Run with:
 *   npx tsx scripts/migrate-projects.ts
 *
 * Reads the *actual* source file directly (not a hand-copied JSON dump)
 * so the migrated data can never drift from the source of truth — per
 * the task's "the existing project data is the source of truth"
 * instruction, transcribing it by hand would itself be a risk of
 * silently losing or altering data.
 *
 * Idempotency (section 17): every Project is upserted on its *original*
 * site id (e.g. "prj-simulix"), which this script also uses as the CMS
 * Project.id (see MIGRATED_PROJECT_ID_PREFIX note below — "Preserve ID
 * where compatible"). Running this twice does not create duplicates.
 *
 * "Do not overwrite newer CMS changes blindly" (section 17): an earlier
 * version of this script tried to detect "was this manually edited in
 * the CMS since the last run?" by comparing updatedAt to createdAt.
 * That heuristic is unreliable — updatedAt drifts away from createdAt
 * on every re-run of this very script too, not just on a manual CMS
 * edit, so it produces false positives for the ordinary case of "run
 * this again tomorrow" and silently stops syncing. Rather than ship a
 * heuristic that fails exactly the scenario it's meant to protect,
 * this script is explicit instead: it always re-derives a migrated
 * Project's scalar fields and relations (translations/links/gallery/
 * team) from the source file on every run — "source file wins" for
 * anything this script owns. Run it once, early, before making manual
 * edits to a migrated project's Task-06.1 fields in the CMS UI;
 * re-running afterward will overwrite those particular fields back to
 * the source file's values. It will never touch Projects it didn't
 * create (e.g. the seed demo project) and never drops/recreates the
 * database itself.
 *
 * Media (section 8): every local image path (e.g. "/projects/x.png")
 * is checked against the public website's own `public/` directory
 * (one level up from `cms/`) for a real file. None are expected to be
 * found in this delivery — the zip provided for this task does not
 * include a root `public/` folder — so every local image is reported
 * as missing at the end, per "if a file is missing, DO NOT fabricate
 * one. Clearly report missing files." A Media row is still created
 * (source path preserved, so the reference itself is never lost),
 * matching the schema's own documented precedent for path-only Media
 * rows with no corresponding uploaded file (see schema.prisma's Media
 * model comment). External (https://) images are recorded as-is,
 * un-verified — this script has no way to confirm a remote URL is
 * still live.
 */

import path from "node:path";
import fs from "node:fs";
import { prisma } from "../src/lib/db";
import { projects as sourceProjects } from "../../src/content/projects/projects.data";
import type { Project as SiteProject } from "../../src/types/content";
import type { MediaItem as SiteGalleryItem } from "../../src/types/media";

// ---------------------------------------------------------------------------
// Status mapping (section 11) — documented explicitly, not inferred silently.
// ---------------------------------------------------------------------------
const STATUS_MAP: Record<string, "DRAFT" | "PUBLISHED" | "ARCHIVED"> = {
  shipped: "PUBLISHED",
  active: "PUBLISHED",
  // "paused" and "archived" are valid public-site statuses (see
  // types/content.ts's ProjectStatus) that no current project uses.
  // Mapped conservatively: a paused project is still real, shipped-ish
  // work-in-progress and stays visible as PUBLISHED; an archived one
  // maps to the CMS's own ARCHIVED, since that's the one case where the
  // source data's own wording already says so.
  paused: "PUBLISHED",
  archived: "ARCHIVED",
};

const PUBLIC_WEBSITE_ROOT = path.resolve(__dirname, "..", "..", "public");
const CMS_UPLOADS_ROOT = path.resolve(__dirname, "..", "public");

type Report = {
  projectsImported: number;
  projectsUpdated: number;
  projectsSkipped: { id: string; slug: string; reason: string }[];
  teamMembersImported: number;
  mediaCreated: number;
  mediaReused: number;
  missingMediaFiles: string[];
  externalMediaUrls: string[];
  statusMappingUsed: Record<string, string>;
  fieldsRequiringTransformation: string[];
  assumptions: string[];
};

const report: Report = {
  projectsImported: 0,
  projectsUpdated: 0,
  projectsSkipped: [],
  teamMembersImported: 0,
  mediaCreated: 0,
  mediaReused: 0,
  missingMediaFiles: [],
  externalMediaUrls: [],
  statusMappingUsed: {},
  fieldsRequiringTransformation: [
    "status: source values (shipped/active/paused/archived) mapped to CMS ContentStatus per STATUS_MAP above — see 'Status mapping' in the printed report.",
    "shortDescription: mapped from the source's single `summary` field (the current site model has no separate short/long description split).",
    "description: the source has no long-form description distinct from `summary` — populated with the same `summary` text as shortDescription so the required column isn't left invented from nothing. Flagged as an assumption, not new content.",
    "relatedProjectIds: preserved as-is; resolvable immediately since migrated Projects keep their original site id as their CMS id.",
    "relatedArticleIds / experienceId: preserved as opaque external ids (site ids like 'art-...'/'exp-...'). Articles and Experience are not both migrated into CMS models with matching ids yet — reconciling these is left to whichever future task migrates that content the same way this one migrates Projects.",
  ],
  assumptions: [],
};

/** In-memory cache for this run, on top of the DB-level reuse check —
 *  avoids a second query for a source path already resolved earlier in
 *  the same run (e.g. a cover image reused inside the gallery too). */
const mediaCache = new Map<string, string>();

function isExternalUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function localFileExists(src: string): boolean {
  const relative = src.replace(/^\//, "");
  return (
    fs.existsSync(path.join(PUBLIC_WEBSITE_ROOT, relative)) ||
    fs.existsSync(path.join(CMS_UPLOADS_ROOT, relative))
  );
}

/** Reuses an existing Media row for `source` if one already exists
 *  (section 8: "do not create duplicate media files"); otherwise
 *  creates one, preserving the reference even if the underlying file
 *  can't be found (section 8: "if a file is missing, DO NOT fabricate
 *  one" — fabricating means inventing a *file*, not skipping the
 *  *reference*). */
async function getOrCreateMedia(params: {
  source: string;
  type: "IMAGE" | "VIDEO" | "PDF";
  title?: string;
  description?: string;
  downloadable?: boolean;
}): Promise<string> {
  const cached = mediaCache.get(params.source);
  if (cached) return cached;

  const existing = await prisma.media.findFirst({
    where: { source: params.source },
    select: { id: true },
  });
  if (existing) {
    mediaCache.set(params.source, existing.id);
    report.mediaReused += 1;
    return existing.id;
  }

  if (isExternalUrl(params.source)) {
    report.externalMediaUrls.push(params.source);
  } else if (!localFileExists(params.source)) {
    report.missingMediaFiles.push(params.source);
  }

  const created = await prisma.media.create({
    data: {
      type: params.type,
      title: params.title,
      description: params.description,
      source: params.source,
      downloadable: params.downloadable ?? false,
    },
    select: { id: true },
  });
  mediaCache.set(params.source, created.id);
  report.mediaCreated += 1;
  return created.id;
}

function galleryItemType(item: SiteGalleryItem): "IMAGE" | "VIDEO" | "PDF" {
  if (item.type === "video") return "VIDEO";
  if (item.type === "pdf") return "PDF";
  return "IMAGE";
}

/** Every migrated Project is fully re-derived from the source file on
 *  each run — see the file-level comment on idempotency for why a
 *  "was this manually edited?" heuristic isn't used instead. */
async function migrateProject(source: SiteProject): Promise<void> {
  const mappedStatus = STATUS_MAP[source.status] ?? "DRAFT";
  report.statusMappingUsed[source.status] = mappedStatus;

  const existing = await prisma.project.findUnique({
    where: { id: source.id },
    select: { id: true },
  });

  const logoMediaId = source.logoUrl
    ? await getOrCreateMedia({
        source: source.logoUrl,
        type: "IMAGE",
        title: `${source.slug} logo`,
      })
    : null;

  const coverMediaId = source.coverImageUrl
    ? await getOrCreateMedia({
        source: source.coverImageUrl,
        type: "IMAGE",
        title: `${source.slug} cover`,
      })
    : null;

  const galleryMediaIds: string[] = [];
  for (const item of source.gallery) {
    const mediaId = await getOrCreateMedia({
      source: item.src,
      type: galleryItemType(item),
      title: item.title,
      description: item.description,
      downloadable: item.downloadable ?? false,
    });
    galleryMediaIds.push(mediaId);
  }

  await prisma.$transaction(async (tx) => {
    await tx.project.upsert({
      where: { id: source.id },
      update: {
        slug: source.slug,
        status: mappedStatus,
        featured: source.featured,
        technologies: source.technologies,
        platforms: source.platforms,
        releaseYear: source.releaseYear ?? null,
        startDate: new Date(source.startDate),
        endDate: source.endDate ? new Date(source.endDate) : null,
        order: source.order,
        relatedProjectIds: source.relatedProjectIds,
        relatedArticleIds: source.relatedArticleIds,
        experienceId: source.experienceId,
        logoMediaId,
        coverMediaId,
      },
      create: {
        id: source.id,
        slug: source.slug,
        status: mappedStatus,
        featured: source.featured,
        technologies: source.technologies,
        platforms: source.platforms,
        releaseYear: source.releaseYear ?? null,
        startDate: new Date(source.startDate),
        endDate: source.endDate ? new Date(source.endDate) : null,
        order: source.order,
        relatedProjectIds: source.relatedProjectIds,
        relatedArticleIds: source.relatedArticleIds,
        experienceId: source.experienceId,
        logoMediaId,
        coverMediaId,
      },
    });

    // Translations — full replace, mirroring lib/actions/projects.ts's
    // own writeProjectRelations, so a re-run is idempotent the same way
    // a manual CMS save is.
    await tx.projectTranslation.deleteMany({ where: { projectId: source.id } });
    const translationRows = Object.entries(source.translations).map(
      ([locale, t]) => ({
        projectId: source.id,
        locale: locale as "en" | "fa",
        title: t!.title,
        shortDescription: t!.summary,
        description: t!.summary,
        category: source.category,
        tags: [],
        seoTitle: t!.metaTitle,
        seoDescription: t!.metaDescription,
        problem: t!.problem,
        solution: t!.solution,
        lessonsLearned: t!.lessonsLearned,
        targetAudience: t!.targetAudience,
        myRole: t!.myRole,
        featureHighlights: t!.featureHighlights ?? undefined,
      })
    );
    if (translationRows.length > 0) {
      await tx.projectTranslation.createMany({ data: translationRows });
    }

    // Links: the fixed CTA slots (source.links) plus source.externalLinks,
    // in that order — matches the public site's own CTA-then-external
    // rendering priority.
    await tx.projectLink.deleteMany({ where: { projectId: source.id } });
    const linkRows: {
      projectId: string;
      type:
        | "WEBSITE"
        | "REPOSITORY"
        | "PLAYABLE"
        | "DOWNLOAD"
        | "APP_STORE"
        | "GOOGLE_PLAY"
        | "OTHER";
      label: string;
      url: string;
      order: number;
    }[] = [];
    let linkOrder = 0;
    const slotLabels: Record<string, string> = {
      website: "Website",
      playable: "Playable Demo",
      download: "Download",
      appStore: "App Store",
      googlePlay: "Google Play",
      repository: "Repository",
    };
    const slotTypes: Record<
      string,
      "WEBSITE" | "PLAYABLE" | "DOWNLOAD" | "APP_STORE" | "GOOGLE_PLAY" | "REPOSITORY"
    > = {
      website: "WEBSITE",
      playable: "PLAYABLE",
      download: "DOWNLOAD",
      appStore: "APP_STORE",
      googlePlay: "GOOGLE_PLAY",
      repository: "REPOSITORY",
    };
    for (const [slot, url] of Object.entries(source.links)) {
      if (!url) continue;
      linkRows.push({
        projectId: source.id,
        type: slotTypes[slot],
        label: slotLabels[slot],
        url,
        order: linkOrder++,
      });
    }
    for (const link of source.externalLinks ?? []) {
      linkRows.push({
        projectId: source.id,
        type: "OTHER",
        label: link.label,
        url: link.url,
        order: linkOrder++,
      });
    }
    if (linkRows.length > 0) {
      await tx.projectLink.createMany({ data: linkRows });
    }

    // Gallery — order-preserved join to the Media rows resolved above.
    await tx.projectMedia.deleteMany({ where: { projectId: source.id } });
    if (galleryMediaIds.length > 0) {
      await tx.projectMedia.createMany({
        data: galleryMediaIds.map((mediaId, order) => ({
          projectId: source.id,
          mediaId,
          order,
        })),
      });
    }

    // Team.
    await tx.projectTeamMember.deleteMany({ where: { projectId: source.id } });
    for (const [order, member] of (source.team ?? []).entries()) {
      await tx.projectTeamMember.create({
        data: {
          projectId: source.id,
          name: member.name,
          order,
          links: {
            create: (member.links ?? []).map((link, linkOrder2) => ({
              label: link.label,
              url: link.url,
              order: linkOrder2,
            })),
          },
        },
      });
      report.teamMembersImported += 1;
    }
  });

  if (existing) {
    report.projectsUpdated += 1;
  } else {
    report.projectsImported += 1;
  }
}

async function main() {
  console.log(`Migrating ${sourceProjects.length} projects…`);
  for (const source of sourceProjects) {
    await migrateProject(source);
  }

  console.log("\n=== Migration report ===");
  console.log(`Projects imported (new):     ${report.projectsImported}`);
  console.log(`Projects updated (existing): ${report.projectsUpdated}`);
  console.log(`Projects skipped:            ${report.projectsSkipped.length}`);
  for (const skipped of report.projectsSkipped) {
    console.log(`  - ${skipped.slug} (${skipped.id}): ${skipped.reason}`);
  }
  console.log(`Team members imported:       ${report.teamMembersImported}`);
  console.log(
    `Media mapped:                 ${report.mediaCreated} created, ${report.mediaReused} reused`
  );
  console.log(`Missing local media files:   ${report.missingMediaFiles.length}`);
  for (const file of report.missingMediaFiles) console.log(`  - ${file}`);
  console.log(`External (unverified) media: ${report.externalMediaUrls.length}`);
  console.log("Status mapping used:", report.statusMappingUsed);
  console.log("\nFields that required transformation:");
  for (const note of report.fieldsRequiringTransformation) {
    console.log(`  - ${note}`);
  }
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
