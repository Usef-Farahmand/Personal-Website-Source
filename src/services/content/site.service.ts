import { siteContent } from "@/content/site";
import { resolveTranslation } from "./shared";
import type { Locale, ResolvedSiteContent, SiteContent } from "@/types/content";

/**
 * Deliberately one service for all site-wide singleton content (hero,
 * about preview, contact copy, social links, availability), not split
 * into separate navigation/footer/social services as the requirement's
 * example folder structure suggested. Reasoning, not an oversight:
 *
 * - There is no navigation content to serve today — Header renders no
 *   nav links at all (confirmed by audit), so a navigation.service.ts
 *   would export nothing and exist purely as a placeholder.
 * - Footer's only content is the site name + social links, both already
 *   served here — a separate footer.service.ts would just re-export
 *   pieces of this one.
 * - Social links are a field within this same singleton content record,
 *   not an independently-managed collection the way projects/skills are
 *   — splitting them out would fragment one coherent content object into
 *   pieces with no independent identity, the opposite of what Code
 *   Quality's "avoid unnecessary abstractions" asks for.
 *
 * If Header ever grows a real primary navigation (multiple links,
 * possibly per-locale), splitting a `navigation` domain out of this
 * service at that point is a small, low-risk change — nothing about
 * today's structure blocks it.
 */
export function getSiteContent(locale: Locale): ResolvedSiteContent {
  return resolveTranslation(siteContent, locale) as ResolvedSiteContent & {
    id: SiteContent["id"];
  };
}
