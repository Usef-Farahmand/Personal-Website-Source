"use client";

import { Globe } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { LinkedInIcon } from "@/components/ui/icons";
import { formatMonthYear } from "@/lib/date";
import type { Locale, ResolvedRecommendation } from "@/types/content";

interface RecommendationModalProps {
  recommendation: ResolvedRecommendation;
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  labels: {
    linkedinProfile: string;
    personalWebsite: string;
    opensInNewTab: string;
  };
}

const linkClass =
  "border-border text-small text-text-primary hover:border-accent/50 hover:text-accent inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-medium transition-colors";

export function RecommendationModal({
  recommendation,
  locale,
  isOpen,
  onClose,
  labels,
}: RecommendationModalProps) {
  const meta = [recommendation.jobTitle, recommendation.company]
    .filter(Boolean)
    .join(" · ");

  const hasProfileLinks = Boolean(
    recommendation.linkedin || recommendation.website
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${recommendation.name} — ${recommendation.jobTitle}`}
      contentClassName="sm:p-8"
    >
      <div className="flex items-center gap-4">
        <Avatar
          src={recommendation.avatar}
          name={recommendation.name}
          size="lg"
        />
        <div className="min-w-0">
          <p className="text-body text-text-primary font-semibold">
            {recommendation.name}
          </p>
          {meta && <p className="text-small text-text-secondary">{meta}</p>}
        </div>
      </div>

      {/* Full, untruncated text — this is the entire point of the modal:
          the card only ever shows a preview. */}
      <blockquote className="border-accent text-text-primary text-body mt-6 border-s-2 ps-4 leading-relaxed italic">
        {recommendation.recommendation}
      </blockquote>

      {recommendation.date && (
        <p className="text-caption text-text-secondary mt-4">
          {formatMonthYear(recommendation.date, locale)}
        </p>
      )}

      {/* No empty section when neither link exists — each link renders
          independently rather than as an all-or-nothing block. Each link
          announces that it opens in a new tab via visually-hidden text —
          a sighted user gets that from convention/browser chrome, but a
          screen-reader user has no other way to know before activating
          it, which is what "proper accessibility labels" means here. */}
      {hasProfileLinks && (
        <div className="mt-5 flex flex-wrap gap-3">
          {recommendation.linkedin && (
            <a
              href={recommendation.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <LinkedInIcon className="h-4 w-4" aria-hidden="true" />
              {labels.linkedinProfile}
              <span className="sr-only"> {labels.opensInNewTab}</span>
            </a>
          )}
          {recommendation.website && (
            <a
              href={recommendation.website}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              {labels.personalWebsite}
              <span className="sr-only"> {labels.opensInNewTab}</span>
            </a>
          )}
        </div>
      )}
    </Modal>
  );
}
