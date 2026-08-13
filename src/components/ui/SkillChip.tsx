import { Link } from "@/i18n/navigation";
import { TechIcon } from "@/components/ui/TechIcon";
import type { TechIconSlug } from "@/lib/techIconPaths";

/**
 * Skill -> brand-icon mapping. Deliberately explicit and manually
 * authored per skill id, not derived from the skill's name string —
 * name-matching is fragile, and TECH_ICON_PATHS only has marks for a
 * handful of technologies. Skills with no entry here fall back to
 * text-only, which is the explicitly required behavior, not a bug —
 * e.g. skill-technical-art and skill-game-sdks exercise this path today
 * because no single accurate official mark exists for either.
 */
const SKILL_TECH_ICON: Partial<Record<string, TechIconSlug>> = {
  "skill-unity-csharp": "unity",
  "skill-git": "git",
  "skill-figma": "figma",
  "skill-typescript-nextjs": "nextdotjs",
};

/**
 * Deliberately minimal — name (+ optional brand icon) only, no level or
 * description. The homepage's job is breadth at a glance; depth lives on
 * the Skills page (SkillCard). Links to `/skills?skill=<id>` rather than
 * `#<id>` — see the Skills page for why the query-param approach was
 * chosen over a hash anchor.
 */
export function SkillChip({ id, name }: { id: string; name: string }) {
  const iconSlug = SKILL_TECH_ICON[id];

  return (
    <Link
      href={`/skills?skill=${id}`}
      className="border-border bg-surface text-small text-text-secondary hover:border-accent/50 hover:text-text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors"
    >
      {iconSlug && <TechIcon slug={iconSlug} className="h-3.5 w-3.5" />}
      {name}
    </Link>
  );
}
