/**
 * Media type is a closed union by design — adding a new one is one new
 * member here plus one new render branch in MediaViewer's type-dispatch
 * (see ImageViewer/VideoPlayer/PdfViewer), not a change anywhere else.
 * Every consumer (ProjectGallery, MediaTrigger, AchievementCard) already
 * works generically over MediaItem, so a fourth type slots in without
 * touching them.
 */
export type MediaFileType = "image" | "pdf" | "video";

export interface MediaItem {
  /** Stable identity — used for the toolbar's per-item zoom/fit state
   *  reset and for React keys in gallery lists, independent of `src`
   *  (which two distinct items could theoretically share, e.g. the same
   *  image reused with a different caption). */
  id: string;
  type: MediaFileType;
  /** Caption shown under the media and used as the dialog's accessible
   *  title. For images, also doubles as the `alt` text — see `src` doc
   *  below for why there's no separate `alt` field. */
  title?: string;
  /** Longer supporting text, shown under the title when present. Kept
   *  distinct from `title` rather than one combined string, matching the
   *  content model's usual title+description split elsewhere
   *  (Project, Achievement, ...). */
  description?: string;
  src: string;
  /** Gallery-thumbnail image. For video, shown instead of a decoded
   *  first frame (cheaper, and avoids implying playback has started).
   *  For image/pdf, optional — the gallery falls back to `src` itself
   *  (an image can thumbnail itself; a PDF without one shows a generic
   *  document glyph instead of attempting to thumbnail a PDF page,
   *  which no plain <img> can do without a rendering step this codebase
   *  doesn't have). */
  thumbnail?: string;
  /** Only needed when the downloadable file differs from `src` itself
   *  (e.g. `src` is a low-res web-optimized image and the original,
   *  full-resolution file lives elsewhere). Falls back to `src` when
   *  absent — see resolveDownloadUrl in MediaViewer. */
  downloadUrl?: string;
  /** Defaults to true when omitted — most media should be downloadable.
   *  Explicit `false` hides the Download action entirely rather than
   *  showing a disabled button, per the requirement. */
  downloadable?: boolean;
  /** Image/video only — informs aspect-ratio-aware layout before the
   *  file itself has loaded. Optional; nothing breaks without it. */
  width?: number;
  height?: number;
  /** Video only, seconds. Local files: informs the gallery's duration
   *  label without requiring the browser to load metadata first. */
  duration?: number;
  /** PDF only. Informational display only ("12 pages" next to the
   *  title) — this codebase's PDF viewer embeds the browser's own native
   *  PDF renderer (see PdfViewer.tsx's doc comment for why), which
   *  already provides real page navigation inside the embed itself, so
   *  this field does not drive a custom page-by-page control. */
  pages?: number;
}
