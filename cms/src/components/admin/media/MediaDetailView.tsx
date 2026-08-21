"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  updateMediaMetadata,
  type MediaMetadataFormState,
} from "@/lib/actions/media";
import { formatDateTime } from "@/lib/format-date";
import { formatFileSize } from "@/lib/format-file-size";
import { MEDIA_TYPE_LABELS } from "@/lib/validation/shared";
import type { MediaDetail, MediaUsage } from "@/lib/queries/media";
import MediaTypeBadge from "./MediaTypeBadge";
import DeleteMediaButton from "./DeleteMediaButton";

const initialState: MediaMetadataFormState = null;

export default function MediaDetailView({
  media,
  usage,
}: {
  media: MediaDetail;
  usage: MediaUsage;
}) {
  const boundAction = updateMediaMetadata.bind(null, media.id);
  const [state, formAction, isPending] = useActionState<
    MediaMetadataFormState,
    FormData
  >(boundAction, initialState);

  const errors = state?.errors ?? {};
  const isUsed = usage.projects.length > 0 || usage.articles.length > 0;
  const displayName = media.title || media.originalFilename || "Untitled media";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {displayName}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <MediaTypeBadge type={media.type} />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {formatFileSize(media.fileSize)}
            </span>
          </div>

          {/* Admin-only preview (section 17) — not the public site's
              Viewer, which has its own zoom/gallery/download UX and is
              explicitly out of scope for this task (section 22). */}
          <div className="mt-4 flex items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
            {media.type === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.source}
                alt=""
                className="max-h-96 w-full object-contain"
              />
            ) : media.type === "VIDEO" ? (
              <video src={media.source} controls className="max-h-96 w-full" />
            ) : (
              <iframe
                src={media.source}
                title={displayName}
                className="h-96 w-full"
              />
            )}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Edit metadata
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            The uploaded file itself can&apos;t be replaced here — upload a new
            item if you need a different file.
          </p>

          <form action={formAction} className="mt-4 space-y-4">
            {state?.formError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
              >
                {state.formError}
              </div>
            ) : null}

            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={media.title ?? ""}
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
              {errors.title ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.title[0]}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={media.description ?? ""}
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                name="downloadable"
                defaultChecked={media.downloadable}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700"
              />
              Downloadable
            </label>

            <div>
              <label
                htmlFor="downloadUrl"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Download URL override (optional)
              </label>
              <input
                id="downloadUrl"
                name="downloadUrl"
                type="text"
                defaultValue={media.downloadUrl ?? ""}
                placeholder="Leave blank to use the uploaded file itself"
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
              {errors.downloadUrl ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.downloadUrl[0]}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </form>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            File details
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500 dark:text-neutral-400">Type</dt>
              <dd className="text-neutral-900 dark:text-neutral-100">
                {MEDIA_TYPE_LABELS[media.type]}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500 dark:text-neutral-400">
                Original file name
              </dt>
              <dd
                className="max-w-[10rem] truncate text-right text-neutral-900 dark:text-neutral-100"
                title={media.originalFilename ?? undefined}
              >
                {media.originalFilename ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500 dark:text-neutral-400">
                File size
              </dt>
              <dd className="text-neutral-900 dark:text-neutral-100">
                {formatFileSize(media.fileSize)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500 dark:text-neutral-400">
                MIME type
              </dt>
              <dd className="text-neutral-900 dark:text-neutral-100">
                {media.mimeType ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500 dark:text-neutral-400">Path</dt>
              <dd
                className="max-w-[10rem] truncate text-right text-neutral-900 dark:text-neutral-100"
                title={media.source}
              >
                {media.source}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500 dark:text-neutral-400">
                Created
              </dt>
              <dd className="text-neutral-900 dark:text-neutral-100">
                {formatDateTime(media.createdAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500 dark:text-neutral-400">
                Updated
              </dt>
              <dd className="text-neutral-900 dark:text-neutral-100">
                {formatDateTime(media.updatedAt)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Used by
          </h2>
          {isUsed ? (
            <ul className="mt-3 space-y-1.5 text-sm">
              {usage.projects.map((project) => (
                <li key={`${project.id}-${project.role}`}>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {project.title}
                  </Link>
                  <span className="text-neutral-400 dark:text-neutral-500">
                    {" "}
                    — {project.role}
                  </span>
                </li>
              ))}
              {usage.articles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {article.title}
                  </Link>
                  <span className="text-neutral-400 dark:text-neutral-500">
                    {" "}
                    — article header
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Not currently used by any Project or Article.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-red-200 p-4 dark:border-red-900/50">
          <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
            Danger zone
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {isUsed
              ? "Remove this media from everything using it (listed above) before it can be deleted."
              : "This permanently deletes the file from local storage."}
          </p>
          <div className="mt-3">
            <DeleteMediaButton
              id={media.id}
              title={displayName}
              disabled={isUsed}
            />
          </div>
        </section>
      </aside>
    </div>
  );
}
