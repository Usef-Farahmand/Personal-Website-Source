import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { achievements } from "@/content/achievements";
import { skills } from "@/content/skills";
import { articles } from "@/content/articles";
import { recommendations } from "@/content/recommendations";
import { siteContent } from "@/content/site";
import type {
  Locale,
  Project,
  ResolvedAchievement,
  ResolvedArticle,
  ResolvedExperience,
  ResolvedProject,
  ResolvedRecommendation,
  ResolvedSiteContent,
  ResolvedSkill,
  SiteContent,
} from "@/content/types";
import { defaultLocale } from "@/content/types";

/**
 * Resolves a content item's `translations` map into a flat object for the
 * requested locale, falling back to the default locale when a translation
 * is missing. Components never see the `translations` map itself — this is
 * the single place fallback logic lives, per CONTENT_MODEL.md.
 */
function resolveTranslation<TShared, TTranslation extends object>(
  item: TShared & { translations: Partial<Record<Locale, TTranslation>> },
  locale: Locale
): TShared &
  TTranslation & { isFallbackTranslation: boolean; fallbackLocale?: Locale } {
  const { translations, ...shared } = item;

  const requested = translations[locale];
  if (requested) {
    return {
      ...shared,
      ...requested,
      isFallbackTranslation: false,
    } as TShared & TTranslation & { isFallbackTranslation: boolean };
  }

  const fallback = translations[defaultLocale];
  if (!fallback) {
    throw new Error(
      `Content item has no translation for "${locale}" and no fallback "${defaultLocale}" translation exists.`
    );
  }

  return {
    ...shared,
    ...fallback,
    isFallbackTranslation: true,
    fallbackLocale: defaultLocale,
  } as TShared &
    TTranslation & { isFallbackTranslation: boolean; fallbackLocale: Locale };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function listProjects(locale: Locale): ResolvedProject[] {
  return [...projects]
    .sort((a, b) => a.order - b.order)
    .map((project) => resolveTranslation(project, locale) as ResolvedProject);
}

export function listFeaturedProjects(
  locale: Locale,
  options?: ListOptions
): ResolvedProject[] {
  const featured = listProjects(locale).filter((project) => project.featured);
  return options?.limit ? featured.slice(0, options.limit) : featured;
}

export function getProjectBySlug(
  slug: string,
  locale: Locale
): ResolvedProject | null {
  const project = projects.find((p: Project) => p.slug === slug);
  return project
    ? (resolveTranslation(project, locale) as ResolvedProject)
    : null;
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

interface ListOptions {
  /** Caps the number of returned items — the mechanism behind every
   *  "homepage preview shows N, dedicated page shows all" section. Applied
   *  at the accessor level (not sliced in components) so that swapping the
   *  underlying data source for a real CMS/API later means the preview
   *  simply requests a limited query instead of over-fetching and slicing
   *  client-side. */
  limit?: number;
}

export function listExperience(
  locale: Locale,
  options?: ListOptions
): ResolvedExperience[] {
  const all = [...experience]
    .sort((a, b) => a.order - b.order)
    .map((entry) => resolveTranslation(entry, locale) as ResolvedExperience);
  return options?.limit ? all.slice(0, options.limit) : all;
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export function listAchievements(
  locale: Locale,
  options?: ListOptions
): ResolvedAchievement[] {
  const all = [...achievements]
    .sort((a, b) => a.order - b.order)
    .map((entry) => resolveTranslation(entry, locale) as ResolvedAchievement);
  return options?.limit ? all.slice(0, options.limit) : all;
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export function listSkills(locale: Locale): ResolvedSkill[] {
  return [...skills]
    .sort((a, b) => a.order - b.order)
    .map((skill) => resolveTranslation(skill, locale) as ResolvedSkill);
}

export function listFeaturedSkills(locale: Locale): ResolvedSkill[] {
  return listSkills(locale).filter((skill) => skill.featured);
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export function listArticles(
  locale: Locale,
  options?: ListOptions
): ResolvedArticle[] {
  const all = [...articles]
    .sort((a, b) => a.order - b.order)
    .map((article) => resolveTranslation(article, locale) as ResolvedArticle);
  return options?.limit ? all.slice(0, options.limit) : all;
}

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

export function listRecommendations(
  locale: Locale,
  options?: ListOptions
): ResolvedRecommendation[] {
  const published = [...recommendations]
    .filter((recommendation) => recommendation.published)
    .sort((a, b) => a.order - b.order)
    .map(
      (recommendation) =>
        resolveTranslation(recommendation, locale) as ResolvedRecommendation
    );
  return options?.limit ? published.slice(0, options.limit) : published;
}

// ---------------------------------------------------------------------------
// Site content
// ---------------------------------------------------------------------------

export function getSiteContent(locale: Locale): ResolvedSiteContent {
  return resolveTranslation(siteContent, locale) as ResolvedSiteContent & {
    id: SiteContent["id"];
  };
}
