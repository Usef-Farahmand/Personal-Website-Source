import { z } from "zod";
import {
  contentStatusSchema,
  localeSchema,
  nonEmptyString,
  projectCategorySchema,
  projectPlatformSchema,
  slugSchema,
  stringListSchema,
  urlSchema,
} from "./shared";

/**
 * One locale's worth of a Project's translated content. Not used standalone
 * — always nested under `projectInputSchema.translations`, matching the
 * database shape (one ProjectTranslation row per locale).
 */
export const projectTranslationInputSchema = z.object({
  locale: localeSchema,
  title: nonEmptyString,
  shortDescription: nonEmptyString,
  fullDescription: nonEmptyString,
  /** See prisma/schema.prisma's note on why this is localized despite
   *  being taxonomy-shaped. */
  category: projectCategorySchema,
  tags: stringListSchema,
});

/**
 * Full Project input — shared fields plus one translation per supported
 * locale. Not yet wired to a create/update service (Task 01 defers CRUD);
 * this schema is the contract that service will validate against.
 */
export const projectInputSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  featured: z.boolean().default(false),
  technologies: stringListSchema,
  platforms: z.array(projectPlatformSchema).min(1),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  websiteUrl: urlSchema.optional(),
  repositoryUrl: urlSchema.optional(),
  liveUrl: urlSchema.optional(),
  logoMediaId: z.string().optional(),
  coverMediaId: z.string().optional(),
  translations: z
    .array(projectTranslationInputSchema)
    .min(1, "A project needs at least one translation.")
    .refine(
      (translations) =>
        new Set(translations.map((t) => t.locale)).size === translations.length,
      { message: "Duplicate locale in translations." }
    ),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectTranslationInput = z.infer<
  typeof projectTranslationInputSchema
>;
