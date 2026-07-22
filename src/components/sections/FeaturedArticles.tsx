import { getTranslations } from "next-intl/server";
import { listArticles } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { ArticlesGrid } from "@/components/sections/ArticlesGrid";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/content/types";

// Homepage preview shows the 2 most recent articles. Positional slicing,
// not the (deliberately unwired) featured flag — see the comment on
// Article.featured in content/types.ts for why.
const PREVIEW_LIMIT = 2;

export async function FeaturedArticles({ locale }: { locale: Locale }) {
  const recentArticles = listArticles(locale, { limit: PREVIEW_LIMIT });
  const [t, tPlatform] = await Promise.all([
    getTranslations({ locale, namespace: "articles" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
  ]);

  if (recentArticles.length === 0) {
    return null;
  }

  return (
    <Section id="articles" as="section" background="surface">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/articles" label={t("viewAll")} />
      </div>

      <ArticlesGrid>
        {recentArticles.map((article) => {
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
    </Section>
  );
}
