/**
 * Shared validation primitives for the CMS.
 *
 * SQLite stores `status`, `locale`, `category`, and `type` fields as plain
 * strings (see prisma/schema.prisma's file-level comment for why). These
 * constants are the single source of truth for what values are actually
 * allowed — every Prisma write goes through the Zod schemas in this
 * directory first, so an invalid value never reaches the database even
 * though the database column itself can't enforce it natively.
 *
 * Mirrors the public website's closed unions where one already exists
 * (ProjectCategory, ProjectPlatform, ArticleCategory, ArticleSourcePlatform
 * in src/types/content.ts) so an export step can map 1:1 rather than
 * reconciling two different vocabularies.
 */

import { z } from "zod";

export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const contentStatusSchema = z.enum(CONTENT_STATUSES);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const LOCALES = ["en", "fa"] as const;
export const localeSchema = z.enum(LOCALES);
export type Locale = z.infer<typeof localeSchema>;

export const MEDIA_TYPES = ["image", "video", "pdf"] as const;
export const mediaTypeSchema = z.enum(MEDIA_TYPES);
export type MediaType = z.infer<typeof mediaTypeSchema>;

export const PROJECT_CATEGORIES = [
  "ai",
  "web",
  "mobile",
  "game",
  "playable-ad",
  "tool",
] as const;
export const projectCategorySchema = z.enum(PROJECT_CATEGORIES);

export const PROJECT_PLATFORMS = [
  "web",
  "ios",
  "android",
  "desktop",
  "cross-platform",
] as const;
export const projectPlatformSchema = z.enum(PROJECT_PLATFORMS);

export const ARTICLE_CATEGORIES = [
  "software-engineering",
  "ai",
  "web-development",
  "mobile",
  "game-development",
  "product-development",
  "design",
  "personal-journey",
] as const;
export const articleCategorySchema = z.enum(ARTICLE_CATEGORIES);

/** Trimmed, non-empty string — the baseline for every required text field
 *  so "" and "   " are rejected the same way `undefined` would be. */
export const nonEmptyString = z.string().trim().min(1);

/** A slug used in URLs — lowercase, hyphenated, no whitespace. */
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    'Slug must be lowercase, alphanumeric, and hyphen-separated (e.g. "my-project").'
  );

export const urlSchema = z.url();

/** A tag/technology list — non-empty strings, no duplicates, order
 *  preserved (order is meaningful: authors control display order). */
export const stringListSchema = z
  .array(nonEmptyString)
  .refine((values) => new Set(values).size === values.length, {
    message: "List contains duplicate values.",
  });
