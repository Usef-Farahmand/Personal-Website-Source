"use client";

import { useId, useState } from "react";
import MediaUploader from "@/components/admin/media/MediaUploader";
import type { MediaOption } from "@/lib/queries/projects";
import type { MediaType } from "@/lib/validation/shared";

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
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const selectId = useId();

  const filtered = options.filter((option) =>
    allowedTypes.includes(option.type)
  );
  const selected = filtered.find((option) => option.id === selectedId);

  return (
    <div>
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {selected?.thumbnail || selected?.source ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selected.thumbnail || selected.source}
            alt=""
            className="h-10 w-10 rounded object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
          />
        ) : null}

        <select
          id={selectId}
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          className="min-w-[14rem] flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <option value="">None</option>
          {filtered.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title || option.source}
            </option>
          ))}
        </select>

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
            setSelectedId(media.id);
            setShowQuickAdd(false);
          }}
        />
      ) : null}

      <input type="hidden" name={name} value={selectedId} />
    </div>
  );
}
