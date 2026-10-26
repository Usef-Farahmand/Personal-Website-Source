import { videos } from "@/content/videos";
import { extractYoutubeVideoId, getYoutubeThumbnailUrl } from "@/lib/youtube";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedVideo, VideoPlatform } from "@/types/content";

/** Order platforms are offered in; the first one present is the card's
 *  main link. */
export const VIDEO_PLATFORMS: VideoPlatform[] = ["youtube", "instagram"];

/** Newest first — `publishedDate` is the single ordering key. */
export function listVideos(
  locale: Locale,
  options?: ListOptions
): ResolvedVideo[] {
  const all = [...videos]
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .map((video) => resolveTranslation(video, locale) as ResolvedVideo);
  return options?.limit ? all.slice(0, options.limit) : all;
}

export function getVideoPlatforms(video: ResolvedVideo): VideoPlatform[] {
  return VIDEO_PLATFORMS.filter((platform) => Boolean(video.links[platform]));
}

/** The authored cover wins; otherwise YouTube's own thumbnail; otherwise
 *  null (the card shows the brand mark). */
export function getVideoCover(video: ResolvedVideo): string | null {
  if (video.coverImageUrl) return video.coverImageUrl;
  const youtubeId = extractYoutubeVideoId(video.links.youtube);
  return youtubeId ? getYoutubeThumbnailUrl(youtubeId) : null;
}
