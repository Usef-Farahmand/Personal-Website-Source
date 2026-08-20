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

export type ProjectCategory =
  | "ai"
  | "web"
  | "mobile"
  | "game"
  | "playable-ad"
  | "tool";

export type ProjectPlatform =
  "web" | "ios" | "android" | "desktop" | "cross-platform";

/**
 * A small closed set mapped to lucide icons in FeatureHighlightCard —
 * same "authored icon choice, rendered via a lookup table" convention as
 * ProjectCard's CATEGORY_ICON and AchievementCard's category icon, rather
 * than storing an arbitrary icon-name string as content.
 */
export type FeatureHighlightIcon =
  | "performance"
  | "security"
  | "ai"
  | "sync"
  | "collaboration"
  | "customization"
  | "offline"
  | "automation"
  | "accessibility"
  | "integration";

export interface ProjectFeatureHighlight {
  icon: FeatureHighlightIcon;
  title: string;
  description: string;
}

export interface ProjectChallenge {
  problem: string;
  solution: string;
  outcome: string;
}

export interface ProjectTimelineMilestone {
  date: string;
  /** Shared, not localized — consistent with relatedLink-style labels
   *  elsewhere (Experience.relatedLinks, Achievement.relatedLink): short,
   *  infrequently-changing labels don't carry the translation burden that
   *  genuine prose content does. */
  label: string;
}

/** Generic {label, url} pair. Originally Project-only; reused by Skill's
 *  externalLinks below rather than duplicating an identical shape under a
 *  second name. */
export interface ExternalLink {
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
  /** Goal statement for the detail page's Overview section — distinct
   *  from problem/solution, which stay narrative. */
  goals?: string;
  targetAudience?: string;
  myRole?: string;
  /** Structured Problem/Solution/Outcome entries for the detail page's
   *  Challenges section. Replaces the earlier free-text `challenges`
   *  narrative field — nothing else in the codebase rendered that field
   *  yet, so this is a clean replacement rather than an added parallel
   *  field. Embedded directly in the translation (not a separate
   *  id-linked collection) for the same reason as
   *  SiteTranslation.aboutPreview.highlights: a short, per-project list
   *  with no independent identity or cross-references elsewhere. */
  challenges?: ProjectChallenge[];
  /** Feature Highlights for the detail page. Replaces the earlier plain
   *  `features: string[]` bullet list — same "nothing rendered it yet,
   *  clean replacement" reasoning as `challenges` above. */
  featureHighlights?: ProjectFeatureHighlight[];
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
  /** Solo by default; set when the project had collaborators, to drive
   *  the Overview section's Team Size fact. Not localized — a headcount
   *  doesn't change by language. */
  teamSize?: number;
  /** Real brand mark. Optional — when absent, a category-driven icon
   *  renders instead (same fallback pattern as Achievement.media /
   *  AchievementCard's CATEGORY_ICON), which is what "Optional Icon" in
   *  the requirement refers to — not a second, redundant image field. */
  logoUrl?: string;
  /** Card/detail-page banner image. */
  coverImageUrl?: string;
  /** Reuses MediaItem (types/media.ts) rather than a project-specific
   *  shape — the Universal Media Viewer already consumes exactly this
   *  type, including "video" (see types/media.ts) for the detail page's
   *  Media Gallery. */
  gallery: MediaItem[];
  timeline?: ProjectTimelineMilestone[];
  /** The Hero section's Primary/Secondary CTAs — a fixed, small set of
   *  well-known project outcomes, each rendered only when present (see
   *  ProjectHero's CTA_PRIORITY). Distinct from `externalLinks` below,
   *  which is an open-ended list for the separate External Links section
   *  (Steam, itch.io, Documentation, ...). */
  links: {
    website?: string;
    playable?: string;
    download?: string;
    appStore?: string;
    googlePlay?: string;
    repository?: string;
  };
  /** Broader than the fixed `links` set above — this is for additional
   *  external references (Steam, itch.io, Documentation, press) rendered
   *  in their own dedicated section, order-preserved as authored. */
  externalLinks?: ExternalLink[];
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
// About Document (Resume / Portfolio)
//
// Backs the About page's Documents section only — a small, closed
// collection (today: resume + portfolio, in English and Persian), not a
// general-purpose file library. Same shared/localized split as every
// other content type, even though only `translations[locale].title` is
// actually localized content — kept consistent rather than special-cased
// as a flatter shape.
// ---------------------------------------------------------------------------

export type AboutDocumentKind = "resume" | "portfolio";

/** The language the FILE ITSELF is written in — independent of the
 *  visitor's UI locale. A Persian-language resume is still "Resume
 *  (Persian)" to an English-UI visitor; this is what makes that label
 *  correct regardless of `locale` passed to the content-access layer. */
export type AboutDocumentLanguage = "en" | "fa";

export interface AboutDocumentTranslation {
  /** Card title as shown in the visitor's UI locale, e.g. "Resume
   *  (English)" — distinct from `language` above, which never changes
   *  with the UI locale. */
  title: string;
}

export interface AboutDocument {
  id: string;
  kind: AboutDocumentKind;
  language: AboutDocumentLanguage;
  /** Free-form version label (e.g. "v2.3"), shown on the card when
   *  present. Optional — not every document needs explicit versioning. */
  version?: string;
  lastUpdatedDate?: string;
  /** The actual file, opened via the Universal Media Viewer per the
   *  explicit "never open PDFs in a new tab" requirement. Reuses
   *  MediaItem exactly as Achievement.media does — `downloadable` on the
   *  item itself is what gates the card's Download action. */
  media: MediaItem;
  order: number;
  translations: Partial<Record<Locale, AboutDocumentTranslation>>;
}

export type ResolvedAboutDocument = Omit<AboutDocument, "translations"> &
  AboutDocumentTranslation &
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
  | "ui-ux"
  | "database"
  | "tools";

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
  /** Closely-associated tools/libraries within this skill (e.g. "React &
   *  Next.js" -> ["Zustand", "TanStack Query"]) — texture for the detail
   *  card, distinct from `domain`'s broad category grouping. Shared, not
   *  localized: proper nouns don't change by language, same reasoning as
   *  Project.technologies. */
  technologies?: string[];
  relatedProjectIds?: string[];
  relatedArticleIds?: string[];
  externalLinks?: ExternalLink[];
  order: number;
  translations: Partial<Record<Locale, SkillTranslation>>;
}

