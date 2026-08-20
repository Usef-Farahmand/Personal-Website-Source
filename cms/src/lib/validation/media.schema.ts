import { z } from "zod";
import { mediaTypeSchema, nonEmptyString, urlSchema } from "./shared";

/**
 * Validates a Media record before it is written to the database. Used by
 * any future service that creates/updates Media, and by ProjectTranslation
 * gallery references that need to confirm a referenced Media id exists.
 *
 * No upload handling yet (Task 01 explicitly defers the Media Library UI)
 * — `source` is just a path or URL string at this stage.
 */
export const mediaInputSchema = z.object({
  type: mediaTypeSchema,
  title: nonEmptyString.optional(),
  description: z.string().trim().optional(),
  source: nonEmptyString,
  thumbnail: z.string().trim().optional(),
  downloadable: z.boolean().default(false),
  downloadUrl: urlSchema.optional(),
});

export type MediaInput = z.infer<typeof mediaInputSchema>;
