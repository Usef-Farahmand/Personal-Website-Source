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

export const articleTranslationInputSchema = z.object({
  locale: localeSchema,
  title: nonEmptyString,
  summary: nonEmptyString,
  category: articleCategorySchema,
  tags: stringListSchema,
  seoTitle: nonEmptyString.optional(),
  seoDescription: nonEmptyString.optional(),
});

/**
 * Articles are external publications — the CMS never stores article body
 * content, only metadata and the canonical `sourceUrl` (Task 01: Article
 * Data Model).
 */
export const articleInputSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  featured: z.boolean().default(false),
  sourceUrl: urlSchema,
  publishedAt: z.coerce.date().optional(),
  headerMediaId: z.string().optional(),
  translations: z
    .array(articleTranslationInputSchema)
    .min(1, "An article needs at least one translation.")
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
