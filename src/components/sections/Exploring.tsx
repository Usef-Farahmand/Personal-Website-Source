import { getTranslations } from "next-intl/server";
import { listExploring } from "@/services/content/exploring.service";
import { getArticleById } from "@/services/content/articles.service";
import { Section } from "@/components/layout/Section";
import { ExploringCard } from "@/components/ui/ExploringCard";
import { ExploringGrid } from "@/components/sections/ExploringGrid";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/types/content";

const PREVIEW_LIMIT = 2;

export async function Exploring({ locale }: { locale: Locale }) {
  const previewEntries = listExploring(locale, { limit: PREVIEW_LIMIT });
  const t = await getTranslations({ locale, namespace: "exploring" });

  if (previewEntries.length === 0) {
    return null;
  }

  return (
    <Section id="exploring" as="section">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/exploring" label={t("viewAll")} />
      </div>

      <ExploringGrid>
        {previewEntries.map((entry) => {
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
    </Section>
  );
}
