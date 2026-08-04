"use client";

import { LinkedInIcon } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { RecommendationModal } from "@/components/ui/RecommendationModal";
import { useModal } from "@/hooks/useModal";
import { truncateAtWordBoundary } from "@/lib/text";
import type { Locale, ResolvedRecommendation } from "@/content/types";

interface RecommendationCardProps {
  recommendation: ResolvedRecommendation;
  locale: Locale;
  labels: {
    readMore: string;
    linkedinProfile: string;
    personalWebsite: string;
    opensInNewTab: string;
  };
}

/** ~2-3 lines at typical card width — enough to convey the recommendation's
 *  substance without turning every card into a wall of text. Character-based
 *  rather than line-clamp CSS because the truncation needs to know *whether*
 *  it happened (to decide if "Read More" renders at all), which a purely
 *  visual line-clamp can't tell you. */
const PREVIEW_CHAR_LIMIT = 220;

export function RecommendationCard({
  recommendation,
  locale,
  labels,
}: RecommendationCardProps) {
  const modal = useModal();
  const meta = [recommendation.jobTitle, recommendation.company]
    .filter(Boolean)
    .join(" · ");

  const { text: previewText, wasTruncated } = truncateAtWordBoundary(
    recommendation.recommendation,
    PREVIEW_CHAR_LIMIT
  );

  return (
    <>
      <article
        data-animate
        className="group border-border bg-surface hover:border-accent/50 flex h-full flex-col gap-4 rounded-lg border p-6 transition-colors"
      >
        <blockquote className="border-accent text-text-primary text-small border-s-2 ps-4 italic">
          {previewText}
        </blockquote>

        {wasTruncated && (
          <button
            type="button"
            onClick={modal.open}
            className="text-small text-accent -mt-2 self-start font-medium hover:underline"
          >
            {labels.readMore}
          </button>
        )}

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Avatar src={recommendation.avatar} name={recommendation.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-small text-text-primary truncate font-medium">
                {recommendation.name}
              </p>
              {/* This was previously just a decorative, aria-hidden icon
                  with no href — it looked clickable but did nothing.
                  Now a real link to the person's LinkedIn profile,
                  stopping propagation so it doesn't also trigger
                  anything the card itself might do. */}
              {recommendation.linkedin && (
                <a
                  href={recommendation.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`${recommendation.name} ${labels.linkedinProfile} ${labels.opensInNewTab}`}
                  className="text-text-secondary hover:text-accent shrink-0 transition-colors"
                >
                  <LinkedInIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
            {meta && (
              <p className="text-caption text-text-secondary truncate">
                {meta}
              </p>
            )}
          </div>
        </div>
      </article>

      {/* Always in the tree (matching MediaViewer/ProjectGallery's
          established pattern) — Radix Dialog itself doesn't render the
          portal content until `isOpen` is true, so this costs nothing
          when closed and satisfies "render the modal only when needed"
          without each card needing to reimplement that logic. */}
      <RecommendationModal
        recommendation={recommendation}
        locale={locale}
        isOpen={modal.isOpen}
        onClose={modal.close}
        labels={labels}
      />
    </>
  );
}
