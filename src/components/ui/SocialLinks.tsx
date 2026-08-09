import { getTranslations } from "next-intl/server";
import { Cluster } from "@/components/layout/Cluster";
import { SOCIAL_LINK_ICON } from "@/lib/socialPlatforms";
import type { Locale, ResolvedSiteContent, SocialPlatform } from "@/types/content";

interface SocialLinksProps {
  socialLinks: ResolvedSiteContent["socialLinks"];
  locale: Locale;
  size?: "sm" | "md";
  className?: string;
}

// The compact icon-only row (Footer/Hero/Contact) intentionally keeps
// showing exactly what it always has — github/linkedin/telegram/email —
// even though the underlying list now also carries youtube/instagram/
// medium for the About page's fuller "Connect" section. Each consumer
// takes its own curated view of the one shared list; see the doc
// comment on SiteContent.socialLinks.
const COMPACT_ROW_PLATFORMS: readonly SocialPlatform[] = [
  "github",
  "linkedin",
  "telegram",
  "email",
];

const iconSizeClass: Record<NonNullable<SocialLinksProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

/**
 * Renders the compact social/contact icon row from the centralized
 * social link list, each with a translated accessible label. Shared
 * between Footer, Hero, and Contact so the three never duplicate this
 * rendering logic — a link added, removed, or re-ordered in
 * content/site/site.data.ts updates all three automatically.
 */
export async function SocialLinks({
  socialLinks,
  locale,
  size = "md",
  className,
}: SocialLinksProps) {
  const t = await getTranslations({ locale, namespace: "socialLinks" });

  const links = socialLinks.filter(
    (link) => link.enabled && COMPACT_ROW_PLATFORMS.includes(link.platform)
  );

  if (links.length === 0) {
    return null;
  }

  return (
    <Cluster
      as="nav"
      aria-label={t("groupLabel")}
      gap="sm"
      justify="start"
      className={className}
    >
      {links.map(({ id, platform, url }) => {
        const Icon = SOCIAL_LINK_ICON[platform];
        const isEmail = platform === "email";
        return (
          <a
            key={id}
            href={url}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            aria-label={t(platform)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon className={iconSizeClass[size]} />
          </a>
        );
      })}
    </Cluster>
  );
}
