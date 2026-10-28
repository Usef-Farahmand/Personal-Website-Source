import { SkillLevelIndicator } from "@/components/ui/SkillLevelIndicator";
import {
  ArticleLinksList,
  ProjectLinksList,
  SkillLinksSection,
} from "@/components/ui/SkillLinksSection";
import { SkillDetailDialog } from "@/components/ui/SkillDetailDialog";
import { ExternalLinksList } from "@/components/ui/ExternalLinksList";
import { SKILL_DOMAIN_ICON } from "@/components/ui/skillDomainIcon";
import type {
  ResolvedArticle,
  ResolvedProject,
  ResolvedSkill,
} from "@/types/content";

interface SkillCardProps {
  skill: ResolvedSkill;
  domainLabel: string;
  levelLabel: string;
  yearsSuffix: string;
  relatedProjects?: ResolvedProject[];
  relatedArticles?: ResolvedArticle[];
  labels: {
    technologies: string;
    relatedProjects: string;
    relatedArticles: string;
    externalLinks: string;
    readMore: string;
  };
}

/** Tool chips shown per card; the rest collapse into "+N". */
const MAX_TECHS = 6;

/**
 * The Skills page's complete reference card. `id`/`data-skill-id` on the
 * root, plus `tabIndex={-1}`, exist for the homepage-chip -> Skills-page
 * deep-link interaction (see SkillsGrid): not part of the normal tab
 * order, but a valid focus target once the page's deep-link handler
 * calls `.focus()` on it after scrolling it into view.
 *
 * Clicking anywhere on the card opens SkillDetailDialog with everything
 * about the skill: full description, every tool, and every related
 * project, article and link (the card itself shows a capped selection).
 */
export function SkillCard({
  skill,
  domainLabel,
  levelLabel,
  yearsSuffix,
  relatedProjects = [],
  relatedArticles = [],
  labels,
}: SkillCardProps) {
  const Icon = SKILL_DOMAIN_ICON[skill.domain];

  const hasLinks =
    relatedProjects.length +
      relatedArticles.length +
      (skill.externalLinks?.length ?? 0) >
    0;
  const visibleTechs = skill.technologies?.slice(0, MAX_TECHS) ?? [];
  const hiddenTechCount =
    (skill.technologies?.length ?? 0) - visibleTechs.length;

  const levelRow = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <SkillLevelIndicator level={skill.experienceLevel} label={levelLabel} />
      {skill.yearsOfExperience && (
        <span className="text-caption text-text-secondary">
          {skill.yearsOfExperience} {yearsSuffix}
        </span>
      )}
    </div>
  );

  const detail = (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 pe-8">
        <span className="bg-accent/10 text-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-md">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-h4 text-text-primary font-semibold">
            {skill.name}
          </p>
          <p className="text-caption text-text-secondary">{domainLabel}</p>
        </div>
      </div>
      {levelRow}
      <p className="text-small text-text-secondary">{skill.description}</p>
      {(skill.technologies?.length ?? 0) > 0 && (
        <div>
          <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
            {labels.technologies}
          </h4>
          <ul className="flex flex-wrap gap-1.5">
            {skill.technologies?.map((tech) => (
              <li
                key={tech}
                className="bg-background text-caption text-text-secondary rounded px-2 py-0.5"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      )}
      {relatedProjects.length > 0 && (
        <div>
          <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
            {labels.relatedProjects}
          </h4>
          <ProjectLinksList projects={relatedProjects} />
        </div>
      )}
      {relatedArticles.length > 0 && (
        <div>
          <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
            {labels.relatedArticles}
          </h4>
          <ArticleLinksList articles={relatedArticles} />
        </div>
      )}
      {(skill.externalLinks?.length ?? 0) > 0 && (
        <div>
          <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
            {labels.externalLinks}
          </h4>
          <ExternalLinksList links={skill.externalLinks ?? []} />
        </div>
      )}
    </div>
  );

  // One wide row: identity (icon, name, area, level) | what it is
  // (description, tools) | where it shows up (projects, articles, links).
  // Stacks into a single column on phones.
  return (
    <article
      id={skill.id}
      data-skill-id={skill.id}
      data-animate
      tabIndex={-1}
      className="group border-border bg-surface hover:border-accent/50 focus-visible:ring-accent card-lift relative grid h-full gap-4 rounded-lg border p-5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[14rem_minmax(0,1fr)_15rem]"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-h4 text-text-primary group-hover:text-accent font-semibold transition-colors">
              <SkillDetailDialog
                title={skill.name}
                triggerLabel={`${skill.name} — ${labels.readMore}`}
                detail={detail}
              >
                {skill.name}
              </SkillDetailDialog>
            </h3>
            <p className="text-caption text-text-secondary">{domainLabel}</p>
          </div>
        </div>
        {levelRow}
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-small text-text-secondary">{skill.description}</p>
        {visibleTechs.length > 0 && (
          <ul
            aria-label={labels.technologies}
            className="flex flex-wrap gap-1.5"
          >
            {visibleTechs.map((tech) => (
              <li
                key={tech}
                className="bg-background text-caption text-text-secondary rounded px-2 py-0.5"
              >
                {tech}
              </li>
            ))}
            {hiddenTechCount > 0 && (
              <li className="bg-background text-caption text-text-secondary rounded px-2 py-0.5">
                +{hiddenTechCount}
              </li>
            )}
          </ul>
        )}
      </div>

      {hasLinks && (
        <div className="border-border min-w-0 border-t pt-3 sm:col-span-2 lg:col-span-1 lg:border-s lg:border-t-0 lg:ps-5 lg:pt-0">
          <SkillLinksSection
            relatedProjects={relatedProjects}
            relatedArticles={relatedArticles}
            externalLinks={skill.externalLinks ?? []}
            labels={{
              relatedProjects: labels.relatedProjects,
              relatedArticles: labels.relatedArticles,
              externalLinks: labels.externalLinks,
              readMore: labels.readMore,
            }}
          />
        </div>
      )}
    </article>
  );
}
