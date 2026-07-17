import { getTranslations } from "next-intl/server";
import { listAchievements } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { AchievementCard } from "@/components/ui/AchievementCard";
import { AchievementsGrid } from "@/components/sections/AchievementsGrid";
import type { Locale } from "@/content/types";

export async function Achievements({ locale }: { locale: Locale }) {
  const entries = listAchievements(locale);
  const [t, tCategory] = await Promise.all([
    getTranslations({ locale, namespace: "achievements" }),
    getTranslations({ locale, namespace: "achievementCategory" }),
  ]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Section id="achievements" as="section" background="surface">
      <h2 className="text-h2 text-text-primary mb-10 font-semibold">
        {t("title")}
      </h2>

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
    </Section>
  );
}
