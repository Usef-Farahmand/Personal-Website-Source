import { SkillChip } from "@/components/ui/SkillChip";
import { SKILL_DOMAIN_ICON } from "@/components/ui/skillDomainIcon";
import type { ResolvedSkill, SkillDomain } from "@/types/content";

interface SkillCategoryCardProps {
  domain: SkillDomain;
  domainLabel: string;
  skills: ResolvedSkill[];
}

/**
 * One category's worth of skills, as a self-contained card — same visual
 * language as the site's other cards (border-border, bg-surface,
 * rounded-lg), not a bespoke treatment. Icon is optional per the
 * requirement ("Optional category icon"), but every domain in
 * SkillDomain has one authored in SKILL_DOMAIN_ICON today, so in
 * practice it always renders; the `Icon &&` guard just means a future
 * domain added without an icon degrades gracefully instead of crashing.
 */
export function SkillCategoryCard({
  domain,
  domainLabel,
  skills,
}: SkillCategoryCardProps) {
  const Icon = SKILL_DOMAIN_ICON[domain];

  return (
    <div
      data-animate
      className="border-border bg-surface flex flex-col gap-3 rounded-lg border p-5"
    >
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="bg-accent/10 text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <h3 className="text-body text-text-primary font-semibold">
          {domainLabel}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillChip key={skill.id} id={skill.id} name={skill.name} />
        ))}
      </div>
    </div>
  );
}
