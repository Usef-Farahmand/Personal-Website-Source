import { getTranslations } from "next-intl/server";
import { listSkills } from "@/services/content/skills.service";
import { getProjectsByIds } from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import { SkillCard } from "@/components/ui/SkillCard";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
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
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.skills" });
  return buildPageMetadata({
    locale,
    path: "/skills",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
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
    readMore: tDetail("readMore"),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader path="/skills" title={t("title")} intro={t("intro")} />

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
