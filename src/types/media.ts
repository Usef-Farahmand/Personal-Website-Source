/**
 * Media type is a closed union by design — adding a new one is one new
 * member here plus one new render branch in MediaViewer's type-dispatch
 * (see ImageViewer/VideoPlayer/PdfViewer), not a change anywhere else.
 * Every consumer (ProjectGallery, MediaTrigger, AchievementCard) already
 * works generically over MediaItem, so a fourth type slots in without
 * touching them.
 */
export type MediaFileType = "image" | "pdf" | "video" | "youtube";

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
  /** Strict opt-in: the Download action only renders when this is
   *  literally `true`, not merely "not false". This is a deliberate
   *  tightening from an earlier version of this type, where omitting
   *  the field defaulted to downloadable — that default worked fine for
   *  this site's own content, but doesn't hold up as "prepare the
   *  architecture for future permission-based downloads": a
   *  CMS-authored item with no opinion on downloadability should not
   *  silently become downloadable, especially once real permission
   *  logic (licensing, an achievement issuer's terms, ...) sits behind
   *  this field. Existing content was updated to set this explicitly
   *  rather than relying on the old default — see the content data
   *  files for what's actually downloadable today. */
  downloadable?: boolean;
  /** A media item's own file (`src`) is always what opens in the
   *  viewer — this is a *separate*, optional external page the media
   *  came from or can be verified against (a Credly credential page, a
   *  certificate verification URL, the article this image illustrates,
   *  ...). Surfaced as an explicit "Open Original Source" toolbar
   *  action (label overridable via `externalLabel`) rather than an
   *  automatic redirect: the visitor sees the media first, and leaving
   *  the site is always their own deliberate click, never a surprise. */
  externalUrl?: string;
  /** Overrides the toolbar action's default "Open Original Source"
   *  label — e.g. "Verify Credential", "Read on Medium", "View
   *  Repository" — so the action reads specifically rather than
   *  generically when the content author wants that. */
  externalLabel?: string;
  /** Information Panel content — a closed, named shape rather than a
   *  generic key-value bag, matching this codebase's established
   *  preference for explicit fields over speculative flexibility (see
   *  ProjectFeatureHighlight, ProjectChallenge for the same reasoning).
   *  Every field is optional and hidden automatically when absent — see
   *  MediaInfoPanel. */
  metadata?: {
    date?: string;
    organization?: string;
    author?: string;
    source?: string;
    category?: string;
  };
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
  /** Task 08 (CMS export bridge): required when `type` is `"youtube"`,
   *  unused otherwise. The canonical 11-character YouTube video id
   *  (see the CMS's lib/media/youtube.ts, which is where this is
   *  originally derived) — kept as a separate field rather than parsed
   *  back out of `src` at render time, since `src`/`externalUrl` for a
   *  youtube item point at the public `watch?v=` URL (for the
   *  "Download"/"Open Original Source" toolbar actions), not something
   *  a player embed should re-parse. See YoutubeEmbed.tsx. */
  youtubeVideoId?: string;
}
