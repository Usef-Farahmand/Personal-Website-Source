import { getTranslations } from "next-intl/server";
import { listExperience } from "@/services/content/experience.service";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { buildAlternates } from "@/lib/seo";
import type { EmploymentType, Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "experience",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, "/experience"),
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  // No limit — the dedicated page shows the complete collection. Same sort
  // order as the homepage preview, so the first items shown there appear
  // first here too.
  const entries = listExperience(locale);
  const [t, tEmploymentType] = await Promise.all([
    getTranslations({ locale, namespace: "experience" }),
    getTranslations({ locale, namespace: "employmentType" }),
  ]);

  const employmentTypeLabel = (type: EmploymentType) => tEmploymentType(type);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Breadcrumb locale={locale} />

      <header className="mb-10">
        <h1 className="text-h1 text-text-primary font-semibold">
          {t("title")}
        </h1>
        <p className="text-body text-text-secondary mt-2 max-w-xl">
          {t("intro")}
        </p>
      </header>

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
    </div>
  );
}
