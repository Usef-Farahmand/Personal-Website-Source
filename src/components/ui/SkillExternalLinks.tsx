"use client";

import { useModal } from "@/hooks/useModal";
import { Overlay } from "@/components/ui/Overlay";
import { ExternalLinksList } from "@/components/ui/ExternalLinksList";
import type { ExternalLink } from "@/types/content";

/** Cards show at most this many links before collapsing the rest behind
 *  "Read More" — keeps every SkillCard's footer the same rough height
 *  regardless of how many links a given skill happens to have authored. */
const MAX_VISIBLE_LINKS = 3;

interface SkillExternalLinksProps {
  skillName: string;
  skillDescription: string;
  links: ExternalLink[];
  labels: {
    readMore: string;
  };
}

/**
 * SkillCard's external-links footer. Renders every link inline as
 * before when there are few enough (`links.length <= MAX_VISIBLE_LINKS`)
 * — visually identical to the previous unconditional
 * `<ExternalLinksList links={skill.externalLinks} />`. Once a skill has
 * more links than that, only the first `MAX_VISIBLE_LINKS` render in the
 * card and a "Read More" action opens a popup with the skill's full
 * description and complete link list, so a link-heavy skill can't blow
 * out the card's height (and the grid's row height along with it).
 *
 * This is the one interactive piece of the otherwise server-rendered
 * SkillCard — pulled into its own small Client Component (state: the
 * popup's open/closed) rather than making the whole card, or the
 * Skills page, a Client Component.
 */
export function SkillExternalLinks({
  skillName,
  skillDescription,
  links,
  labels,
}: SkillExternalLinksProps) {
  const modal = useModal();

  if (links.length === 0) return null;

  const hasOverflow = links.length > MAX_VISIBLE_LINKS;
  const visibleLinks = hasOverflow ? links.slice(0, MAX_VISIBLE_LINKS) : links;

  return (
    <>
      <ExternalLinksList links={visibleLinks} />

      {hasOverflow && (
        <>
          <button
            type="button"
            onClick={modal.open}
            className="text-small text-accent hover:text-accent-hover mt-2 inline-flex items-center font-medium transition-colors"
          >
            {labels.readMore}
          </button>

          <Overlay
            isOpen={modal.isOpen}
            onClose={modal.close}
            title={skillName}
            visuallyHiddenTitle={false}
          >
            <p className="text-small text-text-secondary">
              {skillDescription}
            </p>
            <div className="mt-5">
              <ExternalLinksList links={links} />
            </div>
          </Overlay>
        </>
      )}
    </>
  );
}
