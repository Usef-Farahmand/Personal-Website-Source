import Image from "next/image";
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
import { formatMonthYear } from "@/lib/date";
import type {
  AchievementCategory,
  Locale,
  ResolvedAchievement,
} from "@/content/types";

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

export function AchievementCard({
  achievement,
  categoryLabel,
  locale,
}: AchievementCardProps) {
  const Icon = CATEGORY_ICON[achievement.category];

  return (
    <article
      data-animate
      className="border-border bg-surface flex h-full flex-col gap-3 rounded-lg border p-6"
    >
      <div className="flex items-center gap-3">
        {achievement.badgeImageUrl ? (
          <Image
            src={achievement.badgeImageUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-md object-contain"
          />
        ) : (
          <span className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <span className="text-caption text-text-secondary font-medium tracking-wide uppercase">
          {categoryLabel}
        </span>
      </div>

      <h3 className="text-h4 text-text-primary font-semibold">
        {achievement.title}
      </h3>

      <p className="text-small text-text-secondary">
        {[achievement.organization, formatMonthYear(achievement.date, locale)]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <p className="text-body text-text-secondary">{achievement.description}</p>

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
    </article>
  );
}
