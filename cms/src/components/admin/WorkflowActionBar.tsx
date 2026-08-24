"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import StatusBadge from "./StatusBadge";
import { describeLocales } from "@/lib/content-workflow";
import { formatDateTime } from "@/lib/format-date";
import type { ContentStatus, Locale } from "@/lib/validation/shared";

/**
 * Task 07, sections 11-15 & 24: the one place a person changes a
 * Project's or Article's status. Saving the form (ProjectForm /
 * ArticleForm) never touches status any more — this bar is the only UI
 * that calls publish/unpublish/archive/restore, and each action requires
 * its own explicit click + confirmation (section 12) before it runs.
 *
 * Deliberately dumb about *which* content type it's editing: the four
 * server actions are passed in as props rather than imported here, so
 * this component doesn't need to know whether it's wired to
 * lib/actions/projects.ts or lib/actions/articles.ts.
 */

type ActionResult = { error?: string };

const BUTTON_BASE =
  "rounded-md border px-3 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
const BUTTON_NEUTRAL = `${BUTTON_BASE} border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900`;
const BUTTON_PRIMARY = `${BUTTON_BASE} border-blue-600 bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-500`;

export default function WorkflowActionBar({
  id,
  contentType,
  title,
  status,
  locales,
  publishedAt,
  previewHref,
  onPublish,
  onUnpublish,
  onArchive,
  onRestore,
}: {
  id: string;
  contentType: "project" | "article";
  /** Best-available display title, for confirmation dialogs and error
   *  copy — falls back to the slug upstream if no translation exists. */
  title: string;
  status: ContentStatus;
  /** Which locales currently have a saved translation — drives the
   *  Publish confirmation's "Translations: …" line and, if the publish
   *  action is rejected, lets the error message name what's missing. */
  locales: Locale[];
  publishedAt: Date | null;
  previewHref: string;
  onPublish: (id: string) => Promise<ActionResult>;
  onUnpublish: (id: string) => Promise<ActionResult>;
  onArchive: (id: string) => Promise<ActionResult>;
  onRestore: (id: string) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const typeLabel = contentType === "project" ? "Project" : "Article";

  function run(
    action: (id: string) => Promise<ActionResult>,
    successParam: string
  ) {
    setError(null);
    startTransition(async () => {
      const result = await action(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`${pathname}?success=${successParam}`);
    });
  }

  function handlePublish() {
    const confirmed = window.confirm(
      [
        `Publish "${title}"?`,
        "",
        `Type: ${typeLabel}`,
        `Translations: ${locales.length > 0 ? describeLocales(locales) : "none"}`,
        "",
        "This moves it from Draft to Published. Published content becomes eligible for the next static export to the public website — it isn't live until that export runs.",
      ].join("\n")
    );
    if (confirmed) run(onPublish, "published");
  }

  function handleUnpublish() {
    const confirmed = window.confirm(
      `Move "${title}" back to Draft?\n\nIt will no longer be eligible for the next static export. Anything already exported to the public website stays live until the site is re-exported.`
    );
    if (confirmed) run(onUnpublish, "unpublished");
  }

  function handleArchive() {
    const confirmed = window.confirm(
      `Archive "${title}"?\n\nArchived content is excluded from publishing entirely. You can restore it to Draft later.`
    );
    if (confirmed) run(onArchive, "archived");
  }

  function handleRestore() {
    const confirmed = window.confirm(`Restore "${title}" to Draft?`);
    if (confirmed) run(onRestore, "restored");
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <StatusBadge status={status} />
          {status === "PUBLISHED" && publishedAt ? (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Published {formatDateTime(publishedAt)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={previewHref} className={BUTTON_NEUTRAL} target="_blank">
            Preview
          </Link>

          {status === "DRAFT" ? (
            <>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPending}
                className={BUTTON_PRIMARY}
              >
                Publish
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={isPending}
                className={BUTTON_NEUTRAL}
              >
                Archive
              </button>
            </>
          ) : null}

          {status === "PUBLISHED" ? (
            <>
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={isPending}
                className={BUTTON_NEUTRAL}
              >
                Unpublish
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={isPending}
                className={BUTTON_NEUTRAL}
              >
                Archive
              </button>
            </>
          ) : null}

          {status === "ARCHIVED" ? (
            <button
              type="button"
              onClick={handleRestore}
              disabled={isPending}
              className={BUTTON_PRIMARY}
            >
              Restore to Draft
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
