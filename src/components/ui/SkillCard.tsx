import { SkillLevelIndicator } from "@/components/ui/SkillLevelIndicator";
import { SkillLinksSection } from "@/components/ui/SkillLinksSection";
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

/**
 * The Skills page's complete reference card. `id`/`data-skill-id` on the
 * root, plus `tabIndex={-1}`, exist for the homepage-chip -> Skills-page
 * deep-link interaction (see SkillsGrid): not part of the normal tab
 * order, but a valid focus target once the page's deep-link handler
 * calls `.focus()` on it after scrolling it into view.
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

  return (
    <article
      id={skill.id}
      data-skill-id={skill.id}
      data-animate
      tabIndex={-1}
      className="group border-border bg-surface hover:border-accent/50 focus-visible:ring-accent flex flex-col gap-3 rounded-lg border p-6 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <div className="flex items-center gap-3">
        <span className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-h4 text-text-primary truncate font-semibold">
            {skill.name}
          </h3>
          <p className="text-caption text-text-secondary">{domainLabel}</p>
        </div>
      </div>

      <p className="text-small text-text-secondary">{skill.description}</p>

      <div className="flex items-center justify-between gap-2">
        <SkillLevelIndicator level={skill.experienceLevel} label={levelLabel} />
        {skill.yearsOfExperience && (
          <span className="text-caption text-text-secondary shrink-0">
            {skill.yearsOfExperience} {yearsSuffix}
          </span>
        )}
      </div>

      {skill.technologies && skill.technologies.length > 0 && (
        <div>
          <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
            {labels.technologies}
          </h4>
          <ul className="flex flex-wrap gap-1.5">
            {skill.technologies.map((tech) => (
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

      <SkillLinksSection
        skillName={skill.name}
        skillDescription={skill.description}
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
    </article>
  );
}
