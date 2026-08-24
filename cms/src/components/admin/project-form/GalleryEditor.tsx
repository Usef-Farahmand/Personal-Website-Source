"use client";

import { useId, useState } from "react";
import MediaUploader from "@/components/admin/media/MediaUploader";
import MediaPickerBrowser from "@/components/admin/media/MediaPickerBrowser";
import YoutubeGalleryItemForm, {
  type YoutubeGalleryItemDraft,
} from "./YoutubeGalleryItemForm";
import type { MediaOption, ProjectGalleryEntry } from "@/lib/queries/projects";
import { MEDIA_TYPE_LABELS, type MediaType } from "@/lib/validation/shared";

const GALLERY_MEDIA_TYPES: MediaType[] = ["IMAGE", "VIDEO"];

/**
 * Task 06.3, sections 3-10: the Project Gallery now holds three kinds of
 * items — local Image, local Video, and YouTube Video — freely ordered
 * together. `GalleryDraftItem` is this component's own in-memory shape
 * for that mixed list (a MEDIA entry wrapping a full MediaOption for
 * rendering, or a YOUTUBE_VIDEO entry carrying its own display fields);
 * it's translated to/from the server's `{type, ...}` JSON shape at the
 * form's edges (see `toInitialDraftItems` and the hidden input below).
 */
type GalleryDraftItem =
  | { localKey: string; type: "MEDIA"; media: MediaOption }
  | ({ localKey: string; type: "YOUTUBE_VIDEO" } & YoutubeGalleryItemDraft);

function toInitialDraftItems(
  entries: ProjectGalleryEntry[]
): GalleryDraftItem[] {
  const items: GalleryDraftItem[] = [];
  for (const entry of entries) {
    if (entry.type === "YOUTUBE_VIDEO") {
      items.push({
        localKey: entry.id,
        type: "YOUTUBE_VIDEO",
        youtubeVideoId: entry.youtubeVideoId ?? "",
        youtubeUrl: entry.youtubeUrl ?? "",
        youtubeTitle: entry.youtubeTitle ?? "",
        youtubeThumbnailUrl: entry.youtubeThumbnailUrl ?? "",
      });
    } else if (entry.media) {
      // A MEDIA row always has its Media relation populated in practice
      // (deleting the Media cascades to deleting this join row — see
      // schema.prisma) — the `entry.media` guard here is just to satisfy
      // the nullable relation type, not a case expected to occur.
      items.push({ localKey: entry.id, type: "MEDIA", media: entry.media });
    }
  }
  return items;
}

function itemLabel(item: GalleryDraftItem): string {
  if (item.type === "YOUTUBE_VIDEO")
    return item.youtubeTitle || "Untitled YouTube video";
  return item.media.title || item.media.originalFilename || item.media.source;
}

function itemThumbnail(item: GalleryDraftItem): string | null {
  if (item.type === "YOUTUBE_VIDEO") return item.youtubeThumbnailUrl || null;
  return item.media.thumbnail || item.media.source || null;
}

function itemTypeLabel(item: GalleryDraftItem): string {
  return item.type === "YOUTUBE_VIDEO"
    ? "YouTube Video"
    : MEDIA_TYPE_LABELS[item.media.type];
}

let localKeySeq = 0;
function nextLocalKey(prefix: string): string {
  localKeySeq += 1;
  return `${prefix}-${Date.now()}-${localKeySeq}`;
}

