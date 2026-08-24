import Link from "next/link";
import { listArticles, type ArticleSort } from "@/lib/queries/articles";
import type { ContentStatus } from "@/lib/validation/shared";
import ArticlesToolbar from "@/components/admin/ArticlesToolbar";
import ArticlesTable from "@/components/admin/ArticlesTable";
import SuccessBanner from "@/components/admin/SuccessBanner";

export const metadata = { title: "Articles" };

const VALID_STATUSES: (ContentStatus | "ALL")[] = [
  "ALL",
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];
const VALID_SORTS: ArticleSort[] = [
  "updated-desc",
  "updated-asc",
  "published-desc",
  "published-asc",
  "title-asc",
  "title-desc",
];

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    success?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status = VALID_STATUSES.includes(params.status as ContentStatus)
    ? (params.status as ContentStatus | "ALL")
    : "ALL";
  const sort = VALID_SORTS.includes(params.sort as ArticleSort)
    ? (params.sort as ArticleSort)
    : "updated-desc";

  const articles = await listArticles({ search, status, sort });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Articles
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
            {search || status !== "ALL"
              ? " matching your filters"
              : " in the database"}
            .
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          + New Article
        </Link>
      </div>

      <SuccessBanner success={params.success} type="article" />

      <ArticlesToolbar search={search} status={status} sort={sort} />

      <ArticlesTable
        items={articles}
        emptyMessage={
          search || status !== "ALL"
            ? "No articles match your filters."
            : "No articles yet."
        }
      />
    </div>
  );
}
