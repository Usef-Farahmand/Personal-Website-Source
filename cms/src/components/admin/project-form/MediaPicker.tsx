"use client";

import { useId, useState } from "react";
import MediaUploader from "@/components/admin/media/MediaUploader";
import MediaPickerBrowser from "@/components/admin/media/MediaPickerBrowser";
import type { MediaOption } from "@/lib/queries/projects";
import { MEDIA_TYPE_LABELS, type MediaType } from "@/lib/validation/shared";

/**
 * Task 06.3, section 1: replaces the plain `<select>` this component
 * used to render with a searchable picker (MediaPickerBrowser) so
 * finding the right item doesn't mean scrolling a long native dropdown.
 * External API (name/label/initialMediaId/mediaOptions/allowedTypes) is
 * unchanged — ProjectForm (Logo, Cover) and ArticleForm (Header image)
 * don't need touching.
 */
export default function MediaPicker({
  name,
  label,
  initialMediaId,
  mediaOptions,
  allowedTypes,
}: {
  name: string;
  label: string;
  initialMediaId?: string | null;
  mediaOptions: MediaOption[];
  allowedTypes: MediaType[];
}) {
  const [options, setOptions] = useState(mediaOptions);
  const [selectedId, setSelectedId] = useState(initialMediaId ?? "");
  const [showBrowser, setShowBrowser] = useState(!initialMediaId);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const labelId = useId();

  const selected = options.find((option) => option.id === selectedId);

  function select(media: MediaOption) {
    setSelectedId(media.id);
    setShowBrowser(false);
    setShowQuickAdd(false);
  }

  function clearSelection() {
    setSelectedId("");
    setShowBrowser(true);
  }

  return (
    <div>
      <p
        id={labelId}
        className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </p>

      {selected ? (
        <div className="mb-2 flex flex-wrap items-center gap-2.5">
          {selected.thumbnail || selected.source ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.thumbnail || selected.source}
              alt=""
              className="h-10 w-10 rounded object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
            />
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {selected.title || selected.originalFilename || selected.source}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {MEDIA_TYPE_LABELS[selected.type]}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBrowser((v) => !v)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            Change
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            Clear
          </button>
        </div>
      ) : (
        <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          None selected.
        </p>
      )}

      {showBrowser ? (
        <MediaPickerBrowser
          options={options}
          allowedTypes={allowedTypes}
          onSelect={select}
          autoFocus
        />
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {!showBrowser ? (
          <button
            type="button"
            onClick={() => setShowBrowser(true)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            Browse media…
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setShowQuickAdd((v) => !v)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          {showQuickAdd ? "Cancel" : "+ New media"}
        </button>
      </div>

      {showQuickAdd ? (
        <MediaUploader
          allowedTypes={allowedTypes}
          compact
          onUploaded={(media) => {
            setOptions((current) => [media, ...current]);
            select(media);
          }}
        />
      ) : null}

      <input
        type="hidden"
        name={name}
        value={selectedId}
        aria-labelledby={labelId}
      />
    </div>
  );
}
