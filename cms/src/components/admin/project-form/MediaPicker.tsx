"use client";

import { useId, useState, useTransition } from "react";
import { createMediaQuick } from "@/lib/actions/media";
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
        <QuickAddMedia
          allowedTypes={allowedTypes}
          onCreated={(media) => {
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

/**
 * Shared quick-add sub-form for MediaPicker and GalleryEditor: a
 * minimal type + source path/URL (+ optional title) referenced by a
 * new Media row (no upload — section 12). Calls the server action
 * directly rather than nesting a second `<form>` inside the Project
 * form, which HTML doesn't allow.
 */
export function QuickAddMedia({
  allowedTypes,
  onCreated,
}: {
  allowedTypes: MediaType[];
  onCreated: (media: MediaOption) => void;
}) {
  const [type, setType] = useState<MediaType>(allowedTypes[0]);
  const [source, setSource] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createMediaQuick({ type, source, title });
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.media) onCreated(result.media);
    });
  }

  return (
    <div className="mt-2 flex flex-wrap items-end gap-2 rounded-md border border-dashed border-neutral-300 p-2.5 dark:border-neutral-700">
      <div>
        <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">
          Type
        </label>
        <select
          value={type}
          onChange={(event) => setType(event.target.value as MediaType)}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          {allowedTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[12rem] flex-1">
        <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">
          Source path or URL
        </label>
        <input
          type="text"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="/media/example.png"
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>
      <div className="min-w-[10rem] flex-1">
        <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">
          Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={isPending || !source.trim()}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
      >
        {isPending ? "Adding…" : "Add"}
      </button>
      {error ? (
        <p
          role="alert"
          className="w-full text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
