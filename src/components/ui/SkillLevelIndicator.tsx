import type { SkillExperienceLevel } from "@/types/content";

interface SkillLevelIndicatorProps {
  level: SkillExperienceLevel;
  label: string;
}

const LEVEL_VALUE: Record<SkillExperienceLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

const TOTAL_DOTS = 4;

/**
 * Four dots, filled up to the skill's level. Deliberately not a
 * percentage bar or numeric score — a coarse, honest visual signal reads
 * better than false precision for a self-reported skill level, matching
 * the project's broader "honesty outperforms polish" content principle.
 * The label is always rendered alongside, not implied by the dots alone.
 */
export function SkillLevelIndicator({
  level,
  label,
}: SkillLevelIndicatorProps) {
  const filled = LEVEL_VALUE[level];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: TOTAL_DOTS }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < filled ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="text-caption text-text-secondary">{label}</span>
    </div>
  );
}
