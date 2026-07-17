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
  startDate: string;
  endDate: string | null;
  links: {
    demo?: string;
    repository?: string;
  };
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

export interface ArticleTranslation {
  title: string;
  summary: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
}

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  publishedDate: string;
  updatedDate: string;
  coverImage: string;
  relatedProjectId: string | null;
  relatedArticleIds: string[];
  order: number;
  translations: Partial<Record<Locale, ArticleTranslation>>;
}

export type ResolvedArticle = Omit<Article, "translations"> &
  ArticleTranslation &
  TranslationFallbackMeta & { readingTimeMinutes: number };

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
  /** Real badge/certificate graphic. Optional and unpopulated in current
   *  placeholder content — no real assets exist yet. When absent, a
   *  category-driven icon renders instead (see the icon lookup in
   *  AchievementCard). The field exists now specifically so a future
   *  certificate with a real badge image needs no structural change. */
  badgeImageUrl?: string;
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

export type SkillDepth = "primary" | "working-knowledge";

export interface SkillTranslation {
  name: string;
}

export interface Skill {
  id: string;
  domain: SkillDomain;
  depthLevel: SkillDepth;
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
