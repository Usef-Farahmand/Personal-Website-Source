/**
 * Task 06.3, sections 5-7: turning a pasted YouTube URL into the
 * canonical video id, plus deriving a thumbnail from that id.
 *
 * Deliberately pure/deterministic — no network request is made just to
 * validate or preview a YouTube video (section 6). This module is
 * imported from both the client (YoutubeGalleryItemForm's live preview)
 * and the server (project.schema.ts's validation) and must stay free of
 * Node-only APIs so both bundles can use it.
 */

/** Hostnames this CMS treats as "a YouTube URL" for gallery purposes. */
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

/** YouTube video ids are always exactly 11 characters from this alphabet. */
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function asVideoId(candidate: string | null | undefined): string | null {
  if (!candidate) return null;
  return VIDEO_ID_PATTERN.test(candidate) ? candidate : null;
}

/**
 * Extracts the canonical 11-character video id from a YouTube URL.
 * Supports, at minimum (section 5):
 *   - https://www.youtube.com/watch?v=VIDEO_ID (plus extra query params
 *     like &t=, &list=, which are simply ignored)
 *   - https://youtu.be/VIDEO_ID
 * Also recognizes /embed/, /shorts/, and /live/ links, since a person
 * pasting a link from YouTube's own "Share" or "Embed" panel commonly
 * gets one of those instead of a /watch URL.
 *
 * Returns null for anything that isn't a recognizable YouTube video
 * URL — the caller is responsible for turning that into a validation
 * error (section 6). Never throws.
 */
export function extractYoutubeVideoId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return null;

  if (host === "youtu.be") {
    const [firstSegment] = url.pathname.split("/").filter(Boolean);
    return asVideoId(firstSegment);
  }

  if (url.pathname === "/watch") {
    return asVideoId(url.searchParams.get("v"));
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (
    segments.length >= 2 &&
    (segments[0] === "embed" ||
      segments[0] === "shorts" ||
      segments[0] === "live")
  ) {
    return asVideoId(segments[1]);
  }

  return null;
}

/**
 * The standard YouTube thumbnail URL derivable purely from a video id
 * (section 7) — no API call, no download. `hqdefault` is used because
 * it's guaranteed to exist for every public video (unlike `maxresdefault`,
 * which is only generated for some uploads).
 */
export function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/** Canonical watch URL for a video id — used to normalize whatever URL
 *  shape the person originally pasted isn't stored as the only source
 *  of truth (section 5). */
export function getYoutubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
