/**
 * Content Model Types
 *
 * Mirrors /doc/CONTENT_MODEL.md exactly.
 *
 * Every content type separates:
 *  - shared fields    -> identical regardless of locale
 *  - translations     -> one localized field-set per supported locale
 *
 * Components must never consume a raw content item directly.
 * They consume the *resolved* shape returned by the content-access layer
 * (see src/lib/content.ts), which merges shared fields with one locale's
 * translation and never exposes the `translations` map itself.
 */

import type { MediaItem } from "@/types/media";

export type Locale = "en" | "fa";

export const locales: readonly Locale[] = ["en", "fa"] as const;

export const defaultLocale: Locale = "en";

/** Attached by the content-access layer when a translation is missing
 *  and content had to fall back to another available locale. */
export interface TranslationFallbackMeta {
  isFallbackTranslation: boolean;
  fallbackLocale?: Locale;
}

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

export type ProjectStatus = "active" | "shipped" | "paused" | "archived";

export type ProjectCategory = "ai" | "web" | "mobile" | "game" | "tool";

export type ProjectPlatform =
  "web" | "ios" | "android" | "desktop" | "cross-platform";

export interface ProjectTimelineMilestone {
  date: string;
  /** Shared, not localized — consistent with relatedLink-style labels
   *  elsewhere (Experience.relatedLinks, Achievement.relatedLink): short,
   *  infrequently-changing labels don't carry the translation burden that
   *  genuine prose content does. */
  label: string;
}

export interface ProjectExternalLink {
  label: string;
  url: string;
}

