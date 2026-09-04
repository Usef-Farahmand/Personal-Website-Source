import { articles } from "@/content/articles";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedArticle } from "@/types/content";

export function listArticles(
  locale: Locale,
  options?: ListOptions
): ResolvedArticle[] {
  const all = [...articles]
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .map((article) => resolveTranslation(article, locale) as ResolvedArticle);
  return options?.limit ? all.slice(0, options.limit) : all;
}

/** Looks up a single article for the "occasional link to a related Article"
 *  Exploring relationship (CONTENT_STRATEGY.md §15) — articles link out to
 *  an external platform rather than an internal detail page, so callers
 *  render this against `sourceUrl`, not an internal route. */
export function getArticleById(
  id: string,
  locale: Locale
): ResolvedArticle | null {
  const article = articles.find((a) => a.id === id);
  return article
    ? (resolveTranslation(article, locale) as ResolvedArticle)
    : null;
}

/** Plural counterpart to getArticleById, for Project.relatedArticleIds —
 *  same order-preserving, dangling-id-tolerant behavior as
 *  getProjectsByIds in projects.service.ts. */
export function getArticlesByIds(
  ids: string[],
  locale: Locale
): ResolvedArticle[] {
  return ids
    .map((id) => articles.find((a) => a.id === id))
    .filter((a): a is (typeof articles)[number] => Boolean(a))
    .map((article) => resolveTranslation(article, locale) as ResolvedArticle);
}
