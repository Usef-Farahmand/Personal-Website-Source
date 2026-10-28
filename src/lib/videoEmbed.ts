import { resolveYoutubeVideoId } from "@/lib/youtube";
import type { MediaItem } from "@/types/media";

export type VideoEmbed = {
  provider: "youtube" | "aparat";
  embedUrl: string;
  /** The public page, for "open the original" when embedding fails. */
  pageUrl: string;
};

/** aparat.com/v/{hash} (also with a trailing slug or query). */
const APARAT_PAGE = /^https?:\/\/(?:www\.)?aparat\.com\/v\/([A-Za-z0-9]+)/;
/** Already an embed URL: aparat.com/video/video/embed/videohash/{hash}/... */
const APARAT_EMBED =
  /^https?:\/\/(?:www\.)?aparat\.com\/video\/video\/embed\/videohash\/([A-Za-z0-9]+)/;

function aparatHash(url: string): string | null {
  return url.match(APARAT_PAGE)?.[1] ?? url.match(APARAT_EMBED)?.[1] ?? null;
}

/**
 * The official embed player for a platform video, or null for anything
 * else (a direct video file, an image, ...). `youtube` items always go
 * here; a `video` item whose `src` is a YouTube or Aparat page (not a
 * file) is embedded too rather than fed to <video>, which can't play a
 * web page.
 */
export function resolveVideoEmbed(item: MediaItem): VideoEmbed | null {
  if (item.type !== "youtube" && item.type !== "video") return null;

  const hash = aparatHash(item.src);
  if (hash) {
    return {
      provider: "aparat",
      embedUrl: `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame`,
      pageUrl: `https://www.aparat.com/v/${hash}`,
    };
  }

  const youtubeId = resolveYoutubeVideoId(item);
  if (youtubeId) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
      pageUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    };
  }

  return null;
}
