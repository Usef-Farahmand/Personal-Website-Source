import path from "node:path";
import { randomUUID } from "node:crypto";
import type { MediaType } from "@/lib/validation/shared";

/**
 * Task 06 local storage layer.
 *
 * Everything an uploaded file needs — where it lives on disk, what its
 * public URL looks like, what's allowed in, and a defense-in-depth check
 * that the bytes actually look like what they claim to be — lives here,
 * so the Route Handler (api/media/upload) and the delete path
 * (lib/actions/media.ts) share one source of truth instead of
 * duplicating path math.
 *
 * Storage layout: `cms/public/uploads/{images,videos,pdfs}/<uuid>.<ext>`.
 * Files under `public/` are served by Next.js automatically at
 * `/uploads/...` — no custom route needed for reads, only for writes.
 * This also keeps the stored `Media.source` value a portable, relative
 * public path (never `C:\Users\...` or any other absolute filesystem
 * path — see prisma/schema.prisma's note on `Media.source`), which is
 * both a Windows-compatibility requirement (section 16) and what makes
 * the future export step a plain file copy instead of a path rewrite.
 */

/** Public URL prefix files are served under — always forward-slash,
 *  regardless of the OS the CMS runs on (this is a URL, not a
 *  filesystem path, so `path.join` — which uses `\` on Windows — must
 *  never be used to build it). */
export const UPLOADS_URL_PREFIX = "/uploads";

export type MediaSubdir = "images" | "videos" | "pdfs";

export type MediaTypeRule = {
  subdir: MediaSubdir;
  /** Lowercase, dot-prefixed, e.g. ".png". The single source of truth
   *  for "what extension is this type allowed to have" — checked
   *  against the uploaded filename, never trusted from anywhere else. */
  extensions: string[];
  /** Browser-reported MIME types accepted for this type. Necessary but
   *  not sufficient on its own (section 20: "do not trust the
   *  client-provided MIME type alone") — always checked alongside the
   *  extension allowlist and, where practical, a byte-signature sniff. */
  mimeTypes: string[];
  maxSizeBytes: number;
};

/**
 * Explicit allowlist per media type. Nothing outside these three types
 * is accepted (section 20: "Allowed types should be explicitly
 * defined") — nothing here is inferred from a client-supplied extension
 * or MIME string alone.
 *
 * Size limits are a practical default for a personal local CMS, not a
 * hard platform constraint — documented as an assumption in the
 * delivery notes; easy to change in one place if too tight or too
 * loose for real content.
 */
export const MEDIA_TYPE_RULES: Record<MediaType, MediaTypeRule> = {
  IMAGE: {
    subdir: "images",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxSizeBytes: 15 * 1024 * 1024, // 15MB
  },
  VIDEO: {
    subdir: "videos",
    // .svg is deliberately excluded from IMAGE — it can embed <script>
    // and is effectively an XML/JS document, not a safe raster format
    // for an upload allowlist.
    extensions: [".mp4", ".webm", ".mov"],
    mimeTypes: ["video/mp4", "video/webm", "video/quicktime"],
    maxSizeBytes: 300 * 1024 * 1024, // 300MB — gameplay clips, trailers
  },
  PDF: {
    subdir: "pdfs",
    extensions: [".pdf"],
    mimeTypes: ["application/pdf"],
    maxSizeBytes: 25 * 1024 * 1024, // 25MB
  },
};

/** Absolute path to `cms/public/uploads` on disk, resolved from the
 *  process cwd (the Next.js app root when run via `next dev`/`next
 *  start`, same assumption `lib/db.ts` makes for the SQLite file). */
export function uploadsRootAbs(): string {
  return path.join(process.cwd(), "public", "uploads");
}

/** Lowercased, dot-prefixed extension from a filename, or `""` if the
 *  filename has none / has an unreasonable one (guards against a
 *  filename like `"virus.exe.png\u0000.sh"` smuggling something odd
 *  through — a legitimate extension is a handful of alphanumeric
 *  characters). */
export function safeExtensionOf(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return /^\.[a-z0-9]{1,5}$/.test(ext) ? ext : "";
}

/**
 * Generates the on-disk filename for a new upload. Never derived from
 * the user's original filename (section 6: "Do not use the original
 * filename directly as the storage filename") — a random UUID sidesteps
 * collisions, unsafe characters, path traversal, and length-limit
 * issues in one move, on every OS the CMS might run on.
 */
export function generateStorageFilename(extension: string): string {
  return `${randomUUID()}${extension}`;
}

