import {
  Award,
  Trophy,
  BadgeCheck,
  FileText,
  Mic,
  GitBranch,
  Star,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { MediaTrigger } from "@/components/ui/MediaTrigger";
import { formatMonthYear } from "@/lib/date";
import type {
  AchievementCategory,
  Locale,
  ResolvedAchievement,
} from "@/types/content";

interface AchievementCardProps {
  achievement: ResolvedAchievement;
  categoryLabel: string;
  locale: Locale;
}

const CATEGORY_ICON: Record<AchievementCategory, LucideIcon> = {
  certificate: BadgeCheck,
  award: Award,
  competition: Trophy,
  publication: FileText,
  speaking: Mic,
  "open-source": GitBranch,
  recognition: Star,
};

// Shared card visual language, matching ProjectCard exactly — same
// border/surface/radius/padding/hover treatment, so Achievements reads as
// part of the same design system rather than a parallel one.
const CARD_CLASSES =
  "group border-border bg-surface flex h-full flex-col gap-3 rounded-lg border p-6 text-start transition-colors";
const CARD_CLASSES_INTERACTIVE = `${CARD_CLASSES} hover:border-accent/50`;

export function AchievementCard({
  achievement,
  categoryLabel,
  locale,
}: AchievementCardProps) {
  const Icon = CATEGORY_ICON[achievement.category];

  const cardContent = (
    <>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-h4 text-text-primary group-hover:text-accent font-semibold">
          {achievement.title}
        </h3>
        <span className="bg-accent/10 text-accent text-caption inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 font-medium">
          <Icon className="h-3 w-3" aria-hidden="true" />
          {categoryLabel}
        </span>
      </div>

      <p className="text-small text-text-secondary">
        {[achievement.organization, formatMonthYear(achievement.date, locale)]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <p className="text-small text-text-secondary">
        {achievement.description}
      </p>

      {achievement.relatedLink && (
        <a
          href={achievement.relatedLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small text-accent hover:text-accent-hover mt-auto inline-flex w-fit items-center gap-1 pt-2 font-medium transition-colors"
        >
          {achievement.relatedLink.label}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </>
  );

  if (achievement.media) {
    return (
      <MediaTrigger
        item={achievement.media}
        data-animate
        className={`${CARD_CLASSES_INTERACTIVE} w-full text-start`}
      >
        {cardContent}
      </MediaTrigger>
    );
  }

  return (
    <article data-animate className={CARD_CLASSES}>
      {cardContent}
    </article>
  );
}
