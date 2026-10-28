import { getTranslations } from "next-intl/server";
import { listSkills } from "@/services/content/skills.service";
import { getProjectsByIds } from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import {
  articleIdsForSkill,
  projectIdsForSkill,
} from "@/services/content/relations.service";
import { SkillCard } from "@/components/ui/SkillCard";
import { SkillDeepLink } from "@/components/sections/SkillDeepLink";
import { FilterableListSection } from "@/components/sections/FilterableListSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { deriveFacetOptions } from "@/lib/listFilters";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import type { ListToolbarItem } from "@/components/sections/ListToolbar";
import type { FilterFacet } from "@/components/ui/FilterPanel";
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

type SkillSort = "featured" | "nameAsc" | "years" | "level";

const FACET_KEYS = ["domain", "level"] as const;

const LEVEL_RANK: Record<SkillExperienceLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

/**
 * Deep-link contract: /skills?skill=<id>, not /skills#<id>. A query param
 * is server-readable and gives SkillDeepLink a single explicit trigger
 * for its scroll + focus + highlight sequence; a hash anchor would let
 * the browser's native jump fight with it.
 *
 * One skill per wide row, with the same search / filter / sort toolbar as
 * Projects and Articles. Related projects and articles come from
 * relations.service, so they match what project pages link back to.
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

  const allSkills = listSkills(locale).map((skill) => ({
    skill,
    projects: getProjectsByIds(projectIdsForSkill(skill), locale),
    articles: getArticlesByIds(articleIdsForSkill(skill), locale),
  }));
  const [t, tDomain, tLevel, tDetail, tToolbar] = await Promise.all([
    getTranslations({ locale, namespace: "skills" }),
    getTranslations({ locale, namespace: "skillDomain" }),
    getTranslations({ locale, namespace: "skillExperienceLevel" }),
    getTranslations({ locale, namespace: "skillDetail" }),
    getTranslations({ locale, namespace: "listToolbar" }),
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

  const facets: FilterFacet[] = [
    {
      key: "domain",
      label: t("filters.domain"),
      options: deriveFacetOptions(
        allSkills.map(({ skill }) => skill),
        (s) => s.domain
      ).map((value) => ({
        value,
        label: domainLabel(value as SkillDomain),
      })),
    },
    {
      key: "level",
      label: t("filters.level"),
      options: (Object.keys(LEVEL_RANK) as SkillExperienceLevel[])
        .reverse()
        .filter((level) =>
          allSkills.some(({ skill }) => skill.experienceLevel === level)
        )
        .map((value) => ({ value, label: levelLabel(value) })),
    },
  ];

  const items: ListToolbarItem[] = allSkills.map(
    ({ skill, projects, articles }) => ({
      key: skill.id,
      searchable: [
        skill.name,
        skill.description,
        domainLabel(skill.domain),
        ...(skill.technologies ?? []),
        ...projects.map((p) => p.title),
        ...articles.map((a) => a.title),
      ],
      facetValues: {
        domain: [skill.domain],
        level: [skill.experienceLevel],
      },
      sortValues: {
        featured: skill.order,
        nameAsc: skill.name,
        years: skill.yearsOfExperience ?? 0,
        level:
          LEVEL_RANK[skill.experienceLevel] * 100 +
          (skill.yearsOfExperience ?? 0),
      },
    })
  );

  const sortOptions = [
    { value: "featured", label: t("sort.featured") },
    { value: "nameAsc", label: t("sort.nameAsc") },
    { value: "years", label: t("sort.years") },
    { value: "level", label: t("sort.level") },
  ];

  const facetLabels: Record<string, string> = {};
  for (const facet of facets) {
    for (const option of facet.options) {
      facetLabels[`${facet.key}:${option.value}`] = option.label;
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader path="/skills" title={t("title")} intro={t("intro")} />

      <SkillDeepLink activeSkillId={activeSkillId} />

      <FilterableListSection<SkillSort>
        items={items}
        facets={facets}
        facetKeys={FACET_KEYS}
        sortOptions={sortOptions}
        defaultSort="featured"
        descendingSortKeys={["years", "level"]}
        resultCountNamespace="skills"
        facetLabels={facetLabels}
        gridClassName="sm:grid-cols-1 sm:auto-rows-auto"
        labels={{
          searchLabel: t("searchLabel"),
          searchPlaceholder: t("searchPlaceholder"),
          sortLabel: t("sortLabel"),
          filtersLabel: tToolbar("filtersLabel"),
          openFilters: tToolbar("openFilters"),
          closeFilters: tToolbar("closeFilters"),
          clearSearch: tToolbar("clearSearch"),
          clearAll: tToolbar("clearAll"),
          applyFilters: tToolbar("applyFilters"),
          emptyTitle: t("emptyTitle"),
          emptyAction: t("emptyAction"),
        }}
      >
        {allSkills.map(({ skill, projects, articles }) => (
          <div key={skill.id} data-list-key={skill.id}>
            <SkillCard
              skill={skill}
              domainLabel={domainLabel(skill.domain)}
              levelLabel={levelLabel(skill.experienceLevel)}
              yearsSuffix={t("yearsSuffix")}
              relatedProjects={projects}
              relatedArticles={articles}
              labels={cardLabels}
            />
          </div>
        ))}
      </FilterableListSection>
    </div>
  );
}
