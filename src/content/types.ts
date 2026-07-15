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

export interface ExperienceTranslation {
  role: string;
  headlineAchievement: string;
  fullDescription: string;
}

export interface Experience {
  id: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  relatedProjectIds: string[];
  order: number;
  translations: Partial<Record<Locale, ExperienceTranslation>>;
}

export type ResolvedExperience = Omit<Experience, "translations"> &
  ExperienceTranslation &
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
    excerpt: string;
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
    x?: string;
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
