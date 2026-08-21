"use client";

import { useState } from "react";
import { QuickAddMedia } from "./MediaPicker";
import type { MediaOption } from "@/lib/queries/projects";
import type { MediaType } from "@/lib/validation/shared";

const GALLERY_MEDIA_TYPES: MediaType[] = ["IMAGE", "VIDEO"];

export default function GalleryEditor({
  name,
  initialItems,
  mediaOptions,
}: {
  name: string;
  initialItems: MediaOption[];
  mediaOptions: MediaOption[];
}) {
  const [items, setItems] = useState<MediaOption[]>(initialItems);
  const [options, setOptions] = useState(mediaOptions);
  const [pendingPick, setPendingPick] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const galleryEligible = options.filter((option) =>
    GALLERY_MEDIA_TYPES.includes(option.type)
  );
  const addable = galleryEligible.filter(
    (option) => !items.some((item) => item.id === option.id)
  );

  function addExisting() {
    const media = galleryEligible.find((option) => option.id === pendingPick);
    if (!media) return;
    setItems((current) => [...current, media]);
    setPendingPick("");
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function move(id: string, direction: -1 | 1) {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Gallery
      </p>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-md border border-neutral-200 p-2 dark:border-neutral-800"
            >
              {item.thumbnail || item.source ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail || item.source}
                  alt=""
                  className="h-10 w-10 rounded object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
                />
              ) : (
                <div className="h-10 w-10 rounded bg-neutral-100 dark:bg-neutral-800" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {item.title || item.source}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.type}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(item.id, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${item.title || "item"} up`}
                  className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(item.id, 1)}
                  disabled={index === items.length - 1}
                  aria-label={`Move ${item.title || "item"} down`}
                  className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.title || "item"} from gallery`}
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
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No gallery items yet.
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          value={pendingPick}
          onChange={(event) => setPendingPick(event.target.value)}
          aria-label="Add existing media to gallery"
          className="min-w-[14rem] rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <option value="">Select existing media…</option>
          {addable.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title || option.source} ({option.type})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addExisting}
          disabled={!pendingPick}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          Add to gallery
        </button>
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
          allowedTypes={GALLERY_MEDIA_TYPES}
          onCreated={(media) => {
            setOptions((current) => [media, ...current]);
            setItems((current) => [...current, media]);
            setShowQuickAdd(false);
          }}
        />
      ) : null}

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(items.map((item) => ({ mediaId: item.id })))}
      />
    </div>
  );
}
