import { getTranslations } from "next-intl/server";
import { listSkills } from "@/lib/content";
import { SkillCard } from "@/components/ui/SkillCard";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type {
  Locale,
  SkillDomain,
  SkillExperienceLevel,
} from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "skills",
  });
  return { title: t("title") };
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const allSkills = listSkills(locale);
  const [t, tDomain, tLevel] = await Promise.all([
    getTranslations({ locale, namespace: "skills" }),
    getTranslations({ locale, namespace: "skillDomain" }),
    getTranslations({ locale, namespace: "skillExperienceLevel" }),
  ]);

  const domainLabel = (domain: SkillDomain) => tDomain(domain);
  const levelLabel = (level: SkillExperienceLevel) => tLevel(level);

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

      <SkillsGrid>
        {allSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            domainLabel={domainLabel(skill.domain)}
            levelLabel={levelLabel(skill.experienceLevel)}
            yearsSuffix={t("yearsSuffix")}
          />
        ))}
      </SkillsGrid>
    </div>
  );
}
