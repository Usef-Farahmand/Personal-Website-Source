import videosData from "./videos.json";
import type { Video } from "@/types/content";

/**
 * Videos live in videos.json — edit that file to add or change entries
 * (see "Videos" in doc/CONTENT_GUIDE_fa.md). videos.schema.json gives
 * editors (VS Code, via .vscode/settings.json) validation and
 * autocomplete; this cast stands in for compile-time checking, same as
 * learning/index.ts. The list is sorted by `publishedDate` in the
 * service, so array order doesn't matter.
 */
export const videos = videosData as unknown as Video[];
