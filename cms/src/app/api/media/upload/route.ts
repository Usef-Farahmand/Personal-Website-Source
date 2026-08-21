import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  MEDIA_TYPE_RULES,
  generateStorageFilename,
  matchesKnownVideoContainer,
  passesSignatureCheck,
  publicSourcePath,
  safeExtensionOf,
  uploadsRootAbs,
} from "@/lib/media/storage";
import { mediaUploadFieldsSchema } from "@/lib/validation/media.schema";
import type { MediaOption } from "@/lib/queries/media";

/**
 * Local file upload for the Media Library (section 5). A Route Handler
 * rather than a Server Action: Server Actions cap request bodies at
 * 1MB by default (Next's own guidance is to raise
 * `experimental.serverActions.bodySizeLimit` for anything bigger), and
 * this endpoint needs to comfortably accept a multi-hundred-MB video.
 * Route Handlers reading `request.formData()` have no equivalent
 * framework-imposed ceiling, so the real limit here is the one this
 * file enforces itself (see lib/media/storage.ts's MEDIA_TYPE_RULES).
 *
 * This endpoint is part of the local-only admin app (see cms/package.json's
 * description) — it is never deployed alongside the public website
 * (section 23), so it does not need auth of its own beyond "the CMS
 * only runs on the administrator's machine."
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Couldn't read the upload. Please try again." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "No file was provided." },
      { status: 400 }
    );
  }

  const parsedFields = mediaUploadFieldsSchema.safeParse({
    type: formData.get("type"),
    title: (formData.get("title") as string | null) || undefined,
    description: (formData.get("description") as string | null) || undefined,
    downloadable: formData.get("downloadable") === "true",
  });
  if (!parsedFields.success) {
    return NextResponse.json(
      { error: parsedFields.error.issues[0]?.message ?? "Invalid upload." },
      { status: 400 }
    );
  }
  const fields = parsedFields.data;
  const rules = MEDIA_TYPE_RULES[fields.type];

  // Extension allowlist — checked against the filename itself, not
  // whatever the browser claims the file's MIME type is.
  const extension = safeExtensionOf(file.name);
  if (!extension || !rules.extensions.includes(extension)) {
    return NextResponse.json(
      {
        error: `That file extension isn't allowed for ${fields.type.toLowerCase()} uploads. Allowed: ${rules.extensions.join(", ")}.`,
      },
      { status: 400 }
    );
  }

  // Browser-reported MIME type — a second, independent signal, not a
  // substitute for the extension check above (section 20: "Do not
  // trust the client-provided MIME type alone").
  if (file.type && !rules.mimeTypes.includes(file.type)) {
    return NextResponse.json(
      {
        error: `That file's type (${file.type}) isn't allowed for ${fields.type.toLowerCase()} uploads.`,
      },
      { status: 400 }
    );
  }

  if (file.size > rules.maxSizeBytes) {
    const maxMb = Math.round(rules.maxSizeBytes / (1024 * 1024));
    return NextResponse.json(
      {
        error: `That file is too large. ${fields.type} uploads are limited to ${maxMb}MB.`,
      },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Byte-signature sniff — the actual defense-in-depth check (section
  // 20: prevent executable/script uploads regardless of what extension
  // or MIME type they were given).
  if (!passesSignatureCheck(fields.type, buffer)) {
    return NextResponse.json(
      {
        error:
          "That file's content doesn't match its extension. Upload rejected.",
      },
      { status: 400 }
    );
  }

  const filename = generateStorageFilename(extension);
  const destDirAbs = path.join(uploadsRootAbs(), rules.subdir);

  try {
    await mkdir(destDirAbs, { recursive: true });
    await writeFile(path.join(destDirAbs, filename), buffer);
  } catch {
    return NextResponse.json(
      { error: "Couldn't save the file to local storage. Please try again." },
      { status: 500 }
    );
  }

  const source = publicSourcePath(rules.subdir, filename);

  // Informational only — video containers are too varied to gate the
  // upload on (see lib/media/storage.ts) — surfaced so an administrator
  // can notice an unusual file was accepted, without blocking it.
  const unrecognizedVideoContainer =
    fields.type === "VIDEO" && !matchesKnownVideoContainer(buffer);

  try {
    const media = await prisma.media.create({
      data: {
        type: fields.type,
        title: fields.title,
        description: fields.description,
        source,
        downloadable: fields.downloadable,
        originalFilename: file.name,
        mimeType: file.type || rules.mimeTypes[0],
        fileSize: file.size,
      },
    });

    const option: MediaOption = {
      id: media.id,
      type: media.type,
      title: media.title,
      source: media.source,
      thumbnail: media.thumbnail,
    };

    return NextResponse.json({ media: option, unrecognizedVideoContainer });
  } catch {
    return NextResponse.json(
      {
        error:
          "The file was saved, but the media record couldn't be created. Please try again.",
      },
      { status: 500 }
    );
  }
}
