import { getTranslations } from "next-intl/server";
import { listArticles } from "@/lib/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { ArticlesGrid } from "@/components/sections/ArticlesGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Locale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "articles",
  });
  return { title: t("title") };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const allArticles = listArticles(locale);
  const [t, tPlatform] = await Promise.all([
    getTranslations({ locale, namespace: "articles" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Breadcrumb locale={locale} />

      <header className="mb-10">
        <h1 className="text-h1 text-text-primary font-semibold">
          {t("title")}
        </h1>
        <p className="text-body text-text-secondary mt-2 max-w-xl">
          {t("intro")}
        </p>
      </header>

      <ArticlesGrid>
        {allArticles.map((article) => {
          const platformLabel = tPlatform(article.sourcePlatform);
          return (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale}
              platformLabel={platformLabel}
              readMoreLabel={t("readMore", { platform: platformLabel })}
              readingTimeLabel={t("readingTime", {
                minutes: article.readingTimeMinutes,
              })}
            />
          );
        })}
      </ArticlesGrid>
    </div>
  );
}
