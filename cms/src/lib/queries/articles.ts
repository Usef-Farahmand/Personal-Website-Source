import { prisma } from "@/lib/db";
import type { ContentStatus } from "@/lib/validation/shared";
import {
  buildLanguageStatus,
  pickDisplayTitle,
  type LanguageStatusEntry,
} from "./shared";

// ---------------------------------------------------------------------------
// Articles list (/admin/articles) — search, status filter, sort (section 2)
// ---------------------------------------------------------------------------

export type ArticleSort =
  | "updated-desc"
  | "updated-asc"
  | "published-desc"
  | "published-asc"
  | "title-asc"
  | "title-desc";

export const ARTICLE_SORT_OPTIONS: { value: ArticleSort; label: string }[] = [
  { value: "updated-desc", label: "Last updated (newest)" },
  { value: "updated-asc", label: "Last updated (oldest)" },
  { value: "published-desc", label: "Publication date (newest)" },
  { value: "published-asc", label: "Publication date (oldest)" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  featured: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
  languages: LanguageStatusEntry[];
};

/**
 * Full-featured Article list for /admin/articles. Same reasoning as
 * `listProjects` in queries/projects.ts: search matches slug and
 * either locale's title, sorting by title happens in JS (title isn't a
 * DB column — it lives on ArticleTranslation). `published-*` sort is
 * the one addition over Projects, since Task 05 #2 explicitly lists
 * publication date as a useful sort Projects didn't have.
 */
export async function listArticles(params: {
  search?: string;
  status?: ContentStatus | "ALL";
  sort?: ArticleSort;
}): Promise<ArticleListItem[]> {
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

  const orderBy =
    sort === "updated-asc"
      ? { updatedAt: "asc" as const }
      : sort === "published-desc"
        ? { publishedAt: "desc" as const }
        : sort === "published-asc"
          ? { publishedAt: "asc" as const }
          : { updatedAt: "desc" as const };

  const articles = await prisma.article.findMany({
    where,
    orderBy,
    select: {
      id: true,
      slug: true,
      status: true,
      featured: true,
      publishedAt: true,
      updatedAt: true,
      translations: { select: { locale: true, title: true } },
    },
  });

  const items: ArticleListItem[] = articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    status: article.status,
    featured: article.featured,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    title: pickDisplayTitle(article.translations, article.slug),
    languages: buildLanguageStatus(article.translations),
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
// Single Article — full detail for the edit form
// ---------------------------------------------------------------------------

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      translations: true,
      headerImage: true,
    },
  });
}

/** Resolved return type of `getArticleById`. */
export type ArticleDetail = Awaited<ReturnType<typeof getArticleById>>;

/**
 * Slug uniqueness check (section 14). `excludeId` lets an in-progress
 * edit keep its own slug without tripping over itself.
 */
export async function isArticleSlugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!existing) return false;
  return existing.id !== excludeId;
}
