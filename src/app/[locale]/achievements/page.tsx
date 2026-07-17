import { getTranslations } from "next-intl/server";
import { listAchievements } from "@/lib/content";
import { AchievementCard } from "@/components/ui/AchievementCard";
import { AchievementsGrid } from "@/components/sections/AchievementsGrid";
import type { Locale } from "@/content/types";

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
  return { title: t("title") };
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
      <header className="mb-10">
        <h1 className="text-h1 text-text-primary font-semibold">
          {t("title")}
        </h1>
        <p className="text-body text-text-secondary mt-2 max-w-xl">
          {t("intro")}
        </p>
      </header>

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
