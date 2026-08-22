import { prisma } from "@/lib/db";
import type { ContentStatus, Locale } from "@/lib/validation/shared";
import {
  buildLanguageStatus,
  pickDisplayTitle,
  type LanguageStatusEntry,
} from "./shared";

// ---------------------------------------------------------------------------
// Projects list (/admin/projects) — search, status filter, sort (section 2)
// ---------------------------------------------------------------------------

export type ProjectSort =
  "updated-desc" | "updated-asc" | "title-asc" | "title-desc";

export const PROJECT_SORT_OPTIONS: { value: ProjectSort; label: string }[] = [
  { value: "updated-desc", label: "Last updated (newest)" },
  { value: "updated-asc", label: "Last updated (oldest)" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

export type ProjectListItem = {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  featured: boolean;
  updatedAt: Date;
  languages: LanguageStatusEntry[];
};

/**
 * Full-featured Project list for /admin/projects. Unlike
 * `getProjectsList` in queries/content.ts (a lightweight read used by
 * the Dashboard's Recent Content widget), this supports the list
 * screen's search/filter/sort — kept in its own function rather than
 * overloading the Dashboard query with parameters it doesn't need.
 *
 * Search matches slug and either locale's title (case-insensitive) —
 * "simple sorting"/"do not build advanced filtering" per Task 04 #2, so
 * this stays a single OR clause rather than a full-text index.
 *
 * Sorting by title happens in JS, not SQL: title isn't a Project column
 * (it lives on ProjectTranslation, and which locale's title counts is
 * `pickDisplayTitle`'s "English first" rule), so a DB-level ORDER BY
 * can't express it without a much heavier query. Project counts are
 * small (single-author local CMS), so this is not a performance
 * concern in practice.
 */
export async function listProjects(params: {
  search?: string;
  status?: ContentStatus | "ALL";
  sort?: ProjectSort;
}): Promise<ProjectListItem[]> {
  const search = params.search?.trim();
  const status =
    params.status && params.status !== "ALL" ? params.status : undefined;
  const sort = params.sort ?? "updated-desc";

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { slug: { contains: search } },
            {
              translations: {
                some: { title: { contains: search } },
              },
            },
          ],
        }
      : {}),
  };

  const projects = await prisma.project.findMany({
    where,
    orderBy:
      sort === "updated-asc" ? { updatedAt: "asc" } : { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      status: true,
      featured: true,
      updatedAt: true,
      translations: { select: { locale: true, title: true } },
    },
  });

  const items: ProjectListItem[] = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    status: project.status,
    featured: project.featured,
    updatedAt: project.updatedAt,
    title: pickDisplayTitle(project.translations, project.slug),
    languages: buildLanguageStatus(project.translations),
  }));

  if (sort === "title-asc" || sort === "title-desc") {
    items.sort((a, b) =>
      sort === "title-asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }

  return items;
}

// ---------------------------------------------------------------------------
// Single Project — full detail for the edit form
// ---------------------------------------------------------------------------

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      translations: true,
      links: { orderBy: { order: "asc" } },
      gallery: {
        orderBy: { order: "asc" },
        include: { media: true },
      },
      logo: true,
      cover: true,
      /** Task 06.1: Team members with their links, both in authored
       *  order — same orderBy convention as links/gallery above. */
      team: {
        orderBy: { order: "asc" },
        include: { links: { orderBy: { order: "asc" } } },
      },
    },
  });
}

/** Resolved return type of `getProjectById`, used by ProjectForm and the
 *  edit page instead of re-deriving the include shape by hand. */
export type ProjectDetail = Awaited<ReturnType<typeof getProjectById>>;

/**
 * Slug uniqueness check (section 5). `excludeId` lets an in-progress
 * edit keep its own slug without tripping over itself.
 */
export async function isSlugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.project.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!existing) return false;
  return existing.id !== excludeId;
}

// ---------------------------------------------------------------------------
// Media — the lightweight list for the logo/cover/gallery pickers now
// lives in queries/media.ts (Task 06 added the real Media Library
// alongside it). Re-exported here so ProjectForm, ArticleForm,
// GalleryEditor, MediaPicker, and lib/actions/media.ts — which all
// import `MediaOption`/`listMedia` from this module — don't need their
// import paths touched.
// ---------------------------------------------------------------------------

export type { MediaOption } from "./media";
export { listMedia } from "./media";

export type { Locale };
