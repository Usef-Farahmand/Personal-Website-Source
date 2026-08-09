"use client";

import { Cluster } from "@/components/layout/Cluster";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
import { SOCIAL_LINK_ICON, SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import type { SocialLink, SocialPlatform } from "@/types/content";

// The platforms this section is willing to display, independent of what
// else the centralized social list might someday carry. "email" is
// deliberately excluded — it's Contact's job, not Connect's (the brief
// is explicit: don't duplicate Contact here) — and there is no
// "twitter"/"x" member in the SocialPlatform union at all, so it is
// structurally impossible for an X/Twitter entry to ever render here,
// not merely omitted by convention.
const CONNECT_SECTION_PLATFORMS: readonly SocialPlatform[] = [
  "youtube",
  "telegram",
  "instagram",
  "linkedin",
  "github",
  "medium",
];

interface AboutSocialLinksProps {
  socialLinks: SocialLink[];
  /** Short optional caption per platform (e.g. "Watch my videos"),
   *  already resolved to the current locale by the page — this
   *  component stays a plain "use client" leaf with no translation
   *  fetching of its own. */
  captions: Partial<Record<SocialPlatform, string>>;
  /** id of the section's own visible <h2> — used as this nav's
   *  accessible name via aria-labelledby rather than a separate
   *  aria-label string, so it never collides with Footer/Hero/Contact's
   *  identically-purposed "Social links" nav landmark elsewhere on the
   *  same page. */
  headingId: string;
}

/**
 * Compact "Connect" grid for the About page. Deliberately NOT a social
 * dashboard: no follower counts, no previews, no per-platform imagery —
 * just an icon, a name, and a one-line optional caption per platform,
 * wrapped in Cluster so it flows into as many rows as the viewport needs
 * without ever causing horizontal overflow.
 */
export function AboutSocialLinks({
  socialLinks,
  captions,
  headingId,
}: AboutSocialLinksProps) {
  const ref = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 60,
  });

  const links = socialLinks.filter(
    (link) => link.enabled && CONNECT_SECTION_PLATFORMS.includes(link.platform)
  );

  if (links.length === 0) {
    return null;
  }

  return (
    <Cluster ref={ref} as="nav" aria-labelledby={headingId} gap="sm">
      {links.map(({ id, platform, url }) => {
        const Icon = SOCIAL_LINK_ICON[platform];
        const name = SOCIAL_PLATFORM_NAME[platform];
        const caption = captions[platform];
        const accessibleLabel = caption ? `${name} — ${caption}` : name;

        return (
          <a
            key={id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={accessibleLabel}
            data-animate
            className="group border-border bg-surface hover:border-accent/50 focus-visible:ring-accent flex items-center gap-3 rounded-lg border px-4 py-3 outline-none transition-colors focus-visible:ring-2"
          >
            <Icon className="text-text-secondary group-hover:text-accent h-5 w-5 shrink-0 transition-colors" />
            <span className="flex flex-col">
              <span className="text-small text-text-primary font-medium">
                {name}
              </span>
              {caption && (
                <span className="text-caption text-text-secondary">
                  {caption}
                </span>
              )}
            </span>
          </a>
        );
      })}
    </Cluster>
  );
}
