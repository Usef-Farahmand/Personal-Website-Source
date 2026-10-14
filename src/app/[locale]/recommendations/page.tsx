import { getTranslations } from "next-intl/server";
import { listRecommendations } from "@/services/content/recommendations.service";
import { RecommendationCard } from "@/components/ui/RecommendationCard";
import { RecommendationsGrid } from "@/components/sections/RecommendationsGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.recommendations" });
  return buildPageMetadata({
    locale,
    path: "/recommendations",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
}

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const allRecommendations = listRecommendations(locale);
  const t = await getTranslations({ locale, namespace: "recommendations" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        path="/recommendations"
        title={t("title")}
        intro={t("intro")}
      />

      <RecommendationsGrid>
        {allRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            locale={locale}
            labels={{
              readMore: t("readMore"),
              linkedinProfile: t("linkedinProfile"),
              personalWebsite: t("personalWebsite"),
              opensInNewTab: t("opensInNewTab"),
            }}
          />
        ))}
      </RecommendationsGrid>
    </div>
  );
}
