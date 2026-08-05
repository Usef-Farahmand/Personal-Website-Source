import { getTranslations } from "next-intl/server";
import { listExperience } from "@/services/content/experience.service";
import { Section } from "@/components/layout/Section";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { EmploymentType, Locale } from "@/types/content";

// Homepage preview shows the two most recent entries; the dedicated
// /experience page (which calls listExperience with no limit) shows all,
// in the same order — both sort by the same `order` field, so the
// preview's items are always the natural first N of the full page.
const PREVIEW_LIMIT = 2;

export async function Experience({ locale }: { locale: Locale }) {
  const entries = listExperience(locale, { limit: PREVIEW_LIMIT });
  const [t, tEmploymentType] = await Promise.all([
    getTranslations({ locale, namespace: "experience" }),
    getTranslations({ locale, namespace: "employmentType" }),
  ]);

  const employmentTypeLabel = (type: EmploymentType) => tEmploymentType(type);

  return (
    <Section id="experience" as="section" containerSize="narrow">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/experience" label={t("viewAll")} />
      </div>

      <ExperienceTimeline>
        {entries.map((entry) => (
          <TimelineItem
            key={entry.id}
            experience={entry}
            employmentTypeLabel={employmentTypeLabel(entry.employmentType)}
            presentLabel={t("present")}
            locale={locale}
          />
        ))}
      </ExperienceTimeline>
    </Section>
  );
}
