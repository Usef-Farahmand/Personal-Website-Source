import { getTranslations } from "next-intl/server";
import { listAchievements } from "@/services/content/achievements.service";
import { Section } from "@/components/layout/Section";
import { AchievementCard } from "@/components/ui/AchievementCard";
import { AchievementsGrid } from "@/components/sections/AchievementsGrid";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/types/content";

// Homepage preview shows the three most recent entries; the dedicated
// /achievements page (listAchievements with no limit) shows all, same
// order, so the preview is always the natural first N of the full page.
const PREVIEW_LIMIT = 2;

export async function Achievements({ locale }: { locale: Locale }) {
  const entries = listAchievements(locale, { limit: PREVIEW_LIMIT });
  const [t, tCategory] = await Promise.all([
    getTranslations({ locale, namespace: "achievements" }),
    getTranslations({ locale, namespace: "achievementCategory" }),
  ]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Section id="achievements" as="section" background="surface">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/achievements" label={t("viewAll")} />
      </div>

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