export type ResolvedSkill = Omit<Skill, "translations"> &
  SkillTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

/** Extensible the same way ArticleSourcePlatform is — a future source
 *  (e.g. an imported testimonial platform) is one new union member. */
export interface RecommendationTranslation {
  /** Translated — job titles are reasonably phrased differently between
   *  languages, same reasoning as Experience.role. */
  jobTitle: string;
  recommendation: string;
}

export interface Recommendation {
  id: string;
  name: string;
  /** Optional — not every recommender's company affiliation is relevant
   *  or known (e.g. an independent mentor). Shared/not localized: a
   *  company name is a proper noun, same reasoning as
   *  Experience.companyName. */
  company?: string;
  avatar?: string;
  date?: string;
  /** External Profile Links. Two flat, named optional fields rather than
   *  a generic externalLinks array (contrast with Project/Skill's
   *  ExternalLink[]): exactly two kinds are supported, not an open-ended
   *  list, so a closed shape is more honest about what's actually
   *  supported and lets RecommendationModal render each with its correct
   *  icon directly rather than guessing from a label string. */
  linkedin?: string;
  website?: string;
  order: number;
  /** Gates whether a recommendation is live. This is the mechanism behind
   *  Content Strategy's launch threshold for this section ("a
   *  recommendation can exist in the system without being live") —
   *  listRecommendations filters to published entries by default. */
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

/**
 * The small, closed set of areas shown in the About page's "What I
 * Build" grid. A plain string union mapped to a lucide icon via one
 * lookup table (see BUILD_AREA_ICON in AboutBuildAreaCard) — same
 * "authored icon choice, rendered via a lookup table" convention as
 * FeatureHighlightIcon and AchievementCategory's icon mapping. The
 * *label* for each domain is a short, near-static piece of UI chrome
 * (like ProjectCategory or SkillDomain labels), not prose content, so it
 * lives in the `whatIBuild` translation namespace rather than being
 * re-authored per item in the content data below.
 */
export type WhatIBuildDomain =
  | "webApps"
  | "mobileApps"
  | "games"
  | "aiTools"
  | "automation"
  | "websites";

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
  /**
   * Redesigned per the minimal About page brief: this is no longer a
   * resume-shaped set of headed sections (Mission/Philosophy/Journey/
   * Interests all removed — none were consumed anywhere else, so this
   * is a clean replacement, not an additive change). About now answers
   * one question ("who is this person") without duplicating Experience,
   * Skills, Projects, Articles, or Achievements, which already exist as
   * dedicated, deeper sections elsewhere on the site.
   */
  about: {
    /** Section 1 (Personal Introduction). Short, 3–5 lines — name and
     *  professional title are NOT repeated here, since they already
     *  have one source of truth in `hero.name` / `hero.professionalTitle`
     *  and the About page reuses those directly rather than re-authoring
     *  them a second time. */
    introduction: string;
    /** Section 2 (About Me). A short story, not a biography — 2–3 short
     *  paragraphs, each rendered as its own <p>. Deliberately an array
     *  of short paragraphs rather than one long block of prose, per the
     *  "avoid long paragraphs" design philosophy. */
    story: string[];
    /** Section 5 (Current Focus). A handful of short, current phrases —
     *  simple strings with no independent identity, same reasoning as
     *  aboutPreview.highlights above. */
    currentFocus: string[];
  };
}

