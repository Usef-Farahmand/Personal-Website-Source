import { getTranslations } from "next-intl/server";
import { listLearning } from "@/services/content/learning.service";
import { Section } from "@/components/layout/Section";
import { LearningCard } from "@/components/ui/LearningCard";
import { LearningGrid } from "@/components/sections/LearningGrid";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/types/content";

// Homepage preview shows the 2 most recent entries (by date); the
// dedicated /learning page shows all of them.
const PREVIEW_LIMIT = 2;

export async function LearningPreview({ locale }: { locale: Locale }) {
  const recentEntries = listLearning(locale, { limit: PREVIEW_LIMIT });
  const t = await getTranslations({ locale, namespace: "learning" });

  if (recentEntries.length === 0) {
    return null;
  }

  return (
    <Section id="learning" as="section">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/learning" label={t("viewAll")} />
      </div>

      <LearningGrid>
        {recentEntries.map((entry) => (
          <LearningCard
            key={entry.id}
            entry={entry}
            locale={locale}
            codeLabel={t("hasCode")}
          />
        ))}
      </LearningGrid>
    </Section>
  );
}
