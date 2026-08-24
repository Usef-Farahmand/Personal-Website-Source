import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/queries/articles";
import PreviewChrome from "@/components/admin/preview/PreviewChrome";
import ArticlePreviewContent from "@/components/admin/preview/ArticlePreviewContent";
import type { Locale } from "@/lib/validation/shared";

/** Task 07, sections 3-5 & 21: see the Project preview route's comment —
 *  same architecture, applied to Article. */
export default async function ArticlePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string }>;
}) {
  const { id } = await params;
  const { locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "fa" ? "fa" : "en";

  const article = await getArticleById(id);
  if (!article) notFound();

  const previewBasePath = `/admin/articles/${id}/preview`;

  return (
    <PreviewChrome
      status={article.status}
      editHref={`/admin/articles/${id}`}
      previewBasePath={previewBasePath}
      locale={locale}
    >
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <ArticlePreviewContent
          article={article}
          locale={locale}
          previewBasePath={previewBasePath}
        />
      </div>
    </PreviewChrome>
  );
}
