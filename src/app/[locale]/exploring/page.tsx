import { getTranslations } from "next-intl/server";
import { listExploring } from "@/services/content/exploring.service";
import { getArticleById } from "@/services/content/articles.service";
import { ExploringCard } from "@/components/ui/ExploringCard";
import { ExploringGrid } from "@/components/sections/ExploringGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "exploring",
  });
  return { title: t("title") };
}

export default async function ExploringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const allEntries = listExploring(locale);
  const t = await getTranslations({ locale, namespace: "exploring" });

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

      <ExploringGrid>
        {allEntries.map((entry) => {
          const relatedArticle = entry.relatedArticleId
            ? getArticleById(entry.relatedArticleId, locale)
            : null;
          return (
            <ExploringCard
              key={entry.id}
              entry={entry}
              relatedArticle={relatedArticle}
              relatedArticleLabel={
                relatedArticle
                  ? t("relatedArticle", { title: relatedArticle.title })
                  : ""
              }
            />
          );
        })}
      </ExploringGrid>
    </div>
  );
}
