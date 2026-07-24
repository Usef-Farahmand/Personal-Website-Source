import { LinkedInIcon } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import type { ResolvedRecommendation } from "@/content/types";

interface RecommendationCardProps {
  recommendation: ResolvedRecommendation;
}

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const meta = [recommendation.authorPosition, recommendation.authorCompany]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      data-animate
      className="group border-border bg-surface hover:border-accent/50 flex h-full flex-col gap-4 rounded-lg border p-6 transition-colors"
    >
      <blockquote className="border-accent text-text-primary text-small border-s-2 ps-4 italic">
        {recommendation.quote}
      </blockquote>

      <div className="mt-auto flex items-center gap-3 pt-2">
        <Avatar
          src={recommendation.avatarUrl}
          name={recommendation.authorName}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-small text-text-primary truncate font-medium">
              {recommendation.authorName}
            </p>
            {recommendation.source === "linkedin" && (
              <LinkedInIcon
                className="text-text-secondary h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            )}
          </div>
          {meta && (
            <p className="text-caption text-text-secondary truncate">{meta}</p>
          )}
        </div>
      </div>
    </article>
  );
}
