import type { ArticleDetail } from "@/lib/queries/articles";
import { ARTICLE_SOURCE_PLATFORM_LABELS } from "@/lib/validation/article.schema";
import type { Locale } from "@/lib/validation/shared";
import MissingTranslationNotice from "./MissingTranslationNotice";
import { formatDateTime } from "@/lib/format-date";

/**
 * Task 07, section 9: an Article is metadata about an *external*
 * publication — the CMS never stores its body (see schema.prisma's
 * Article model comment), so there is nothing to "render or fabricate"
 * as full article content even if we wanted to. This shows the
 * metadata that will accompany the article card/link on the public
 * site, plus the source URL as a plain outbound link.
 */
export default function ArticlePreviewContent({
  article,
  locale,
  previewBasePath,
}: {
  article: NonNullable<ArticleDetail>;
  locale: Locale;
  previewBasePath: string;
}) {
  const translation = article.translations.find((t) => t.locale === locale);
  const availableLocales = article.translations.map((t) => t.locale);

  if (!translation) {
    return (
      <MissingTranslationNotice
        locale={locale}
        availableLocales={availableLocales}
        previewBasePath={previewBasePath}
      />
    );
  }

  const tags = (translation.tags as string[] | null) ?? [];

  return (
    <article dir={locale === "fa" ? "rtl" : "ltr"} className="space-y-6">
      {article.headerImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.headerImage.source}
          alt=""
          className="aspect-video w-full rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
        />
      ) : null}

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {translation.title}
          </h1>
          {article.featured ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Featured
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          {translation.summary}
        </p>
      </header>

      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-neutral-500 dark:text-neutral-400">Category</dt>
          <dd className="text-neutral-800 dark:text-neutral-200">
            {translation.category}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-500 dark:text-neutral-400">
            Source platform
          </dt>
          <dd className="text-neutral-800 dark:text-neutral-200">
            {ARTICLE_SOURCE_PLATFORM_LABELS[article.sourcePlatform]}
          </dd>
        </div>
        {article.publishedAt ? (
          <div>
            <dt className="text-neutral-500 dark:text-neutral-400">
              Publication date
            </dt>
            <dd className="text-neutral-800 dark:text-neutral-200">
              {formatDateTime(article.publishedAt)}
            </dd>
          </div>
        ) : null}
        {article.readingTimeMinutes ? (
          <div>
            <dt className="text-neutral-500 dark:text-neutral-400">
              Reading time
            </dt>
            <dd className="text-neutral-800 dark:text-neutral-200">
              {article.readingTimeMinutes} min
            </dd>
          </div>
        ) : null}
      </dl>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/60">
        <p className="text-neutral-600 dark:text-neutral-400">
          This article is external content — its full text isn&apos;t stored in
          the CMS.
        </p>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 inline-block font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Read it at the source →
        </a>
      </div>
    </article>
  );
}
