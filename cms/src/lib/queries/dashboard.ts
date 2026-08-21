import { prisma } from "@/lib/db";
import type { ContentStatus } from "@/lib/validation/shared";
import {
  buildLanguageStatus,
  pickDisplayTitle,
  type LanguageStatusEntry,
} from "./shared";

export type DashboardStats = {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
};

/**
 * Dashboard overview counts (section 5 of the Task 03 spec). Six
 * `count()` calls rather than one grouped query — SQLite/Prisma has no
 * single call that returns per-model, per-status counts together, and
 * six trivial indexed counts (see `@@index([status])` on both models)
 * running in parallel is simpler and just as fast as post-processing a
 * `groupBy`.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalArticles,
    publishedArticles,
    draftArticles,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
  ]);

  return {
    totalProjects,
    publishedProjects,
    draftProjects,
    totalArticles,
    publishedArticles,
    draftArticles,
  };
}

export type RecentContentItem = {
  id: string;
  type: "project" | "article";
  title: string;
  status: ContentStatus;
  updatedAt: Date;
  languages: LanguageStatusEntry[];
  editHref: string;
};

/**
 * Recently updated Projects and Articles, merged into one
 * reverse-chronological list (section 6). Each model is queried for
 * `limit` rows independently — translations are included in the same
 * round trip so title/language columns don't need a second query — and
 * then interleaved in memory. With only two content types and a small
 * `limit` this is simpler than a hand-written SQL UNION and keeps the
 * query inside Prisma's typed API.
 */
export async function getRecentContent(
  limit = 5
): Promise<RecentContentItem[]> {
  const [projects, articles] = await Promise.all([
    prisma.project.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        status: true,
        updatedAt: true,
        translations: { select: { locale: true, title: true } },
      },
    }),
    prisma.article.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        status: true,
        updatedAt: true,
        translations: { select: { locale: true, title: true } },
      },
    }),
  ]);

  const items: RecentContentItem[] = [
    ...projects.map((project) => ({
      id: project.id,
      type: "project" as const,
      title: pickDisplayTitle(project.translations, project.slug),
      status: project.status,
      updatedAt: project.updatedAt,
      languages: buildLanguageStatus(project.translations),
      editHref: `/admin/projects/${project.id}`,
    })),
    ...articles.map((article) => ({
      id: article.id,
      type: "article" as const,
      title: pickDisplayTitle(article.translations, article.slug),
      status: article.status,
      updatedAt: article.updatedAt,
      languages: buildLanguageStatus(article.translations),
      editHref: `/admin/articles/${article.id}`,
    })),
  ];

  return items
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}
