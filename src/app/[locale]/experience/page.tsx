import { getTranslations } from "next-intl/server";
import { listExperience } from "@/services/content/experience.service";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { PageHeader } from "@/components/ui/PageHeader";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import type { EmploymentType, Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.experience" });
  return buildPageMetadata({
    locale,
    path: "/experience",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader path="/experience" title={t("title")} intro={t("intro")} />

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