/**
 * The platforms Usef maintains a public presence on. A closed union
 * (not a free-form string) so every consumer — the icon lookup, the
 * accessible-label lookup, the About page's "Connect" section — is
 * exhaustively type-checked; adding a platform is a one-line addition
 * here plus one new content.data.ts entry, not a UI rewrite. "email" is
 * modeled here too even though it's a contact method rather than a
 * social platform, because structurally it behaves identically (an id,
 * a URL, an enabled flag) and every existing consumer (Footer/Hero/
 * Contact's icon row) already treats it as part of the same list — see
 * SOCIAL_LINK_ICON in lib/socialPlatforms.tsx.
 */
export type SocialPlatform =
  | "github"
  | "linkedin"
  | "telegram"
  | "youtube"
  | "instagram"
  | "medium"
  | "email";

/**
 * One entry in the centralized social/contact link list. Deliberately
 * does NOT store a display label or icon component here — the *label*
 * is near-static UI chrome (like WhatIBuildDomain's label), resolved
 * through the `socialLinks` translation namespace; the *icon* is a React
 * component, which can't live in a plain content data file. Both are
 * resolved from `platform` via lookup tables (SOCIAL_LINK_ICON in
 * lib/socialPlatforms.tsx; the `socialLinks` messages namespace), the
 * same "shared enum value + resolved label" pattern as
 * SiteContent.aboutBuildAreas.
 *
 * `enabled` lets a platform be authored (kept in content history, ready
 * to switch back on) without being live — every consumer filters on it,
 * so turning a platform off never requires touching a component.
 */
export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
}

export interface SiteContent {
  id: "site";
  /** Every consumer selects its own subset of this one list — Footer/
   *  Hero/Contact show a compact icon-only row (github/linkedin/
   *  telegram/email, unchanged from before), the About page's "Connect"
   *  section shows the fuller social set (everything except email) —
   *  rather than each maintaining its own duplicate list. Same "one
   *  source, each consumer takes a curated view" principle as the
   *  Homepage Preview Pattern used for Projects/Articles/etc. */
  socialLinks: SocialLink[];
  /** Shared (non-localized) fact driving the availability indicator's
   *  visual state; availabilityStatus above is the localized label. */
  availability: {
    isAvailable: boolean;
  };
  /** Section 3 (What I Build). Shared, not localized — this is an
   *  ordered list of domain *keys*; the label shown for each is resolved
   *  through the `whatIBuild` translation namespace at render time, the
   *  same "shared list of enum values + localized label lookup" pattern
   *  as e.g. Project.category + the `projectCategory` namespace. */
  aboutBuildAreas: WhatIBuildDomain[];
  translations: Partial<Record<Locale, SiteTranslation>>;
}

export type ResolvedSiteContent = Omit<SiteContent, "translations"> &
  SiteTranslation &
  TranslationFallbackMeta;