export interface ProjectTranslation {
  title: string;
  summary: string;
  problem: string;
  solution: string;
  lessonsLearned: string;
  research?: string;
  design?: string;
  architecture?: string;
  implementation?: string;
  challenges?: string;
  /** Bullet-point feature list for a future detail page — genuinely
   *  distinct from the narrative problem/solution/lessonsLearned fields,
   *  which already serve as "Description." Optional: a small project may
   *  not need a separate feature breakdown. */
  features?: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface Project {
  id: string;
  slug: string;
  status: ProjectStatus;
  featured: boolean;
  category: ProjectCategory;
  technologies: string[];
  platforms: ProjectPlatform[];
  releaseYear?: number;
  startDate: string;
  endDate: string | null;
  /** Real brand mark. Optional — when absent, a category-driven icon
   *  renders instead (same fallback pattern as Achievement.media /
   *  AchievementCard's CATEGORY_ICON), which is what "Optional Icon" in
   *  the requirement refers to — not a second, redundant image field. */
  logoUrl?: string;
  /** Card/detail-page banner image. */
  coverImageUrl?: string;
  /** Reuses MediaItem (types/media.ts) rather than a project-specific
   *  shape — the Universal Media Viewer already consumes exactly this
   *  type, and MediaFileType's "video" is already a documented future
   *  seam there, which is precisely what "the gallery should later
   *  support videos" needs. No new architecture required for that later
   *  step; it's one union member + one MediaViewer render branch. */
  gallery: MediaItem[];
  timeline?: ProjectTimelineMilestone[];
  links: {
    demo?: string;
    repository?: string;
  };
  /** Broader than links.demo/links.repository, which keep their own
   *  dedicated primary-CTA treatment on the detail page — this is for
   *  additional external references (App Store, Product Hunt, press). */
  externalLinks?: ProjectExternalLink[];
  relatedProjectIds: string[];
  relatedArticleIds: string[];
  experienceId: string | null;
  order: number;
  translations: Partial<Record<Locale, ProjectTranslation>>;
}

export type ResolvedProject = Omit<Project, "translations"> &
  ProjectTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Article
// ---------------------------------------------------------------------------

export type ArticleCategory =
  | "software-engineering"
  | "ai"
  | "web-development"
  | "mobile"
  | "game-development"
  | "product-development"
  | "design"
  | "personal-journey";

/**
 * Deliberately a plain string union, not a closed set baked into UI logic
 * beyond a single lookup table (see ARTICLE_PLATFORM_ICON in ArticleCard)
 * — adding a future platform (Dev.to, Substack...) means one new union
 * member and one new icon mapping entry, nothing else.
 */
export type ArticleSourcePlatform = "medium" | "linkedin";

export interface ArticleTranslation {
  title: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
}

export interface Article {
  id: string;
  /** Kept from the original model, unused by current UI — already
   *  satisfies the Future Compatibility "Categories" requirement with no
   *  further change needed. */
  category: ArticleCategory;
  /** Shared, not localized — consistent with Project.technologies and
   *  every other short-label field in this content model (relatedLink
   *  labels, milestone labels): minor, infrequently-changing labels
   *  don't carry the same translation burden as genuine prose. */
  tags: string[];
  sourcePlatform: ArticleSourcePlatform;
  sourceUrl: string;
  /** Authored, not computed — the original model derived this from
   *  `body` (removed; there's no on-site content to measure). This is
   *  the reading time as published on the source platform. */
  readingTimeMinutes: number;
  publishedDate: string;
  headerImageUrl?: string;
  /** Array, matching the relationship-field convention used everywhere
   *  else (Project.relatedProjectIds, Experience.relatedProjectIds) —
   *  renamed from the original singular relatedProjectId for consistency. */
  relatedProjectIds: string[];
  relatedArticleIds: string[];
  /** Future Compatibility fields: present in the type so the
   *  architecture supports them, deliberately NOT wired into any
   *  filtering or rendering logic yet, per Task 10's explicit "do not
   *  implement these features now." The homepage preview uses positional
   *  slicing (see ARTICLES_PREVIEW_LIMIT in FeaturedArticles), not this
   *  flag — resolving an apparent tension in the requirement between
   *  "first 2 featured articles" (Homepage Preview) and "Featured flag...
   *  do not implement now" (Future Compatibility) in favor of the
   *  explicit instruction. */
  featured?: boolean;
  coAuthors?: string[];
  order: number;
  translations: Partial<Record<Locale, ArticleTranslation>>;
}

export type ResolvedArticle = Omit<Article, "translations"> &
  ArticleTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export type EmploymentType =
  "full-time" | "part-time" | "contract" | "freelance" | "internship";

export interface ExperienceTranslation {
  role: string;
  /** Short, scannable description of the role — the "Short Description"
   *  field, framed as an outcome-oriented headline per Content Strategy's
   *  "specific and outcome-oriented outperforms duty-listing" guidance. */
  headlineAchievement: string;
  fullDescription: string;
  /** Localized since place names are commonly transliterated/translated
   *  between English and Persian (e.g. "Remote" vs a translated
   *  equivalent), unlike companyName which stays a proper noun. */
  location: string;
}

export interface ExperienceRelatedLink {
  label: string;
  url: string;
}

export interface Experience {
  id: string;
  companyName: string;
  employmentType: EmploymentType;
  startDate: string;
  /** null = current position. Single source of truth — no separate
   *  "isCurrent" boolean, to avoid the two ever disagreeing. */
  endDate: string | null;
  technologies: string[];
  relatedLinks?: ExperienceRelatedLink[];
  relatedProjectIds: string[];
  order: number;
  translations: Partial<Record<Locale, ExperienceTranslation>>;
}

export type ResolvedExperience = Omit<Experience, "translations"> &
  ExperienceTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Achievement
//
// Not part of the original CONTENT_MODEL.md — added during execution
// (Task 07) following the same shared/localized split as every other
// content type. Category is deliberately broad enough to cover every
// future achievement type named in Task 07's requirements (certificates,
// awards, competitions, publications, speaking, open source) up front, so
// adding that content later means adding items with an existing category
// value — no new fields, no component changes.
// ---------------------------------------------------------------------------

export type AchievementCategory =
  | "certificate"
  | "award"
  | "competition"
  | "publication"
  | "speaking"
  | "open-source"
  | "recognition";

export interface AchievementTranslation {
  title: string;
  description: string;
}

export interface AchievementLink {
  label: string;
  url: string;
}

export interface Achievement {
  id: string;
  category: AchievementCategory;
  /** Proper noun (issuing body, event, publication) — not localized,
   *  consistent with companyName elsewhere in the content model. */
  organization?: string;
  date: string;
  relatedLink?: AchievementLink;
  /** The viewable certificate/badge itself (image or PDF), opened via the
   *  Universal Media Viewer. Optional — when absent, a category-driven
   *  icon renders instead (see the icon lookup in AchievementCard).
   *  Superseded badgeImageUrl (a narrower, view-only-as-thumbnail string
   *  field) now that a general media type exists — keeping both would
   *  have meant two ways to express the same concept. */
  media?: MediaItem;
  order: number;
  translations: Partial<Record<Locale, AchievementTranslation>>;
}

export type ResolvedAchievement = Omit<Achievement, "translations"> &
  AchievementTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Skill
// ---------------------------------------------------------------------------

export type SkillDomain =
  | "frontend"
  | "backend"
  | "mobile"
  | "game"
  | "ai"
  | "cloud"
  | "devops"
  | "ui-ux";

/**
 * Replaces the original, never-consumed SkillDepth ("primary" |
 * "working-knowledge") — Task 08 asks for "Experience Level" as a
 * distinct field, which reads more naturally as a 4-tier scale than the
 * original 2-value coarse signal. Since nothing had shipped against the
 * old type yet, this is a clean redesign, not a breaking migration.
 */
export type SkillExperienceLevel =
  "beginner" | "intermediate" | "advanced" | "expert";

export interface SkillTranslation {
  name: string;
  description: string;
}

export interface Skill {
  id: string;
  /** Category, and also drives the default icon (see the domain->icon
   *  lookup in SkillCard) — Icon is not a separate field, consistent
   *  with how Achievement.category already drives its default icon. */
  domain: SkillDomain;
  experienceLevel: SkillExperienceLevel;
  yearsOfExperience?: number;
  /** Curated inclusion in the homepage preview — mirrors Project.featured
   *  rather than positional slicing (Experience/Achievements' `limit`
   *  pattern). "First few featured skills" in the requirement reads as
   *  curation, matching Featured Work's established precedent: the
   *  homepage should show the most representative skills, not just
   *  whichever happen to sort first. */
  featured?: boolean;
  order: number;
  translations: Partial<Record<Locale, SkillTranslation>>;
}

export type ResolvedSkill = Omit<Skill, "translations"> &
  SkillTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

export interface RecommendationTranslation {
  quote: string;
}

export interface Recommendation {
  id: string;
  authorName: string;
  authorPosition: string;
  authorCompany: string;
  relatedExperienceId: string | null;
  relatedProjectId: string | null;
  order: number;
  published: boolean;
  translations: Partial<Record<Locale, RecommendationTranslation>>;
}

export type ResolvedRecommendation = Omit<Recommendation, "translations"> &
  RecommendationTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Exploring Entry
// ---------------------------------------------------------------------------

export interface ExploringEntryTranslation {
  title: string;
  description: string;
}

export interface ExploringEntry {
  id: string;
  order: number;
  relatedArticleId: string | null;
  translations: Partial<Record<Locale, ExploringEntryTranslation>>;
}

export type ResolvedExploringEntry = Omit<ExploringEntry, "translations"> &
  ExploringEntryTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Now Snapshot
// ---------------------------------------------------------------------------

export interface NowSnapshotTranslation {
  building: string;
  learning: string;
  reading: string;
  researching: string;
  playing: string;
  nextGoal: string;
}

export interface NowSnapshot {
  id: string;
  lastUpdatedDate: string;
  translations: Partial<Record<Locale, NowSnapshotTranslation>>;
}

export type ResolvedNowSnapshot = Omit<NowSnapshot, "translations"> &
  NowSnapshotTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Site (identity / hero / about-preview / contact copy that isn't a
// discrete collection item, but still must never be hardcoded in components)
// ---------------------------------------------------------------------------

export interface SiteTranslation {
  hero: {
    greeting: string;
    name: string;
    professionalTitle: string;
    introduction: string;
    availabilityStatus: string;
  };
  aboutPreview: {
    introduction: string;
    professionalSummary: string;
    /** Short list of proof points — simple strings, not a separate
     *  content type, since these have no independent identity or
     *  relationships elsewhere (consistent with Now's simple fields). */
    highlights: string[];
    philosophy: string;
  };
  about: {
    introduction: string;
    mission: string;
    philosophy: string;
    journey: string;
    interests: string;
  };
  contact: {
    availabilityNote: string;
    privacyNote: string;
  };
}

export interface SiteContent {
  id: "site";
  socialLinks: {
    github?: string;
    linkedin?: string;
    telegram?: string;
    email?: string;
  };
  /** Shared (non-localized) fact driving the availability indicator's
   *  visual state; availabilityStatus above is the localized label. */
  availability: {
    isAvailable: boolean;
  };
  translations: Partial<Record<Locale, SiteTranslation>>;
}

export type ResolvedSiteContent = Omit<SiteContent, "translations"> &
  SiteTranslation &
  TranslationFallbackMeta;
