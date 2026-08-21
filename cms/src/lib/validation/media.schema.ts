import { z } from "zod";
import { mediaTypeSchema, urlSchema } from "./shared";

/**
 * Task 06: the Media Library's real upload pipeline. `mediaInputSchema`
 * (Task 01/02, URL-only quick-add) is gone — every Media row is now
 * created by the /api/media/upload Route Handler from an actual
 * uploaded file, not typed in as a path/URL string. See
 * lib/media/storage.ts for the file-level validation (extension, MIME,
 * size, byte-signature) that happens before any of these schemas run;
 * these only validate the accompanying form fields.
 */

/** The small set of optional text fields a person can attach to an
 *  upload alongside the file itself — used by the Route Handler to
 *  validate `formData` fields that aren't the file. */
export const mediaUploadFieldsSchema = z.object({
  type: mediaTypeSchema,
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  downloadable: z.boolean().default(false),
});
export type MediaUploadFields = z.infer<typeof mediaUploadFieldsSchema>;

/**
 * Metadata edit (section 10): title, description, downloadable — the
 * only fields the Media Library allows changing after upload. The
 * underlying file is intentionally not replaceable in this task (see
 * deliverables: Assumptions) and `downloadUrl` remains an optional
 * override for the rare case where the public site's Download action
 * should point somewhere other than `source` itself.
 */
export const mediaMetadataUpdateSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  downloadable: z.boolean().default(false),
  downloadUrl: z.union([urlSchema, z.literal("")]).optional(),
});
export type MediaMetadataUpdate = z.infer<typeof mediaMetadataUpdateSchema>;

/** Media Library list/filter params (section 8). */
export const MEDIA_TYPE_FILTER_OPTIONS = [
  "ALL",
  "IMAGE",
  "VIDEO",
  "PDF",
] as const;
export const mediaTypeFilterSchema = z.enum(MEDIA_TYPE_FILTER_OPTIONS);
export type MediaTypeFilter = z.infer<typeof mediaTypeFilterSchema>;
