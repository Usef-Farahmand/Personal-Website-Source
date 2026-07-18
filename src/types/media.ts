/**
 * Universal Media Viewer types.
 *
 * "video" is deliberately not a member of MediaFileType yet — the
 * requirement is that adding it later doesn't require architecture
 * changes, not that it's supported today. When it is: add "video" here,
 * add one render branch in MediaViewer, done. No other file changes.
 */
export type MediaFileType = "image" | "pdf";

export interface MediaItem {
  type: MediaFileType;
  url: string;
  /** Accessible description — required semantically for images, optional
   *  for PDFs (used as the dialog title either way). */
  alt?: string;
  title?: string;
}

/**
 * Distinguishes a locally-hosted asset (view in the modal) from an
 * external URL (open in a new tab instead — per the External Links
 * requirement). Root-relative paths ("/certificates/x.png") are local;
 * anything with an http(s) scheme is treated as external, regardless of
 * which domain it points to. This is a deliberately simple heuristic — a
 * full same-origin check would need to know the request's own origin,
 * which isn't reliably available in every context this runs in (client
 * components, at minimum), and root-relative-vs-absolute-URL is already
 * an unambiguous, correct signal for how this codebase actually
 * references local media (see Achievement.media in content/types.ts).
 */
export function isExternalMediaUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
