"use client";

import { useId, useMemo, useState } from "react";
import {
  extractYoutubeVideoId,
  getYoutubeThumbnailUrl,
  getYoutubeWatchUrl,
} from "@/lib/media/youtube";

/**
 * Task 06.3, sections 4-8: adding a YouTube video to a Project Gallery.
 * Deliberately a separate flow from "select existing Media"
 * (MediaPickerBrowser) rather than a raw URL field mixed into it —
 * section 17 is explicit that the UX should make the distinction clear
 * ("Select Local Media" vs. "Add YouTube Video").
 *
 * Validation is fully client-side and deterministic (section 6: no
 * network request just to validate a YouTube URL) — the same
 * `extractYoutubeVideoId` this form uses for its live preview is also
 * what the server re-derives from `youtubeUrl` on submit
 * (lib/actions/projects.ts's reconcileYoutubeGalleryItems), so a
 * tampered client payload can't smuggle in a mismatched id.
 */
export type YoutubeGalleryItemDraft = {
  youtubeVideoId: string;
  youtubeUrl: string;
  youtubeTitle: string;
  youtubeThumbnailUrl: string;
};

export default function YoutubeGalleryItemForm({
  onAdd,
  onCancel,
}: {
  onAdd: (item: YoutubeGalleryItemDraft) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [touched, setTouched] = useState(false);
  const urlId = useId();
  const titleId = useId();

  const videoId = useMemo(() => extractYoutubeVideoId(url), [url]);
  const urlError =
    touched && url.trim() && !videoId
      ? "That doesn't look like a valid YouTube URL. Try a youtube.com/watch?v=… or youtu.be/… link."
      : null;

  const canAdd = Boolean(videoId) && title.trim().length > 0;

  function handleAdd() {
    if (!videoId) {
      setTouched(true);
      return;
    }
    if (!title.trim()) return;

    onAdd({
      youtubeVideoId: videoId,
      youtubeUrl: getYoutubeWatchUrl(videoId),
      youtubeTitle: title.trim(),
      youtubeThumbnailUrl: getYoutubeThumbnailUrl(videoId),
    });
    setUrl("");
    setTitle("");
    setTouched(false);
  }

  return (
    <div className="mt-2 rounded-md border border-dashed border-neutral-300 p-2.5 dark:border-neutral-700">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[14rem] flex-1">
          <label
            htmlFor={urlId}
            className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400"
          >
            YouTube URL
          </label>
          <input
            id={urlId}
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="min-w-[10rem] flex-1">
          <label
            htmlFor={titleId}
            className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400"
          >
            Title
          </label>
          <input
            id={titleId}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {urlError ? (
        <p
          role="alert"
          className="mt-1.5 text-xs text-red-600 dark:text-red-400"
        >
          {urlError}
        </p>
      ) : null}

      {videoId ? (
        <div className="mt-2.5 flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getYoutubeThumbnailUrl(videoId)}
            alt=""
            className="h-12 w-20 rounded object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
          />
          <p className="truncate text-sm text-neutral-700 dark:text-neutral-300">
            {title.trim() || "Untitled YouTube video"}
          </p>
        </div>
      ) : null}

      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
