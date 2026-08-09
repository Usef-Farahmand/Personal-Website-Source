import { Mail } from "lucide-react";
import {
  GitHubIcon,
  LinkedInIcon,
  TelegramIcon,
  YouTubeIcon,
  InstagramIcon,
  MediumIcon,
} from "@/components/ui/icons";
import type { ComponentType, SVGProps } from "react";
import type { SocialPlatform } from "@/types/content";

/**
 * One icon per SocialPlatform, resolved from the platform key rather
 * than stored in content data — see the SocialLink doc comment in
 * types/content.ts for why. Shared by every consumer of the social link
 * list (Footer/Hero/Contact's compact icon row, and the About page's
 * fuller "Connect" section) so the platform -> icon mapping is defined
 * exactly once, not duplicated per consumer.
 */
export const SOCIAL_LINK_ICON: Record<
  SocialPlatform,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  telegram: TelegramIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  medium: MediumIcon,
  email: Mail,
};

/**
 * Plain display names, not translated content — brand names stay
 * identical across locales throughout this codebase (e.g. project
 * `technologies` strings, TechIcon titles), so these live here as a
 * code-level constant rather than in messages/*.json.
 */
export const SOCIAL_PLATFORM_NAME: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  telegram: "Telegram",
  youtube: "YouTube",
  instagram: "Instagram",
  medium: "Medium",
  email: "Email",
};
