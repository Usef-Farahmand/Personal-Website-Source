"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { mediaInputSchema } from "@/lib/validation/media.schema";
import type { MediaOption } from "@/lib/queries/projects";

/**
 * Creates one Media record from a plain object (not a `<form>` submit —
 * called directly from the MediaPicker client component, which is how
 * React Server Functions may be invoked outside a form per Next's
 * Server Actions guide). Section 12: no upload handling here, just a
 * validated local reference — the future Media Library task takes over
 * from here.
 */
export async function createMediaQuick(input: {
  type: string;
  title?: string;
  source: string;
  thumbnail?: string;
}): Promise<{ media?: MediaOption; error?: string }> {
  const parsed = mediaInputSchema.safeParse({
    type: input.type,
    title: input.title || undefined,
    source: input.source,
    thumbnail: input.thumbnail || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid media." };
  }

  try {
    const media = await prisma.media.create({ data: parsed.data });
    revalidatePath("/admin/projects");
    return {
      media: {
        id: media.id,
        type: media.type,
        title: media.title,
        source: media.source,
        thumbnail: media.thumbnail,
      },
    };
  } catch {
    return { error: "Couldn't save that media item. Please try again." };
  }
}
