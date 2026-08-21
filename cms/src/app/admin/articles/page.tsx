import ContentTable from "@/components/admin/ContentTable";
import { getArticlesList } from "@/lib/queries/content";

export const metadata = { title: "Articles" };

export default async function AdminArticlesPage() {
  const articles = await getArticlesList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Articles
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {articles.length} {articles.length === 1 ? "article" : "articles"} in
          the database.
        </p>
      </div>

      <ContentTable
        items={articles}
        editHrefBase="/admin/articles"
        emptyMessage="No articles yet."
      />
    </div>
  );
}
