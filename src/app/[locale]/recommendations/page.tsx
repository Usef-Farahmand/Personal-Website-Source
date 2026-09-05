import { getTranslations } from "next-intl/server";
import { listRecommendations } from "@/services/content/recommendations.service";
import { RecommendationCard } from "@/components/ui/RecommendationCard";
import { RecommendationsGrid } from "@/components/sections/RecommendationsGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "recommendations",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, "/recommendations"),
  };
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
      <Breadcrumb locale={locale} />

      <header className="mb-10">
        <h1 className="text-h1 text-text-primary font-semibold">
          {t("title")}
        </h1>
        <p className="text-body text-text-secondary mt-2 max-w-xl">
          {t("intro")}
        </p>
      </header>

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
