import { siteUrl } from "@/config/site";
import { brand } from "@/config/brand";
import { getSiteContent } from "@/services/content/site.service";
import { listSkills } from "@/services/content/skills.service";
import { getContactContent } from "@/services/content/contact.service";
import { locales, type Locale } from "@/types/content";

/**
 * Schema.org building blocks shared by every page's JSON-LD.
 *
 * Every page describes the same person, studio and website, so they get
 * stable `@id`s here; page-level blocks (breadcrumbs, a project, a
 * learning note) point back at them with `{ "@id": ... }` instead of
 * repeating the whole Person each time. That linked graph is what lets
 * search engines and AI answer engines merge everything on the site into
 * one entity ("Usef Farahmand"), rather than many loose fragments.
 *
 * Only facts already authored in src/content are used — nothing invented
 * (no employer history guesses, ratings, prices or awards).
 */

export const PERSON_ID = new URL("/#person", siteUrl).toString();
export const STUDIO_ID = new URL("/#studio", siteUrl).toString();
export const WEBSITE_ID = new URL("/#website", siteUrl).toString();

export const personRef = { "@id": PERSON_ID } as const;

/** Absolute URL for a locale-prefixed site path ("/projects" -> ".../en/projects"). */
export function absoluteUrl(locale: Locale, path: string = ""): string {
  return new URL(`/${locale}${path}`, siteUrl).toString();
}

/** Absolute URL for an asset path or an already-absolute URL. */
export function absoluteAsset(src: string): string {
  return new URL(src, siteUrl).toString();
}

export function buildSiteGraph(locale: Locale) {
  const site = getSiteContent(locale);
  const contact = getContactContent(locale);
  const otherNames = locales
    .filter((l) => l !== locale)
    .map((l) => getSiteContent(l).hero.name)
    .filter((name) => name !== site.hero.name);

  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.hero.name,
    ...(otherNames.length > 0 && { alternateName: otherNames }),
    jobTitle: site.hero.professionalTitle,
    description: site.hero.introduction,
    url: absoluteUrl(locale),
    mainEntityOfPage: absoluteUrl(locale, "/about"),
    image: absoluteAsset(brand.profile.src),
    email: `mailto:${contact.email}`,
    sameAs: site.socialLinks
      .filter((link) => link.enabled && link.platform !== "email")
      .map((link) => link.url),
    knowsAbout: listSkills(locale).map((skill) => skill.name),
    worksFor: { "@id": STUDIO_ID },
  };

  const studio = {
    "@type": "Organization",
    "@id": STUDIO_ID,
    name: site.studio.name,
    url: site.studio.url,
    logo: absoluteAsset(site.studio.logoSrc),
    description: site.studioIntro.description,
    founder: personRef,
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.hero.name,
    url: absoluteUrl(locale),
    description: site.hero.introduction,
    inLanguage: locale,
    author: personRef,
    publisher: personRef,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, studio, website],
  };
}

/**
 * BreadcrumbList that always starts at Home, mirroring the visual
 * Breadcrumb component's "Home / Section / Title" trail.
 */
export function buildBreadcrumbLd(
  locale: Locale,
  homeLabel: string,
  items: { name: string; path: string }[]
) {
  const trail = [{ name: homeLabel, path: "" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

/**
 * CollectionPage + ItemList for a section index page (Projects, Learning,
 * Articles), so crawlers see the list of entries even without running
 * the client-side filters.
 */
export function buildCollectionLd({
  locale,
  path,
  name,
  description,
  items,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  items: { name: string; url: string; description?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(locale, path),
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    author: personRef,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
        ...(item.description && { description: item.description }),
      })),
    },
  };
}
