import { getTranslations } from "next-intl/server";
import { listSkills } from "@/services/content/skills.service";
import { getProjectsByIds } from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import { SkillCard } from "@/components/ui/SkillCard";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { buildAlternates } from "@/lib/seo";
import type {
  Locale,
  SkillDomain,
  SkillExperienceLevel,
} from "@/types/content";

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
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, "/skills"),
  };
}

/**
 * Deep-link contract: /skills?skill=<id>, not /skills#<id>. A query param
 * is server-readable (this page can read `searchParams` directly, no
 * client JS required to know which skill was requested) and gives the
 * scroll/highlight interaction in SkillsGrid a single explicit trigger
 * value to react to. A hash anchor would let the browser's native jump
 * fight with the intentional smooth-scroll + focus + highlight sequence
 * SkillsGrid performs, and offers no equivalent server-side signal.
 */
export default async function SkillsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ skill?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const { skill: activeSkillId } = await searchParams;

  const allSkills = listSkills(locale);
  const [t, tDomain, tLevel, tDetail] = await Promise.all([
    getTranslations({ locale, namespace: "skills" }),
    getTranslations({ locale, namespace: "skillDomain" }),
    getTranslations({ locale, namespace: "skillExperienceLevel" }),
    getTranslations({ locale, namespace: "skillDetail" }),
  ]);

  const domainLabel = (domain: SkillDomain) => tDomain(domain);
  const levelLabel = (level: SkillExperienceLevel) => tLevel(level);
  const cardLabels = {
    technologies: tDetail("technologies"),
    relatedProjects: tDetail("relatedProjects"),
    relatedArticles: tDetail("relatedArticles"),
    externalLinks: tDetail("externalLinks"),
  };

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

      <SkillsGrid activeSkillId={activeSkillId}>
        {allSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            domainLabel={domainLabel(skill.domain)}
            levelLabel={levelLabel(skill.experienceLevel)}
            yearsSuffix={t("yearsSuffix")}
            relatedProjects={
              skill.relatedProjectIds
                ? getProjectsByIds(skill.relatedProjectIds, locale)
                : undefined
            }
            relatedArticles={
              skill.relatedArticleIds
                ? getArticlesByIds(skill.relatedArticleIds, locale)
                : undefined
            }
            labels={cardLabels}
          />
        ))}
      </SkillsGrid>
    </div>
  );
}
