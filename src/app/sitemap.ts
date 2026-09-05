import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { listProjects } from "@/services/content/projects.service";
import { locales, defaultLocale, type Locale } from "@/types/content";

/**
 * Static, locale-agnostic routes present for every locale. Excludes
 * `/[locale]` (the homepage) — that's added separately below with its
 * own priority — and excludes anything without an internal detail page:
 * Articles/Recommendations link out to external platforms/profiles, so
 * their own detail content isn't a separate indexable URL on this site
 * (only /articles and /recommendations, the index pages, are).
 */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/about", priority: 0.8 },
  { path: "/projects", priority: 0.9 },
  { path: "/articles", priority: 0.7 },
  { path: "/skills", priority: 0.6 },
  { path: "/achievements", priority: 0.5 },
  { path: "/experience", priority: 0.6 },
  { path: "/recommendations", priority: 0.5 },
  { path: "/exploring", priority: 0.5 },
];

function languageAlternates(path: string): Record<string, string> {
  const entries = locales.map((locale) => [
    locale,
    new URL(`/${locale}${path}`, siteUrl).toString(),
  ]);
  return {
    ...Object.fromEntries(entries),
    "x-default": new URL(`/${defaultLocale}${path}`, siteUrl).toString(),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage, per locale.
  for (const locale of locales) {
    entries.push({
      url: new URL(`/${locale}`, siteUrl).toString(),
      priority: 1,
      changeFrequency: "monthly",
      alternates: { languages: languageAlternates("") },
    });
  }

  // Static section index pages, per locale.
  for (const { path, priority } of STATIC_ROUTES) {
    for (const locale of locales) {
      entries.push({
        url: new URL(`/${locale}${path}`, siteUrl).toString(),
        priority,
        changeFrequency: "weekly",
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  // Individual project detail pages, per locale — the only content type
  // with a real internal detail route (see STATIC_ROUTES comment above).
  for (const locale of locales as readonly Locale[]) {
    for (const project of listProjects(locale)) {
      const path = `/projects/${project.slug}`;
      entries.push({
        url: new URL(`/${locale}${path}`, siteUrl).toString(),
        lastModified: project.endDate ?? project.startDate,
        priority: project.featured ? 0.8 : 0.6,
        changeFrequency: "monthly",
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  return entries;
}
