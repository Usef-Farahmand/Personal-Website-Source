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
 * One gallery entry. Task 06.3 widens this from "always a reference to
 * an existing Media record" to a discriminated union: a MEDIA entry
 * (the original, unchanged shape) or a YOUTUBE_VIDEO entry (an external
 * reference — never a Media record, see the task's YouTube Video Model
 * section). Order is the array index at save time in both cases — no
 * separate `order` field in the input, so the client can't send a value
 * that disagrees with the array it's embedded in.
 *
 * `youtubeVideoId` is required and pattern-checked here, but the
 * *authoritative* value is always the one `parseProjectForm`
 * (lib/actions/projects.ts) re-derives from `youtubeUrl` via
 * `extractYoutubeVideoId` before this schema ever runs — a
 * hand-tampered form payload can't smuggle in a mismatched id/url pair.
 * That re-derivation is deterministic and makes no network request
 * (section 6), same as the client-side preview.
 */
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const projectGalleryMediaItemInputSchema = z.object({
  type: z.literal("MEDIA"),
  mediaId: nonEmptyString,
});

const projectGalleryYoutubeItemInputSchema = z.object({
  type: z.literal("YOUTUBE_VIDEO"),
  youtubeVideoId: z
    .string()
    .trim()
    .regex(
      YOUTUBE_VIDEO_ID_PATTERN,
      "That doesn't look like a valid YouTube URL."
    ),
  youtubeUrl: urlSchema,
  youtubeTitle: nonEmptyString,
  youtubeThumbnailUrl: urlSchema.optional(),
});

export const projectGalleryItemInputSchema = z.discriminatedUnion("type", [
  projectGalleryMediaItemInputSchema,
  projectGalleryYoutubeItemInputSchema,
]);
export type ProjectGalleryItemInput = z.infer<
  typeof projectGalleryItemInputSchema
>;

/**
 * Task 06.1: one link on a Project Team Member (LinkedIn, personal site,
 * "Other", ...). Deliberately the same open {label, url} shape as
 * ProjectLink's label/url and the public site's ExternalLink — a
 * collaborator's links are just as open-ended as a project's external
 * links, so no closed platform enum here. `label` is what the task's
 * example shows ("LinkedIn", "Personal Website", "Other") as free text
 * the author chooses, not a fixed vocabulary.
 */
export const teamMemberLinkInputSchema = z.object({
  label: nonEmptyString,
  url: urlSchema,
});
export type TeamMemberLinkInput = z.infer<typeof teamMemberLinkInputSchema>;

/**
 * One Project Team Member. `links` defaults to an empty array — per the
 * task, not every collaborator has e.g. a LinkedIn, so links are
 * optional per member, not required.
 */
export const teamMemberInputSchema = z.object({
  name: nonEmptyString,
  links: z.array(teamMemberLinkInputSchema).default([]),
});
export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;

/**
 * One ProjectFeatureHighlight (public site type: icon + title +
 * description). `icon` is validated as a non-empty string rather than a
 * closed enum matching the public site's FeatureHighlightIcon union —
 * that union lives in the public website package, not this CMS, and
 * duplicating it here would be exactly the kind of second source of
 * truth Task 02 warns against for enums the CMS doesn't itself own.
 */
export const featureHighlightInputSchema = z.object({
  icon: nonEmptyString,
  title: nonEmptyString,
  description: nonEmptyString,
});
export type FeatureHighlightInput = z.infer<typeof featureHighlightInputSchema>;

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

  /** Task 06.1: narrative fields from the public site's
   *  ProjectTranslation type. All optional — not part of
   *  REQUIRED_TRANSLATION_FIELDS in lib/actions/projects.ts, so a
   *  translation can be "complete" without them, same as seoTitle. */
  problem: nonEmptyString.optional(),
  solution: nonEmptyString.optional(),
  lessonsLearned: nonEmptyString.optional(),
  targetAudience: nonEmptyString.optional(),
  myRole: nonEmptyString.optional(),
  featureHighlights: z.array(featureHighlightInputSchema).default([]),
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
    /** Task 06.1: public site's Project.releaseYear — optional, a
     *  project can be ongoing with no shipped year yet. */
    releaseYear: z.coerce.number().int().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    /** Task 06.1: public site's Project.order — plain author-editable
     *  integer, default 0 like every other Project's initial order. */
    order: z.coerce.number().int().default(0),
    /** Task 06.1: cross-content references. relatedProjectIds is a list
     *  of this CMS's own Project.id values (see schema.prisma comment);
     *  relatedArticleIds/experienceId are opaque external ids until
     *  Articles/Experience are migrated the same way. Not validated as
     *  URLs or slugs — just non-empty strings, since their shape is
     *  whatever the source content used. */
    relatedProjectIds: stringListSchema.default([]),
    relatedArticleIds: stringListSchema.default([]),
    experienceId: z.string().trim().optional(),
    logoMediaId: z.string().trim().optional(),
    coverMediaId: z.string().trim().optional(),
    links: z.array(projectLinkInputSchema),
    gallery: z.array(projectGalleryItemInputSchema),
    /** Task 06.1: Project Team support (section 3). Order is the array
     *  index, same convention as `gallery`/`links` above. */
    team: z.array(teamMemberInputSchema).default([]),
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
