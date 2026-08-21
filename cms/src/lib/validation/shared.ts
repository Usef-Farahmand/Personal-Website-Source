/**
 * Shared validation primitives for the CMS.
 *
 * ContentStatus, Locale, and MediaType are now real Prisma enums (see
 * prisma/schema.prisma's file-level comment for why this changed from
 * Task 01's plain-String approach). Their allowed values are imported
 * directly from the generated Prisma Client rather than re-declared here
 * — Task 02 explicitly calls out avoiding "duplicated manual types where
 * Prisma generated types are sufficient," and a second hardcoded list is
 * exactly the kind of drift risk that creates (add a locale to the
 * schema, forget to update a parallel array here).
 *
 * `category` (Project/Article) is deliberately NOT a Prisma enum — see
 * the schema comment — so its allowed values are still defined here,
 * validated by Zod only.
 */

import { ContentStatus, Locale, MediaType } from "@prisma/client";
import { z } from "zod";

/** Builds a Zod schema from a Prisma-generated TS enum object, so the
 *  Zod layer and the Prisma schema can never drift out of sync. */
function fromPrismaEnum<T extends Record<string, string>>(prismaEnum: T) {
  const values = Object.values(prismaEnum) as [T[keyof T], ...T[keyof T][]];
  return z.enum(values);
}

export const contentStatusSchema = fromPrismaEnum(ContentStatus);
export type { ContentStatus };

export const localeSchema = fromPrismaEnum(Locale);
export type { Locale };

export const mediaTypeSchema = fromPrismaEnum(MediaType);
export type { MediaType };

/** Display labels for MediaType — kept here (not in lib/media/storage.ts,
 *  which imports Node built-ins) so client components like MediaUploader
 *  can use it without pulling server-only code into the browser bundle. */
export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  IMAGE: "Image",
  VIDEO: "Video",
  PDF: "PDF",
};

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
