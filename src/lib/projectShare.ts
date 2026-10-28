import type { ProjectCategory } from "@/types/content";

/**
 * Which friendly share message a project gets (projectShare.templates.*
 * in the message files). Mapped from the project's own category so no
 * project data needs a new field; anything without a clear match uses
 * the general message.
 */
export type ShareTemplate = "game" | "app" | "website" | "tool" | "general";

const TEMPLATE_BY_CATEGORY: Record<ProjectCategory, ShareTemplate> = {
  game: "game",
  "playable-ad": "game",
  mobile: "app",
  web: "website",
  tool: "tool",
  // "AI" spans apps, tools and experiments — too broad for one message.
  ai: "general",
};

export function shareTemplateFor(category: ProjectCategory): ShareTemplate {
  return TEMPLATE_BY_CATEGORY[category] ?? "general";
}

export type SharePlatform =
  | "x"
  | "linkedin"
  | "telegram"
  | "whatsapp"
  | "facebook";

/**
 * Official share endpoints. X, Telegram and WhatsApp take the edited
 * message; LinkedIn and Facebook only take the URL and build the preview
 * from the page's own Open Graph tags.
 */
export function shareUrl(
  platform: SharePlatform,
  url: string,
  message: string
): string {
  const text = message.trim();
  const u = encodeURIComponent(url);
  switch (platform) {
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${u}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case "telegram":
      return `https://t.me/share/url?url=${u}&text=${encodeURIComponent(text)}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(text ? `${text}\n${url}` : url)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
  }
}

