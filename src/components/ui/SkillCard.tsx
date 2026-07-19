import {
  Code2,
  Server,
  Smartphone,
  Gamepad2,
  Sparkles,
  Cloud,
  Terminal,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { SkillLevelIndicator } from "@/components/ui/SkillLevelIndicator";
import type { ResolvedSkill, SkillDomain } from "@/content/types";

interface SkillCardProps {
  skill: ResolvedSkill;
  domainLabel: string;
  levelLabel: string;
  yearsSuffix: string;
}

const DOMAIN_ICON: Record<SkillDomain, LucideIcon> = {
  frontend: Code2,
  backend: Server,
  mobile: Smartphone,
  game: Gamepad2,
  ai: Sparkles,
  cloud: Cloud,
  devops: Terminal,
  "ui-ux": Palette,
};

export function SkillCard({
  skill,
  domainLabel,
  levelLabel,
  yearsSuffix,
}: SkillCardProps) {
  const Icon = DOMAIN_ICON[skill.domain];

  return (
    <article
      data-animate
      className="group border-border bg-surface hover:border-accent/50 flex h-full flex-col gap-3 rounded-lg border p-6 transition-colors"
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

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <SkillLevelIndicator level={skill.experienceLevel} label={levelLabel} />
        {skill.yearsOfExperience && (
          <span className="text-caption text-text-secondary shrink-0">
            {skill.yearsOfExperience} {yearsSuffix}
          </span>
        )}
      </div>
    </article>
  );
}
