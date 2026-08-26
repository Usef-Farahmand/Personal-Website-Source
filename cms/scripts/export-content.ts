/**
 * Task 08 — Static Content Export & Website Sync.
 *
 * Run with:
 *   npm run content:export   (from cms/)
 *
 * Reads every currently-PUBLISHED Project and Article from the CMS's own
 * SQLite database (via lib/queries/publishable.ts — the one sanctioned
 * "what's publishable" boundary, see that file's comment) and writes:
 *
 *   ../src/content/generated/projects.json
 *   ../src/content/generated/articles.json
 *   ../src/content/generated/media.json
 *   ../public/content-media/{images,videos,pdfs}/<file>
 *
 * — all inside the *public website's* project (the sibling `../` of this
 * `cms/` package), never the other way around. This is the entire
 * bridge: the public website's build reads these plain files at build
 * time and never imports Prisma, never opens the SQLite file, and never
 * talks to this CMS process at all (section 1/20's hard requirement).
 *
 * Draft/Archived content, by construction, never reaches this script —
 * getPublishedProjects/getPublishedArticles only ever query
 * `status: "PUBLISHED"`. There is no "export everything, filter later"
 * step anywhere in this file for that reason: the query itself is the
 * safety boundary (section 3, section 20's "verify this behavior with
 * tests" — see the delivery notes for how this was checked, since a
 * live DB isn't available in every environment this runs in).
 *
 * Validate-then-swap (sections 15/16): everything is built under a
 * temporary staging directory and checked before anything under
 * `src/content/generated/` or `public/content-media/` is touched. If
 * validation fails, this script exits non-zero, prints every problem
 * found, and leaves the existing generated content exactly as it was —
 * never a half-written directory.
 */

import path from "node:path";
import fs from "node:fs";
import { prisma } from "../src/lib/db";
import {
  getPublishedProjects,
  getPublishedArticles,
} from "../src/lib/queries/publishable";
import { extractYoutubeVideoId } from "../src/lib/media/youtube";
import type {
  Project as SiteProject,
  ProjectTranslation as SiteProjectTranslation,
  ProjectStatus as SiteProjectStatus,
  ProjectFeatureHighlight,
  ExternalLink,
  TeamMember,
  Article as SiteArticle,
  ArticleTranslation as SiteArticleTranslation,
  ArticleSourcePlatform as SiteArticleSourcePlatform,
  Locale as SiteLocale,
} from "../../src/types/content";
import type { MediaItem, MediaFileType } from "../../src/types/media";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const CMS_ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.resolve(CMS_ROOT, "..");
const CMS_UPLOADS_DIR = path.join(CMS_ROOT, "public", "uploads");

const SITE_GENERATED_DIR = path.join(SITE_ROOT, "src", "content", "generated");
const SITE_MEDIA_DIR = path.join(SITE_ROOT, "public", "content-media");

const STAGING_ROOT = path.join(CMS_ROOT, ".export-tmp");
const STAGING_CONTENT_DIR = path.join(STAGING_ROOT, "generated");
const STAGING_MEDIA_DIR = path.join(STAGING_ROOT, "content-media");

const SUPPORTED_LOCALES: SiteLocale[] = ["en", "fa"];

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Every problem found is collected rather than thrown on the first one,
 *  so a single export run reports everything wrong at once (section 27:
 *  "provide useful error messages") instead of a fix-one/re-run/fix-the-
 *  next loop. */
class ValidationErrors {
  private errors: string[] = [];

