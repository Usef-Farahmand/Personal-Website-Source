import Link from "next/link";
import { listMedia } from "@/lib/queries/projects";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const mediaOptions = await listMedia();

  return (
    <div className="space-y-4">
      <Link
        href="/admin/articles"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to Articles
      </Link>

      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        New Article
      </h1>

      <ArticleForm mode="create" mediaOptions={mediaOptions} />
    </div>
  );
}
