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
 * The Project.links slots — see prisma/schema.prisma's ProjectLinkType
 * comment for why this replaced the three fixed URL columns from
 * Task 01/02. Kept here (not re-derived from a Prisma enum import) for
 * the same reason `projectCategorySchema` isn't Prisma-enum-backed: the
 * generated Prisma Client isn't available at schema-authoring time in
 * every environment this file is type-checked in, and this list is the
 * one place it's declared.
 */
export const PROJECT_LINK_TYPES = [
  "WEBSITE",
  "REPOSITORY",
  "PLAYABLE",
  "DOWNLOAD",
  "APP_STORE",
  "GOOGLE_PLAY",
  "OTHER",
] as const;
export const projectLinkTypeSchema = z.enum(PROJECT_LINK_TYPES);
export type ProjectLinkType = z.infer<typeof projectLinkTypeSchema>;

export const PROJECT_LINK_TYPE_LABELS: Record<ProjectLinkType, string> = {
  WEBSITE: "Website",
  REPOSITORY: "Repository",
  PLAYABLE: "Playable Demo",
  DOWNLOAD: "Download",
  APP_STORE: "App Store",
  GOOGLE_PLAY: "Google Play",
  OTHER: "Other",
};

/**
 * One Project.links row. `label` is required even for well-known types
 * (WEBSITE, REPOSITORY, ...) — a typed `type` drives the public site's
 * CTA slot mapping, but the *displayed* text stays author-controlled,
 * same as the public site's ExternalLink shape.
 */
export const projectLinkInputSchema = z.object({
  type: projectLinkTypeSchema.default("OTHER"),
  label: nonEmptyString,
  url: urlSchema,
});
export type ProjectLinkInput = z.infer<typeof projectLinkInputSchema>;

/**
 * One gallery entry: a reference to an existing Media record. Order is
 * the array index at save time — no separate `order` field in the
 * input, so the client can't send a value that disagrees with the
 * array it's embedded in.
 */
export const projectGalleryItemInputSchema = z.object({
  mediaId: nonEmptyString,
});
export type ProjectGalleryItemInput = z.infer<
  typeof projectGalleryItemInputSchema
>;

/**
 * One locale's worth of a Project's translated content. Not used standalone
 * — always nested under `projectInputSchema.translations`, matching the
 * database shape (one ProjectTranslation row per locale).
 */
export const projectTranslationInputSchema = z.object({
  locale: localeSchema,
  title: nonEmptyString,
  shortDescription: nonEmptyString,
  description: nonEmptyString,
  /** See prisma/schema.prisma's note on why this is localized despite
   *  being taxonomy-shaped. */
  category: projectCategorySchema,
  tags: stringListSchema,
  /** Falls back to title/shortDescription at render time when absent —
   *  not required at creation. */
  seoTitle: nonEmptyString.optional(),
  seoDescription: nonEmptyString.optional(),
});

/**
 * Full Project input — shared fields plus zero-or-more translations
 * (section 4: a Draft may save with a translation missing entirely) and
 * the structured technologies/platforms/links/gallery collections.
 *
 * `translations` allows an empty array here (relaxed from Task 02's
 * `.min(1)`) — the *action* layer (lib/actions/projects.ts) enforces
 * "at least one translation to save at all" and "both locales present
 * to publish" as business rules with distinguishable error messages,
 * rather than folding both into one generic Zod message here.
 */
export const projectInputSchema = z
  .object({
    slug: slugSchema,
    status: contentStatusSchema.default("DRAFT"),
    featured: z.boolean().default(false),
    technologies: stringListSchema,
    platforms: z.array(projectPlatformSchema),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    logoMediaId: z.string().trim().optional(),
    coverMediaId: z.string().trim().optional(),
    links: z.array(projectLinkInputSchema),
    gallery: z.array(projectGalleryItemInputSchema),
    translations: z
      .array(projectTranslationInputSchema)
      .refine(
        (translations) =>
          new Set(translations.map((t) => t.locale)).size ===
          translations.length,
        { message: "Duplicate locale in translations." }
      ),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    {
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    }
  );

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectTranslationInput = z.infer<
  typeof projectTranslationInputSchema
>;
