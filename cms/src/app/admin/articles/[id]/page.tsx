import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/queries/articles";
import { listMedia } from "@/lib/queries/projects";
import ArticleForm from "@/components/admin/ArticleForm";
import SuccessBanner from "@/components/admin/SuccessBanner";

export default async function AdminArticleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;

  const [article, mediaOptions] = await Promise.all([
    getArticleById(id),
    listMedia(),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-4">
      <Link
        href="/admin/articles"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to Articles
      </Link>

      <SuccessBanner success={success} type="article" />

      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit Article
      </h1>

      <ArticleForm mode="edit" article={article} mediaOptions={mediaOptions} />
    </div>
  );
}
