"use client";

import { useId, useRef, useState } from "react";
import type { MediaOption } from "@/lib/queries/projects";
import { MEDIA_TYPE_LABELS, type MediaType } from "@/lib/validation/shared";

/**
 * Section 12/13: "Do NOT create a separate Project-specific upload
 * implementation if the reusable Media Library can handle it." This
 * component is that one reusable implementation — it posts to
 * /api/media/upload and is used both by the full Media Library page
 * (/admin/media) and, in `compact` mode, by MediaPicker/GalleryEditor's
 * "+ New media" flow inside the Project/Article editors. There is no
 * second upload code path anywhere in the CMS.
 */

const ACCEPT_BY_TYPE: Record<MediaType, string> = {
  IMAGE: ".jpg,.jpeg,.png,.webp,.gif,image/*",
  VIDEO: ".mp4,.webm,.mov,video/*",
  PDF: ".pdf,application/pdf",
};

export default function MediaUploader({
  allowedTypes,
  onUploaded,
  compact = false,
}: {
  allowedTypes: MediaType[];
  onUploaded: (media: MediaOption) => void;
  /** Compact mode drops the description field and downloadable toggle —
   *  used inline within a Project/Article editor, where the full Media
   *  Library's richer metadata form would be more chrome than that
   *  moment calls for. Those fields can always be filled in later from
   *  the Media Library itself. */
  compact?: boolean;
}) {
  const [type, setType] = useState<MediaType>(allowedTypes[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [downloadable, setDownloadable] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("type", type);
    if (title.trim()) formData.set("title", title.trim());
    if (!compact && description.trim()) {
      formData.set("description", description.trim());
    }
    formData.set("downloadable", compact ? "false" : String(downloadable));

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Upload failed. Please try again.");
        return;
      }

      onUploaded(result.media as MediaOption);
      setTitle("");
      setDescription("");
      setDownloadable(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-end gap-2 rounded-md border border-dashed border-neutral-300 p-2.5 dark:border-neutral-700">
      {allowedTypes.length > 1 ? (
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
                {MEDIA_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="min-w-[12rem] flex-1">
        <label
          htmlFor={inputId}
          className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400"
        >
          File
        </label>
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_BY_TYPE[type]}
          className="block w-full text-sm text-neutral-700 file:mr-2 file:rounded-md file:border file:border-neutral-300 file:bg-white file:px-2 file:py-1 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-50 dark:text-neutral-300 dark:file:border-neutral-700 dark:file:bg-neutral-900 dark:file:text-neutral-300"
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

      {!compact ? (
        <>
          <div className="min-w-[14rem] flex-1">
            <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <label className="flex items-center gap-1.5 pb-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={downloadable}
              onChange={(event) => setDownloadable(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-neutral-300 text-blue-600 dark:border-neutral-700"
            />
            Downloadable
          </label>
        </>
      ) : null}

      <button
        type="button"
        onClick={handleUpload}
        disabled={isUploading}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
      >
        {isUploading ? "Uploading…" : "Upload"}
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
