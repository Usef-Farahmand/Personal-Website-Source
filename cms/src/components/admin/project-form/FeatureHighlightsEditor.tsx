"use client";

import { useState } from "react";
import type { FeatureHighlightInput } from "@/lib/validation/project.schema";

type Row = FeatureHighlightInput & { key: string };

let rowIdCounter = 0;
function nextKey() {
  rowIdCounter += 1;
  return `feature-${rowIdCounter}`;
}

/**
 * Editor for one locale's ProjectTranslation.featureHighlights (Task
 * 06.1). `icon` is a free-text field rather than a `<select>` of the
 * public site's FeatureHighlightIcon union — that union lives in the
 * public website package, not this CMS (see project.schema.ts), so
 * duplicating its values here would be a second source of truth for an
 * enum this package doesn't own.
 */
export default function FeatureHighlightsEditor({
  name,
  label,
  initialValues,
  dir,
}: {
  name: string;
  label: string;
  initialValues: FeatureHighlightInput[];
  dir?: "ltr" | "rtl";
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    initialValues.map((value) => ({ ...value, key: nextKey() }))
  );

  function updateRow(key: string, patch: Partial<FeatureHighlightInput>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row))
    );
  }

  function addRow() {
    setRows((current) => [
      ...current,
      { key: nextKey(), icon: "", title: "", description: "" },
    ]);
  }

  function removeRow(key: string) {
    setRows((current) => current.filter((row) => row.key !== key));
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </p>

      {rows.length > 0 ? (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="space-y-2 rounded-md border border-neutral-200 p-2 dark:border-neutral-800"
            >
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={row.icon}
                  onChange={(event) =>
                    updateRow(row.key, { icon: event.target.value })
                  }
                  placeholder="Icon (e.g. customization)"
                  aria-label="Feature icon"
                  className="min-w-[9rem] rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <input
                  type="text"
                  dir={dir}
                  value={row.title}
                  onChange={(event) =>
                    updateRow(row.key, { title: event.target.value })
                  }
                  placeholder="Title"
                  aria-label="Feature title"
                  className="min-w-[10rem] flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  aria-label={`Remove ${row.title || "feature highlight"}`}
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
              <textarea
                dir={dir}
                rows={2}
                value={row.description}
                onChange={(event) =>
                  updateRow(row.key, { description: event.target.value })
                }
                placeholder="Description"
                aria-label="Feature description"
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No feature highlights yet.
        </p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
      >
        + Add feature highlight
      </button>

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          rows
            .filter(
              (row) =>
                row.icon.trim() && row.title.trim() && row.description.trim()
            )
            .map(({ icon, title, description }) => ({
              icon,
              title,
              description,
            }))
        )}
      />
    </div>
  );
}
