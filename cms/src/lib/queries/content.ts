import { prisma } from "@/lib/db";
import type { ContentStatus } from "@/lib/validation/shared";
import {
  buildLanguageStatus,
  pickDisplayTitle,
  type LanguageStatusEntry,
} from "./shared";

export type ContentListItem = {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  updatedAt: Date;
  languages: LanguageStatusEntry[];
};

/**
 * Full Project list for /admin/projects. Read-only: this query backs a
 * listing/navigation screen only, not an editing surface (Task 03
 * explicitly excludes CRUD) — `select` intentionally omits every field
 * that isn't shown in the table (technologies, URLs, gallery, ...) so
 * this stays a lightweight overview query rather than growing into an
 * implicit "get everything" for a future edit form.
 */
export async function getProjectsList(): Promise<ContentListItem[]> {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      status: true,
      updatedAt: true,
      translations: { select: { locale: true, title: true } },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    status: project.status,
    updatedAt: project.updatedAt,
    title: pickDisplayTitle(project.translations, project.slug),
    languages: buildLanguageStatus(project.translations),
  }));
}

/** Full Article list for /admin/articles — same shape and reasoning as
 *  `getProjectsList` above. */
export async function getArticlesList(): Promise<ContentListItem[]> {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      status: true,
      updatedAt: true,
      translations: { select: { locale: true, title: true } },
    },
  });

  return articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    status: article.status,
    updatedAt: article.updatedAt,
    title: pickDisplayTitle(article.translations, article.slug),
    languages: buildLanguageStatus(article.translations),
  }));
}
