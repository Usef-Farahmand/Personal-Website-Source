import { getTranslations } from "next-intl/server";
import { listRecommendations } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { RecommendationCard } from "@/components/ui/RecommendationCard";
import { RecommendationsGrid } from "@/components/sections/RecommendationsGrid";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/content/types";

const PREVIEW_LIMIT = 2;

export async function Recommendations({ locale }: { locale: Locale }) {
  const previewRecommendations = listRecommendations(locale, {
    limit: PREVIEW_LIMIT,
  });
  const t = await getTranslations({ locale, namespace: "recommendations" });

  if (previewRecommendations.length === 0) {
    return null;
  }

  return (
    <Section id="recommendations" as="section">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/recommendations" label={t("viewAll")} />
      </div>

      <RecommendationsGrid>
        {previewRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}
      </RecommendationsGrid>
    </Section>
  );
}
