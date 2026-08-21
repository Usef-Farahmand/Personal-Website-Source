"use server";

import { unlink } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getMediaUsage } from "@/lib/queries/media";
import { resolveUploadAbsolutePath } from "@/lib/media/storage";
import { mediaMetadataUpdateSchema } from "@/lib/validation/media.schema";

/**
 * Task 06 replaces the old URL-only `createMediaQuick` quick-add action
 * (Task 01/02) with the real upload pipeline in
 * api/media/upload/route.ts. This file now covers what happens *after*
 * a Media row exists: editing its metadata (section 10) and deleting it
 * (section 11).
 */

export type MediaMetadataFormState = {
  errors: Record<string, string[]>;
  formError?: string;
} | null;

/**
 * Edits title/description/downloadable/downloadUrl only (section 10).
 * The underlying file is not replaceable in this task — see deliverables:
 * Assumptions for why that's a deliberate scope decision, not an
 * oversight.
 */
export async function updateMediaMetadata(
  id: string,
  _prevState: MediaMetadataFormState,
  formData: FormData
): Promise<MediaMetadataFormState> {
  const parsed = mediaMetadataUpdateSchema.safeParse({
    title: (formData.get("title") as string | null) || undefined,
    description: (formData.get("description") as string | null) || undefined,
    downloadable: formData.get("downloadable") === "on",
    downloadUrl: (formData.get("downloadUrl") as string | null) || undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return { errors };
  }

  try {
    await prisma.media.update({
      where: { id },
      data: {
        title: parsed.data.title || null,
        description: parsed.data.description || null,
        downloadable: parsed.data.downloadable,
        downloadUrl: parsed.data.downloadUrl || null,
      },
    });
  } catch {
    return {
      errors: {},
      formError: "Couldn't save this media item. Please try again.",
    };
  }

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${id}`);
  return { errors: {} };
}

function describeUsage(
  usage: Awaited<ReturnType<typeof getMediaUsage>>
): string {
  const projectCount = new Set(usage.projects.map((p) => p.id)).size;
  const parts: string[] = [];
  if (projectCount > 0) {
    parts.push(`${projectCount} project${projectCount === 1 ? "" : "s"}`);
  }
  if (usage.articles.length > 0) {
    parts.push(
      `${usage.articles.length} article${usage.articles.length === 1 ? "" : "s"}`
    );
  }
  return parts.join(" and ");
}

/**
 * Deletion (section 11). Takes the safer of the two options the task
 * allows: if the item is still referenced by any Project (logo, cover,
 * or gallery) or Article (header image), deletion is refused outright
 * — never "confirm and silently remove the relationships" — so a
 * Project/Article can never end up pointing at a Media row that no
 * longer exists. The person has to detach it from wherever it's used
 * first, in that content's own editor.
 *
 * Only once nothing references it does this remove the DB row and (per
 * section 21) its on-disk file.
 */
export async function deleteMedia(id: string): Promise<{ error?: string }> {
  const usage = await getMediaUsage(id);
  const isUsed = usage.projects.length > 0 || usage.articles.length > 0;

  if (isUsed) {
    return {
      error: `This media is currently used by ${describeUsage(usage)}. Remove it there first, then delete it here.`,
    };
  }

  const media = await prisma.media.findUnique({
    where: { id },
    select: { source: true },
  });
  if (!media) {
    return { error: "This media item no longer exists." };
  }

  try {
    await prisma.media.delete({ where: { id } });
  } catch {
    return { error: "Couldn't delete this media item. Please try again." };
  }

  // Storage cleanup (section 21) — only ever touches a file this
  // upload pipeline actually wrote (see resolveUploadAbsolutePath);
  // silently does nothing for pre-Task-06 quick-add-by-URL rows, which
  // never had a real local file to begin with.
  const absolutePath = resolveUploadAbsolutePath(media.source);
  if (absolutePath) {
    try {
      await unlink(absolutePath);
    } catch {
      // Best-effort. The DB row is already gone and there's nothing
      // actionable to show the person for a stray file on disk — not
      // treated as a delete failure (section 21: no complicated
      // garbage collector needed for this rare edge case).
    }
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/articles");
  return {};
}
