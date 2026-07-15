/**
 * Site-wide configuration.
 *
 * These are deployment and SEO facts, not content — they don't belong in
 * the content layer because they're never authored through a CMS and
 * aren't localized. Content that a future CMS will manage lives in
 * src/content/; configuration that only changes with a deployment or
 * infrastructure decision lives here.
 */

/**
 * The two public entry-point domains, per MULTILINGUAL_ARCHITECTURE.md.
 * Both serve every locale identically — neither is a "language domain."
 */
export const siteDomains = {
  primary: "https://www.useffarahmand.com",
  secondary: "https://www.useffarahmand.ir",
} as const;

/**
 * Base URL used to resolve relative metadata (OG images, canonical URLs).
 * Falls back to the primary domain when no environment override is set,
 * so local/preview builds still produce valid absolute URLs.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? siteDomains.primary
);

export const siteMetadataDefaults = {
  titleTemplate: "%s — Usef Farahmand",
} as const;
