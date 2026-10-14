import { getTranslations } from "next-intl/server";
import { listAchievements } from "@/services/content/achievements.service";
import { AchievementCard } from "@/components/ui/AchievementCard";
import { AchievementsGrid } from "@/components/sections/AchievementsGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/PageHeader";
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
    namespace: "achievements",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, "/achievements"),
  };
}

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const entries = listAchievements(locale);
  const [t, tCategory] = await Promise.all([
    getTranslations({ locale, namespace: "achievements" }),
    getTranslations({ locale, namespace: "achievementCategory" }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Breadcrumb locale={locale} />

      <PageHeader path="/achievements" title={t("title")} intro={t("intro")} />

      <AchievementsGrid>
        {entries.map((entry) => (
          <AchievementCard
            key={entry.id}
            achievement={entry}
            categoryLabel={tCategory(entry.category)}
            locale={locale}
          />
        ))}
      </AchievementsGrid>
    </div>
  );
}