  add(message: string): void {
    this.errors.push(message);
  }

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  report(): void {
    console.error(
      `\nContent export failed — ${this.errors.length} problem${
        this.errors.length === 1 ? "" : "s"
      } found. Nothing was written.\n`
    );
    for (const message of this.errors) {
      console.error(`  ✗ ${message}`);
    }
    console.error(
      "\nFix the above in the CMS (or move the affected item back to Draft) and re-run `npm run content:export`."
    );
  }
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Media resolution
// ---------------------------------------------------------------------------

type ResolvedMediaRef =
  | { kind: "external"; url: string }
  | { kind: "local"; url: string; absolutePath: string; publicPath: string }
  | { kind: "invalid" };

/**
 * Classifies a `Media.source` (or `.downloadUrl`) value into an external
 * URL (passed through untouched — nothing to copy, nothing this script
 * can verify beyond "is this a URL") or a local CMS-uploaded file (which
 * must actually exist under `cms/public/uploads/`, and gets copied into
 * the public website's own `public/content-media/`, preserving the
 * `{images,videos,pdfs}/<file>` subpath — see lib/media/storage.ts's
 * comment on why that layout was chosen specifically to make this a
 * plain file copy, not a path rewrite).
 *
 * Anything that's neither a recognizable external URL nor a `/uploads/`
 * path is a pre-Task-06 hand-typed value with no reliable interpretation
 * (see schema.prisma's Media.source comment) — `"invalid"` here, which
 * the caller turns into a validation error rather than guessing.
 */
function resolveMediaSource(source: string): ResolvedMediaRef {
  if (/^https?:\/\//i.test(source)) {
    return { kind: "external", url: source };
  }
  if (source.startsWith("/uploads/")) {
    const relative = source.slice("/uploads/".length);
    const absolutePath = path.join(CMS_UPLOADS_DIR, relative);
    const publicPath = `/content-media/${relative}`;
    return { kind: "local", url: publicPath, absolutePath, publicPath };
  }
  return { kind: "invalid" };
}

/** Copies a local media file into the staging media directory, creating
 *  intermediate folders as needed. Files are content-addressed by the
 *  CMS's own UUID filename (see lib/media/storage.ts), so re-exporting
 *  the same Media twice (e.g. referenced by both a Project cover and a
 *  gallery item) is naturally a no-op the second time within one run —
 *  `copiedPaths` below dedupes to avoid the redundant `fs.copyFileSync`
 *  call, not because a second copy would be incorrect. */
function copyLocalMedia(
  ref: Extract<ResolvedMediaRef, { kind: "local" }>,
  copiedPaths: Set<string>
): void {
  if (copiedPaths.has(ref.publicPath)) return;
  const destination = path.join(
    STAGING_MEDIA_DIR,
    ref.publicPath.replace(/^\/content-media\//, "")
  );
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(ref.absolutePath, destination);
  copiedPaths.add(ref.publicPath);
}

const MEDIA_TYPE_MAP: Record<"IMAGE" | "VIDEO" | "PDF", MediaFileType> = {
  IMAGE: "image",
  VIDEO: "video",
  PDF: "pdf",
};

// ---------------------------------------------------------------------------
// Field-mapping notes (see delivery notes for the full write-up):
//
// - Project.status (public "active"|"shipped"|"paused"|"archived") has no
//   CMS source field at all — deriveProjectLifecycleStatus() below is a
//   documented, deterministic heuristic (endDate set -> "shipped", else
//   "active"), never "paused"/"archived" (nothing in the CMS distinguishes
//   those). Flagged prominently in the delivery notes, not silently guessed.
// - `category` and `tags` are stored per-translation in the CMS but are
//   *shared* (non-localized) fields on the public Project/Article — the
//   English translation's value is used as canonical (falls back to
//   whichever locale exists if English is somehow absent, though
//   validation below requires English regardless).
// - CMS ProjectTranslation.description and .tags have no corresponding
//   public field and are not exported — every other CMS translation field
//   has a direct public target.
// ---------------------------------------------------------------------------

function deriveProjectLifecycleStatus(endDate: Date | null): SiteProjectStatus {
  return endDate ? "shipped" : "active";
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const SOURCE_PLATFORM_MAP: Record<string, SiteArticleSourcePlatform> = {
  MEDIUM: "medium",
  LINKEDIN: "linkedin",
  WEBSITE: "website",
  OTHER: "other",
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

type PublishedProjects = Awaited<ReturnType<typeof getPublishedProjects>>;
type PublishedProject = PublishedProjects[number];
type PublishedArticles = Awaited<ReturnType<typeof getPublishedArticles>>;
type PublishedArticle = PublishedArticles[number];

async function run() {
  console.log("Reading published content from the CMS database…\n");

  const [
    projects,
    articles,
    draftOrArchivedProjectCount,
    draftOrArchivedArticleCount,
  ] = await Promise.all([
    getPublishedProjects(),
    getPublishedArticles(),
    prisma.project.count({ where: { status: { not: "PUBLISHED" } } }),
    prisma.article.count({ where: { status: { not: "PUBLISHED" } } }),
  ]);

  const errors = new ValidationErrors();

  const publishedProjectIds = new Set(projects.map((p) => p.id));
  const publishedArticleIds = new Set(articles.map((a) => a.id));

  // -- Slugs --------------------------------------------------------------
  const seenProjectSlugs = new Map<string, string>(); // slug -> first project id
  for (const project of projects) {
    if (!SLUG_PATTERN.test(project.slug)) {
      errors.add(
        `Project "${project.slug}" (${project.id}) has an invalid slug.`
      );
    }
    const existing = seenProjectSlugs.get(project.slug);
    if (existing) {
      errors.add(
        `Duplicate Project slug "${project.slug}" (${existing} and ${project.id}).`
      );
    } else {
      seenProjectSlugs.set(project.slug, project.id);
    }
  }

  // -- Required fields & translation completeness --------------------------
  for (const project of projects) {
    if (!project.startDate) {
      errors.add(
        `Project "${project.slug}" is Published but has no start date set.`
      );
    }
    for (const locale of SUPPORTED_LOCALES) {
      const translation = project.translations.find((t) => t.locale === locale);
      if (!translation) {
        errors.add(
          `Project "${project.slug}" is Published but has no ${locale.toUpperCase()} translation.`
        );
        continue;
      }
      for (const field of ["problem", "solution", "lessonsLearned"] as const) {
        if (!translation[field]) {
          errors.add(
            `Project "${project.slug}" (${locale.toUpperCase()}) is missing "${field}", which is required for the public site.`
          );
        }
      }
    }
    for (const link of project.links) {
      if (!isValidUrl(link.url)) {
        errors.add(
          `Project "${project.slug}" has an invalid link URL: "${link.url}".`
        );
      }
    }
    for (const member of project.team) {
      for (const link of member.links) {
        if (!isValidUrl(link.url)) {
          errors.add(
            `Project "${project.slug}" team member "${member.name}" has an invalid link URL: "${link.url}".`
          );
        }
      }
    }
    for (const entry of project.gallery) {
      if (entry.type === "YOUTUBE_VIDEO") {
        const videoId = entry.youtubeVideoId ?? "";
        if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
          errors.add(
            `Project "${project.slug}" has a gallery item with an invalid YouTube video id ("${videoId}").`
          );
        } else if (
          entry.youtubeUrl &&
          extractYoutubeVideoId(entry.youtubeUrl) !== videoId
        ) {
          errors.add(
            `Project "${project.slug}" has a gallery item whose stored YouTube video id doesn't match its URL ("${entry.youtubeUrl}").`
          );
        }
      }
    }
  }

  for (const article of articles) {
    if (!article.publishedAt) {
      errors.add(
        `Article "${article.slug}" is Published but has no publication date set.`
      );
    }
    if (!isValidUrl(article.sourceUrl)) {
      errors.add(
        `Article "${article.slug}" has an invalid source URL: "${article.sourceUrl}".`
      );
    }
    for (const locale of SUPPORTED_LOCALES) {
      const translation = article.translations.find((t) => t.locale === locale);
      if (!translation) {
        errors.add(
          `Article "${article.slug}" is Published but has no ${locale.toUpperCase()} translation.`
        );
      }
    }
  }

  // -- Media: every referenced local file must actually exist -------------
  const referencedMedia = new Map<
    string,
    {
      source: string;
      downloadUrl: string | null;
      thumbnail: string | null;
      describedBy: string;
    }
  >();
  const collectMedia = (
    media:
      | {
          id: string;
          source: string;
          downloadUrl: string | null;
          thumbnail: string | null;
        }
      | null
      | undefined,
    describedBy: string
  ) => {
    if (media && !referencedMedia.has(media.id)) {
      referencedMedia.set(media.id, {
        source: media.source,
        downloadUrl: media.downloadUrl,
        thumbnail: media.thumbnail,
        describedBy,
      });
    }
  };
  for (const project of projects) {
    collectMedia(project.logo, `Project "${project.slug}" logo`);
    collectMedia(project.cover, `Project "${project.slug}" cover`);
    for (const entry of project.gallery) {
      if (entry.type === "MEDIA") {
        collectMedia(entry.media, `Project "${project.slug}" gallery item`);
      }
    }
  }
  for (const article of articles) {
    collectMedia(article.headerImage, `Article "${article.slug}" header image`);
  }

  for (const [, info] of referencedMedia) {
    for (const value of [info.source, info.downloadUrl, info.thumbnail].filter(
      (v): v is string => Boolean(v)
    )) {
      const resolved = resolveMediaSource(value);
      if (resolved.kind === "invalid") {
        errors.add(
          `${info.describedBy} has an unrecognized media path: "${value}".`
        );
      } else if (
        resolved.kind === "local" &&
        !fs.existsSync(resolved.absolutePath)
      ) {
        errors.add(
          `${info.describedBy} references a local file that doesn't exist on disk: "${value}".`
        );
      }
    }
  }

  if (errors.hasErrors) {
    errors.report();
    process.exitCode = 1;
    return;
  }

  // -- Build staging output -------------------------------------------------
  fs.rmSync(STAGING_ROOT, { recursive: true, force: true });
  fs.mkdirSync(STAGING_CONTENT_DIR, { recursive: true });
  fs.mkdirSync(STAGING_MEDIA_DIR, { recursive: true });

  const copiedMediaPaths = new Set<string>();
  let mediaCopiedCount = 0;
  let youtubeReferenceCount = 0;

  /** Resolves + (for local files) copies a Media row into a public URL,
   *  used for Project logo/cover/Article header image, which the public
   *  type models as a plain string, not a full MediaItem. */
  function resolveAndCopy(source: string): string {
    const resolved = resolveMediaSource(source);
    if (resolved.kind === "external") return resolved.url;
    if (resolved.kind === "local") {
      const alreadyCopied = copiedMediaPaths.has(resolved.publicPath);
      copyLocalMedia(resolved, copiedMediaPaths);
      if (!alreadyCopied) mediaCopiedCount += 1;
      return resolved.publicPath;
    }
    // Unreachable — validated above — but keeps this function total.
    return source;
  }

  function mapMediaItem(media: {
    id: string;
    type: "IMAGE" | "VIDEO" | "PDF";
    title: string | null;
    description: string | null;
    source: string;
    thumbnail: string | null;
    downloadable: boolean;
    downloadUrl: string | null;
  }): MediaItem {
    return {
      id: media.id,
      type: MEDIA_TYPE_MAP[media.type],
      title: media.title ?? undefined,
      description: media.description ?? undefined,
      src: resolveAndCopy(media.source),
      thumbnail: media.thumbnail ? resolveAndCopy(media.thumbnail) : undefined,
      downloadUrl: media.downloadUrl
        ? resolveAndCopy(media.downloadUrl)
        : undefined,
      downloadable: media.downloadable,
    };
  }

  function mapGalleryEntry(
    entry: PublishedProject["gallery"][number]
  ): MediaItem | null {
    if (entry.type === "YOUTUBE_VIDEO") {
      youtubeReferenceCount += 1;
      const videoId = entry.youtubeVideoId as string;
      return {
        id: entry.id,
        type: "youtube",
        title: entry.youtubeTitle ?? undefined,
        src: entry.youtubeUrl ?? `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: entry.youtubeThumbnailUrl ?? undefined,
        downloadable: false,
        externalUrl: entry.youtubeUrl ?? undefined,
        externalLabel: "Watch on YouTube",
        youtubeVideoId: videoId,
      };
    }
    if (!entry.media) return null;
    return mapMediaItem(entry.media);
  }

  const PROJECT_LINK_SLOT: Record<string, keyof SiteProject["links"] | null> = {
    WEBSITE: "website",
    REPOSITORY: "repository",
    PLAYABLE: "playable",
    DOWNLOAD: "download",
    APP_STORE: "appStore",
    GOOGLE_PLAY: "googlePlay",
    OTHER: null,
  };

  function mapProjectLinks(links: PublishedProject["links"]): {
    links: SiteProject["links"];
    externalLinks: ExternalLink[];
  } {
    const result: SiteProject["links"] = {};
    const externalLinks: ExternalLink[] = [];
    for (const link of links) {
      const slot = PROJECT_LINK_SLOT[link.type];
      if (slot) {
        result[slot] = link.url;
      } else {
        externalLinks.push({ label: link.label, url: link.url });
      }
    }
    return { links: result, externalLinks };
  }

  function mapTeam(team: PublishedProject["team"]): TeamMember[] | undefined {
    if (team.length === 0) return undefined;
    return team.map((member) => ({
      name: member.name,
      links:
        member.links.length > 0
          ? member.links.map((l) => ({ label: l.label, url: l.url }))
          : undefined,
    }));
  }

  function canonicalProjectTranslation(
    translations: PublishedProject["translations"]
  ): PublishedProject["translations"][number] {
    return translations.find((t) => t.locale === "en") ?? translations[0];
  }

  function canonicalArticleTranslation(
    translations: PublishedArticle["translations"]
  ): PublishedArticle["translations"][number] {
    return translations.find((t) => t.locale === "en") ?? translations[0];
  }

  function mapProjectTranslation(
    translation: PublishedProject["translations"][number]
  ): SiteProjectTranslation {
    return {
      title: translation.title,
      summary: translation.shortDescription,
      problem: translation.problem ?? "",
      solution: translation.solution ?? "",
      lessonsLearned: translation.lessonsLearned ?? "",
      targetAudience: translation.targetAudience ?? undefined,
      myRole: translation.myRole ?? undefined,
      featureHighlights: translation.featureHighlights
        ? (translation.featureHighlights as unknown as ProjectFeatureHighlight[])
        : undefined,
      metaTitle: translation.seoTitle ?? translation.title,
      metaDescription:
        translation.seoDescription ?? translation.shortDescription,
    };
  }

  function mapProject(project: PublishedProject): SiteProject {
    const { links, externalLinks } = mapProjectLinks(project.links);
    const translations: Partial<Record<SiteLocale, SiteProjectTranslation>> =
      {};
    for (const locale of SUPPORTED_LOCALES) {
      const translation = project.translations.find((t) => t.locale === locale);
      if (translation)
        translations[locale] = mapProjectTranslation(translation);
    }

    return {
      id: project.id,
      slug: project.slug,
      status: deriveProjectLifecycleStatus(project.endDate),
      featured: project.featured,
      category: canonicalProjectTranslation(project.translations)
        .category as SiteProject["category"],
      technologies: project.technologies as string[],
      platforms: project.platforms as SiteProject["platforms"],
      releaseYear: project.releaseYear ?? undefined,
      startDate: toDateOnly(project.startDate as Date),
      endDate: project.endDate ? toDateOnly(project.endDate) : null,
      team: mapTeam(project.team),
      logoUrl: project.logo ? resolveAndCopy(project.logo.source) : undefined,
      coverImageUrl: project.cover
        ? resolveAndCopy(project.cover.source)
        : undefined,
      gallery: project.gallery
        .map(mapGalleryEntry)
        .filter((item): item is MediaItem => item !== null),
      links,
      externalLinks: externalLinks.length > 0 ? externalLinks : undefined,
      relatedProjectIds: (project.relatedProjectIds as string[]).filter((id) =>
        publishedProjectIds.has(id)
      ),
      relatedArticleIds: (project.relatedArticleIds as string[]).filter((id) =>
        publishedArticleIds.has(id)
      ),
      experienceId: project.experienceId,
      order: project.order,
      translations,
    };
  }

  function mapArticleTranslation(
    translation: PublishedArticle["translations"][number]
  ): SiteArticleTranslation {
    return {
      title: translation.title,
      summary: translation.summary,
      metaTitle: translation.seoTitle ?? translation.title,
      metaDescription: translation.seoDescription ?? translation.summary,
    };
  }

  function mapArticle(article: PublishedArticle): SiteArticle {
    const translations: Partial<Record<SiteLocale, SiteArticleTranslation>> =
      {};
    for (const locale of SUPPORTED_LOCALES) {
      const translation = article.translations.find((t) => t.locale === locale);
      if (translation)
        translations[locale] = mapArticleTranslation(translation);
    }

    return {
      id: article.id,
      category: canonicalArticleTranslation(article.translations)
        .category as SiteArticle["category"],
      tags: canonicalArticleTranslation(article.translations)
        .tags as unknown as string[],
      sourcePlatform: SOURCE_PLATFORM_MAP[article.sourcePlatform] ?? "other",
      sourceUrl: article.sourceUrl,
      readingTimeMinutes: article.readingTimeMinutes ?? 0,
      publishedDate: toDateOnly(article.publishedAt as Date),
      headerImageUrl: article.headerImage
        ? resolveAndCopy(article.headerImage.source)
        : undefined,
      relatedProjectIds: (article.relatedProjectIds as string[]).filter((id) =>
        publishedProjectIds.has(id)
      ),
      relatedArticleIds: (article.relatedArticleIds as string[]).filter((id) =>
        publishedArticleIds.has(id)
      ),
      featured: article.featured,
      coAuthors:
        (article.coAuthors as string[]).length > 0
          ? (article.coAuthors as string[])
          : undefined,
      order: article.order,
      translations,
    };
  }

  const exportedProjects = projects.map(mapProject);
  const exportedArticles = articles.map(mapArticle);

  // media.json: a flat manifest of every Media item actually shipped —
  // documentation/debugging aid (section 12's example structure), not
  // something the public site's content layer imports directly (gallery
  // items already carry their own MediaItem inline).
  const exportedMedia = [...referencedMedia.entries()].map(([id, info]) => ({
    id,
    ...info,
  }));

  const writeJson = (filename: string, data: unknown) => {
    const filePath = path.join(STAGING_CONTENT_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    // Read-back sanity check — catches a serialization problem (e.g. a
    // circular reference or non-JSON-safe value) before this ever
    // reaches the atomic swap.
    JSON.parse(fs.readFileSync(filePath, "utf-8"));
  };

  writeJson("projects.json", exportedProjects);
  writeJson("articles.json", exportedArticles);
  writeJson("media.json", exportedMedia);

  // -- Atomic swap ------------------------------------------------------
  fs.rmSync(SITE_GENERATED_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(SITE_GENERATED_DIR), { recursive: true });
  fs.renameSync(STAGING_CONTENT_DIR, SITE_GENERATED_DIR);

  fs.rmSync(SITE_MEDIA_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(SITE_MEDIA_DIR), { recursive: true });
  fs.renameSync(STAGING_MEDIA_DIR, SITE_MEDIA_DIR);

  fs.rmSync(STAGING_ROOT, { recursive: true, force: true });

  // -- Report -------------------------------------------------------------
  console.log("Content export completed.\n");
  console.log(`Projects: ${exportedProjects.length}`);
  console.log(`Articles: ${exportedArticles.length}`);
  console.log(`Media: ${exportedMedia.length}`);
  console.log(`Locales: ${SUPPORTED_LOCALES.join(", ")}\n`);
  console.log("Files generated:");
  console.log("- projects.json");
  console.log("- articles.json");
  console.log("- media.json\n");
  console.log(`Media copied: ${mediaCopiedCount}`);
  console.log(`YouTube references: ${youtubeReferenceCount}`);
  console.log(
    `Drafts/Archived skipped: ${draftOrArchivedProjectCount + draftOrArchivedArticleCount}`
  );
}

run()
  .catch((error) => {
    console.error(
      "\nContent export failed unexpectedly. Nothing was written to the public website.\n"
    );
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    fs.rmSync(STAGING_ROOT, { recursive: true, force: true });
    await prisma.$disconnect();
  });
