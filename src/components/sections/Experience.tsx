import { getTranslations } from "next-intl/server";
import { listExperience } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import type { EmploymentType, Locale } from "@/content/types";

export async function Experience({ locale }: { locale: Locale }) {
  const entries = listExperience(locale);
  const [t, tEmploymentType] = await Promise.all([
    getTranslations({ locale, namespace: "experience" }),
    getTranslations({ locale, namespace: "employmentType" }),
  ]);

  const employmentTypeLabel = (type: EmploymentType) => tEmploymentType(type);

  return (
    <Section id="experience" as="section" containerSize="narrow">
      <h2 className="text-h2 text-text-primary mb-10 font-semibold">
        {t("title")}
      </h2>

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
