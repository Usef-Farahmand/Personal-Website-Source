import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/icons";
import { Cluster } from "@/components/layout/Cluster";
import type { ComponentType, SVGProps } from "react";
import type { Locale, ResolvedSiteContent } from "@/content/types";

type SocialKey = "github" | "linkedin" | "x" | "email";

interface SocialLinksProps {
  socialLinks: ResolvedSiteContent["socialLinks"];
  locale: Locale;
  size?: "sm" | "md";
  className?: string;
}

const iconByKey: Record<SocialKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  email: Mail,
};

const iconSizeClass: Record<NonNullable<SocialLinksProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

/**
 * Renders the social/contact links from site content (github/linkedin/x/
 * email), each with a translated accessible label. Shared between Footer
 * and Hero so the two never duplicate this rendering logic — a link
 * added or removed in content/site/data.ts updates both automatically.
 */
export async function SocialLinks({
  socialLinks,
  locale,
  size = "md",
  className,
}: SocialLinksProps) {
  const t = await getTranslations({ locale, namespace: "socialLinks" });

  const links = (
    [
      { key: "github", href: socialLinks.github },
      { key: "linkedin", href: socialLinks.linkedin },
      { key: "x", href: socialLinks.x },
      { key: "email", href: socialLinks.email },
    ] as const
  ).filter((link): link is { key: SocialKey; href: string } =>
    Boolean(link.href)
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
      {links.map(({ key, href }) => {
        const Icon = iconByKey[key];
        const isEmail = key === "email";
        return (
          <a
            key={key}
            href={href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            aria-label={t(key)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon className={iconSizeClass[size]} />
          </a>
        );
      })}
    </Cluster>
  );
}
