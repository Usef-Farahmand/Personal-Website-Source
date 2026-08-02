/**
 * "video" support: local files render with a native <video> element in
 * both the gallery and the lightbox; external video URLs (isExternalMediaUrl)
 * open in a new tab rather than being embedded, since embedding an
 * arbitrary external video host (YouTube, Vimeo, ...) reliably would need
 * a per-provider embed strategy this codebase doesn't have yet — the same
 * "don't guess a provider-specific integration" caution already applied
 * to ArticleCard's platform icons.
 */
export type MediaFileType = "image" | "pdf" | "video";

export interface MediaItem {
  type: MediaFileType;
  url: string;
  /** Accessible description — required semantically for images, optional
   *  for PDFs (used as the dialog title either way). */
  alt?: string;
  title?: string;
  /** Video only. Local files: informs the gallery's duration label without
   *  requiring the browser to load metadata first. External URLs: usually
   *  unknown, so omitted. */
  durationSeconds?: number;
  /** Video only, local files. Shown in the gallery thumbnail before the
   *  video itself loads (loading stays deferred until the lightbox opens,
   *  per the Performance requirement) and as the <video> element's poster
   *  in the lightbox. */
  posterUrl?: string;
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