export default function GalleryEditor({
  name,
  initialItems,
  mediaOptions,
}: {
  name: string;
  initialItems: ProjectGalleryEntry[];
  mediaOptions: MediaOption[];
}) {
  const [items, setItems] = useState<GalleryDraftItem[]>(() =>
    toInitialDraftItems(initialItems)
  );
  const [options, setOptions] = useState(mediaOptions);
  const [activeAdder, setActiveAdder] = useState<"none" | "media" | "youtube">(
    "none"
  );
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const listLabelId = useId();

  const selectedMediaIds = items
    .filter(
      (item): item is Extract<GalleryDraftItem, { type: "MEDIA" }> =>
        item.type === "MEDIA"
    )
    .map((item) => item.media.id);

  function addMedia(media: MediaOption) {
    setItems((current) => [
      ...current,
      { localKey: nextLocalKey("media"), type: "MEDIA", media },
    ]);
    setActiveAdder("none");
  }

  function addYoutube(draft: YoutubeGalleryItemDraft) {
    setItems((current) => [
      ...current,
      { localKey: nextLocalKey("youtube"), type: "YOUTUBE_VIDEO", ...draft },
    ]);
    setActiveAdder("none");
  }

  function removeItem(localKey: string) {
    setItems((current) => current.filter((item) => item.localKey !== localKey));
  }

  function move(localKey: string, direction: -1 | 1) {
    setItems((current) => {
      const index = current.findIndex((item) => item.localKey === localKey);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const hiddenValue = JSON.stringify(
    items.map((item) =>
      item.type === "YOUTUBE_VIDEO"
        ? {
            type: "YOUTUBE_VIDEO",
            youtubeVideoId: item.youtubeVideoId,
            youtubeUrl: item.youtubeUrl,
            youtubeTitle: item.youtubeTitle,
            youtubeThumbnailUrl: item.youtubeThumbnailUrl || undefined,
          }
        : { type: "MEDIA", mediaId: item.media.id }
    )
  );

  return (
    <div>
      <p
        id={listLabelId}
        className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        Gallery
      </p>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => {
            const thumbnail = itemThumbnail(item);
            return (
              <li
                key={item.localKey}
                className="flex items-center gap-3 rounded-md border border-neutral-200 p-2 dark:border-neutral-800"
              >
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt=""
                    className="h-10 w-10 rounded object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-neutral-100 dark:bg-neutral-800" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {itemLabel(item)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {itemTypeLabel(item)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(item.localKey, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${itemLabel(item)} up`}
                    className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item.localKey, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${itemLabel(item)} down`}
                    className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.localKey)}
                    aria-label={`Remove ${itemLabel(item)} from gallery`}
                    className="rounded-md p-1.5 text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path strokeLinecap="round" d="m3 3 10 10m0-10L3 13" />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No gallery items yet.
        </p>
      )}

      {/* Task 06.3, section 17: two distinct, clearly-labeled entry
          points — "Select Local Media" vs. "Add YouTube Video" — rather
          than a raw URL field folded into the local Media picker. */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            setActiveAdder((current) =>
              current === "media" ? "none" : "media"
            )
          }
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          {activeAdder === "media" ? "Cancel" : "Select local media…"}
        </button>
        <button
          type="button"
          onClick={() =>
            setActiveAdder((current) =>
              current === "youtube" ? "none" : "youtube"
            )
          }
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          {activeAdder === "youtube" ? "Cancel" : "+ Add YouTube video"}
        </button>
        <button
          type="button"
          onClick={() => setShowQuickAdd((v) => !v)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          {showQuickAdd ? "Cancel" : "+ Upload new media"}
        </button>
      </div>

      {activeAdder === "media" ? (
        <div className="mt-2">
          <MediaPickerBrowser
            options={options}
            allowedTypes={GALLERY_MEDIA_TYPES}
            excludeIds={selectedMediaIds}
            onSelect={addMedia}
            emptyMessage="No matching images or videos."
            autoFocus
          />
        </div>
      ) : null}

      {activeAdder === "youtube" ? (
        <YoutubeGalleryItemForm
          onAdd={addYoutube}
          onCancel={() => setActiveAdder("none")}
        />
      ) : null}

      {showQuickAdd ? (
        <MediaUploader
          allowedTypes={GALLERY_MEDIA_TYPES}
          compact
          onUploaded={(media) => {
            setOptions((current) => [media, ...current]);
            addMedia(media);
            setShowQuickAdd(false);
          }}
        />
      ) : null}

      <input type="hidden" name={name} value={hiddenValue} />
    </div>
  );
}
