import { z } from "zod";
import {
  articleCategorySchema,
  contentStatusSchema,
  localeSchema,
  nonEmptyString,
  slugSchema,
  stringListSchema,
  urlSchema,
} from "./shared";

/**
 * See prisma/schema.prisma's ArticleSourcePlatform comment: broader than
 * the public site's current "medium" | "linkedin" union on purpose
 * (Task 05 #8 explicitly asks for Medium/LinkedIn/Website/Other).
 */
export const ARTICLE_SOURCE_PLATFORMS = [
  "MEDIUM",
  "LINKEDIN",
  "WEBSITE",
  "OTHER",
] as const;
export const articleSourcePlatformSchema = z.enum(ARTICLE_SOURCE_PLATFORMS);
export type ArticleSourcePlatform = z.infer<typeof articleSourcePlatformSchema>;

export const ARTICLE_SOURCE_PLATFORM_LABELS: Record<
  ArticleSourcePlatform,
  string
> = {
  MEDIUM: "Medium",
  LINKEDIN: "LinkedIn",
  WEBSITE: "Personal Website",
  OTHER: "Other",
};

/**
 * One locale's worth of an Article's translated content. Not used
 * standalone — always nested under `articleInputSchema.translations`,
 * matching the database shape (one ArticleTranslation row per locale).
 * Reasonable text length (section 14): summary capped generously —
 * this is a card/preview blurb, not the article body (which the CMS
 * never stores at all).
 */
export const articleTranslationInputSchema = z.object({
  locale: localeSchema,
  title: nonEmptyString.max(200, "Title is too long."),
  summary: nonEmptyString.max(600, "Summary is too long for a preview card."),
  category: articleCategorySchema,
  tags: stringListSchema,
  seoTitle: nonEmptyString.optional(),
  seoDescription: nonEmptyString.optional(),
});

/**
 * Full Article input. `translations` allows an empty array here
 * (relaxed from Task 02's `.min(1)`, same reasoning as Project's
 * projectInputSchema) — the action layer enforces "at least one
 * translation to save at all" and "both locales present to publish"
 * with distinguishable, human-facing error messages rather than one
 * generic Zod message.
 */
export const articleInputSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  featured: z.boolean().default(false),
  sourceUrl: urlSchema,
  sourcePlatform: articleSourcePlatformSchema.default("OTHER"),
  readingTimeMinutes: z.coerce
    .number()
    .int()
    .positive("Reading time must be a positive number of minutes.")
    .optional(),
  publishedAt: z.coerce.date().optional(),
  headerMediaId: z.string().trim().optional(),
  translations: z
    .array(articleTranslationInputSchema)
    .refine(
      (translations) =>
        new Set(translations.map((t) => t.locale)).size === translations.length,
      { message: "Duplicate locale in translations." }
    ),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
export type ArticleTranslationInput = z.infer<
  typeof articleTranslationInputSchema
>;