/** Builds the portable public path stored in `Media.source`, e.g.
 *  `/uploads/images/<uuid>.png`. Always forward-slash. */
export function publicSourcePath(
  subdir: MediaSubdir,
  filename: string
): string {
  return `${UPLOADS_URL_PREFIX}/${subdir}/${filename}`;
}

/**
 * Resolves a stored `Media.source` value back to an absolute on-disk
 * path for deletion — only for sources this upload pipeline actually
 * wrote (i.e. under `/uploads/...`). Returns `null` for anything else,
 * which covers two safe-by-default cases: (1) pre-Task-06 rows created
 * via the old quick-add-by-URL flow, which never had a real file to
 * begin with, and (2) any value that doesn't resolve to a path inside
 * `public/uploads` after normalization — a defense-in-depth guard
 * against path traversal even though every filename this app itself
 * writes is a random UUID and couldn't contain `..` in the first place.
 */
export function resolveUploadAbsolutePath(source: string): string | null {
  if (!source.startsWith(`${UPLOADS_URL_PREFIX}/`)) return null;

  const relative = source.slice(UPLOADS_URL_PREFIX.length + 1);
  const root = uploadsRootAbs();
  const resolved = path.join(root, relative);

  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) return null;

  return resolved;
}

// ---------------------------------------------------------------------------
// Byte-signature sniffing — defense in depth on top of the extension +
// MIME allowlists. Not a full format validator (that's what "do not
// over-engineer this feature" rules out); just enough to catch the
// realistic threat (an executable or script renamed to look like
// media) without needing a media-parsing dependency.
// ---------------------------------------------------------------------------

const EXECUTABLE_OR_SCRIPT_HEADERS: { bytes: number[]; label: string }[] = [
  { bytes: [0x4d, 0x5a], label: "Windows executable (MZ)" },
  { bytes: [0x7f, 0x45, 0x4c, 0x46], label: "ELF executable" },
  { bytes: [0x23, 0x21], label: "script shebang (#!)" },
];

function startsWithBytes(buffer: Buffer, bytes: number[]): boolean {
  if (buffer.length < bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buffer[i] !== bytes[i]) return false;
  }
  return true;
}

function looksExecutableOrScript(buffer: Buffer): boolean {
  if (
    EXECUTABLE_OR_SCRIPT_HEADERS.some((h) => startsWithBytes(buffer, h.bytes))
  ) {
    return true;
  }
  const head = buffer.subarray(0, 32).toString("latin1").toLowerCase();
  return head.includes("<?php") || head.includes("<script");
}

function matchesImageSignature(buffer: Buffer): boolean {
  if (
    startsWithBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  ) {
    return true; // PNG
  }
  if (startsWithBytes(buffer, [0xff, 0xd8, 0xff])) return true; // JPEG
  if (buffer.subarray(0, 4).toString("ascii") === "GIF8") return true; // GIF
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return true; // WEBP
  }
  return false;
}

function matchesPdfSignature(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

/**
 * ISO base media file format (MP4, MOV): an "ftyp" box, typically at
 * byte offset 4. Or WebM/Matroska: an EBML header. Used only for an
 * informational warning (see the Route Handler) — never to reject a
 * video, since container formats vary too widely to enumerate
 * exhaustively without a media-parsing dependency (section 28 rules out
 * that kind of over-engineering here).
 */
export function matchesKnownVideoContainer(buffer: Buffer): boolean {
  if (
    buffer.length > 12 &&
    buffer.subarray(4, 8).toString("ascii") === "ftyp"
  ) {
    return true;
  }
  if (startsWithBytes(buffer, [0x1a, 0x45, 0xdf, 0xa3])) return true;
  return false;
}

/**
 * Returns `true` if `buffer` is acceptable content for `type`.
 *
 * Images and PDFs are checked strictly against known magic bytes —
 * both formats have simple, well-defined headers, so a mismatch is a
 * strong signal the extension/MIME were spoofed, and this rejects
 * outright.
 *
 * Video containers are far more varied, so video only gets the
 * executable/script rejection, not a positive container match — see
 * `matchesKnownVideoContainer` for the (non-blocking) informational
 * check the Route Handler runs separately.
 */
export function passesSignatureCheck(type: MediaType, buffer: Buffer): boolean {
  if (looksExecutableOrScript(buffer)) return false;

  if (type === "IMAGE") return matchesImageSignature(buffer);
  if (type === "PDF") return matchesPdfSignature(buffer);
  if (type === "VIDEO") return true;
  return false;
}
