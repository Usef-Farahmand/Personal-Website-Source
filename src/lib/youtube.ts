/**
 * YouTube URL parsing, shared by every consumer that needs a video id
 * from a YouTube link rather than a pre-computed one (YoutubeEmbed.tsx,
 * ProjectGallery's thumbnail branch, and any future media type that
 * wants a YouTube embed — see MediaItem.youtubeVideoId's doc comment).
 *
 * `MediaItem.youtubeVideoId` is still honored first when present (the
 * CMS export pipeline computes it once, ahead of time, from its own
 * copy of this same logic — see that field's doc comment). This module
 * exists as the runtime fallback for content that only ever carries the
 * public `src` URL — which today includes every YouTube gallery item
 * actually shipped by the CMS export, since Task 08's pipeline does not
 * currently populate `youtubeVideoId` — so a YouTube item is never
 * silently dropped just because that one field is missing.
 */

/** A valid YouTube video id is always exactly 11 characters from this
 *  set — used both to validate a candidate extracted from a URL and to
 *  validate a `youtubeVideoId` supplied directly on a MediaItem, so a
 *  malformed value in either place is treated as "absent" rather than
 *  passed straight into an iframe `src`. */
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

function isValidVideoId(value: string | null | undefined): value is string {
  return typeof value === "string" && VIDEO_ID_PATTERN.test(value);
}

/**
 * Extracts the 11-character video id from any common YouTube URL shape:
 *  - https://www.youtube.com/watch?v=VIDEO_ID (+ any other query params,
 *    e.g. &t=30s, &list=...)
 *  - https://youtu.be/VIDEO_ID (+ optional query string)
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - the same hosts without "www.", with "m." (mobile), or on the
 *    privacy-enhanced "youtube-nocookie.com" domain
 *
 * Returns null for anything that isn't a recognized YouTube URL, or
 * whose id doesn't match YouTube's own id shape — callers treat null as
 * "could not determine a video id" and fall back gracefully rather than
 * rendering a broken embed.
 */
export function extractYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  const path = parsed.pathname;

  if (host === "youtu.be") {
    // https://youtu.be/VIDEO_ID
    const id = path.split("/").filter(Boolean)[0];
    return isValidVideoId(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (path === "/watch") {
      // https://www.youtube.com/watch?v=VIDEO_ID
      const id = parsed.searchParams.get("v");
      return isValidVideoId(id) ? id : null;
    }

    const segments = path.split("/").filter(Boolean);
    // https://www.youtube.com/shorts/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    if (
      segments.length >= 2 &&
      (segments[0] === "shorts" || segments[0] === "embed")
    ) {
      const id = segments[1];
      return isValidVideoId(id) ? id : null;
    }
  }

  return null;
}

/**
 * Resolves the video id to actually use for a gallery item: prefers an
 * already-supplied `youtubeVideoId` (validated, not trusted blindly —
 * see VIDEO_ID_PATTERN above), falling back to parsing `src`. Centralized
 * here so YoutubeEmbed and ProjectGallery's thumbnail branch can't drift
 * out of sync on which one wins.
 */
export function resolveYoutubeVideoId(item: {
  youtubeVideoId?: string;
  src?: string;
}): string | null {
  if (isValidVideoId(item.youtubeVideoId)) return item.youtubeVideoId;
  return extractYoutubeVideoId(item.src);
}

/** Standard YouTube thumbnail CDN URL for a given video id — same host
 *  (img.youtube.com) already allow-listed in next.config.ts for gallery
 *  thumbnails. `hqdefault.jpg` is used because, unlike `maxresdefault.jpg`,
 *  it's guaranteed to exist for every public video. */
export function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
