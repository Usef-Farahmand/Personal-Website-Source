import type { SocialLink } from "@/types/content";

/**
 * Social Universe — six profile icons orbiting the character, shown
 * inline in About → Connect and in the "Find me around the web" dialog
 * opened below the Contact form.
 *
 * Profile URLs are NOT repeated here: they come from the site's one list
 * of social links (`socialLinks` in content/site/site.data.ts), the same
 * list the footer and About page use. To change a URL, edit it there; to
 * hide a profile, set its `enabled: false` there — the icon then shows as
 * "not available yet" and is not a link.
 *
 * `x` / `y` place each icon's centre in the desktop/tablet orbit, as a
 * percentage of the orbit box (left → right, top → bottom); the
 * character fills the middle, so these keep the icons beside the head,
 * beside the open hands and below them, clear of the face. On phones
 * the icons become a 3 × 2 grid under the character instead.
 * `float` sets each icon's own drift: duration (s), phase (s) and the
 * offset it drifts to, so no two move in step.
 */
export const SOCIAL_UNIVERSE_PROFILES = [
  {
    id: "youtube",
    icon: "/social-universe/youtube.webp",
    x: 15,
    y: 17,
    float: { duration: 6.5, delay: -1.2, dx: 3, dy: -7 },
  },
  {
    id: "github",
    icon: "/social-universe/github.webp",
    x: 85,
    y: 17,
    float: { duration: 7.2, delay: -4.1, dx: -3, dy: -6 },
  },
  {
    id: "linkedin",
    icon: "/social-universe/linkedin.webp",
    x: 92,
    y: 50,
    float: { duration: 5.8, delay: -2.6, dx: -4, dy: 5 },
  },
  {
    id: "telegram",
    icon: "/social-universe/telegram.webp",
    x: 85,
    y: 83,
    float: { duration: 6.9, delay: -0.4, dx: -3, dy: -6 },
  },
  {
    id: "instagram",
    icon: "/social-universe/instagram.webp",
    x: 15,
    y: 83,
    float: { duration: 7.6, delay: -3.3, dx: 3, dy: -7 },
  },
  {
    id: "medium",
    icon: "/social-universe/medium.webp",
    x: 8,
    y: 50,
    float: { duration: 6.2, delay: -5.0, dx: 4, dy: 5 },
  },
] as const satisfies readonly {
  id: SocialLink["platform"];
  icon: string;
  x: number;
  y: number;
  float: { duration: number; delay: number; dx: number; dy: number };
}[];

export const SOCIAL_UNIVERSE_CHARACTER = {
  src: "/social-universe/character.webp",
  width: 800,
  height: 882,
} as const;

export type SocialUniverseProfile =
  (typeof SOCIAL_UNIVERSE_PROFILES)[number] & {
    /** null when the profile is missing or disabled in socialLinks. */
    url: string | null;
  };

/** Joins the orbit layout with the site's social links (server side). */
export function getSocialUniverseProfiles(
  socialLinks: SocialLink[]
): SocialUniverseProfile[] {
  return SOCIAL_UNIVERSE_PROFILES.map((profile) => {
    const link = socialLinks.find(
      (l) => l.platform === profile.id && l.enabled && l.url
    );
    return { ...profile, url: link?.url ?? null };
  });
}
