"use client";

import { useState } from "react";
import {
  PROJECT_LINK_TYPES,
  PROJECT_LINK_TYPE_LABELS,
  type ProjectLinkInput,
} from "@/lib/validation/project.schema";

type LinkRow = ProjectLinkInput & { key: string };

let rowIdCounter = 0;
function nextKey() {
  rowIdCounter += 1;
  return `link-${rowIdCounter}`;
}

export default function LinksEditor({
  name,
  initialValues,
}: {
  name: string;
  initialValues: ProjectLinkInput[];
}) {
  const [rows, setRows] = useState<LinkRow[]>(() =>
    initialValues.map((value) => ({ ...value, key: nextKey() }))
  );

  function updateRow(key: string, patch: Partial<ProjectLinkInput>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row))
    );
  }

  function addRow() {
    setRows((current) => [
      ...current,
      { key: nextKey(), type: "OTHER", label: "", url: "" },
    ]);
  }

  function removeRow(key: string) {
    setRows((current) => current.filter((row) => row.key !== key));
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Links
      </p>

      {rows.length > 0 ? (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-200 p-2 dark:border-neutral-800"
            >
              <select
                value={row.type}
                onChange={(event) =>
                  updateRow(row.key, {
                    type: event.target.value as ProjectLinkInput["type"],
                  })
                }
                aria-label="Link type"
                className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >
                {PROJECT_LINK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {PROJECT_LINK_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={row.label}
                onChange={(event) =>
                  updateRow(row.key, { label: event.target.value })
                }
                placeholder="Label (e.g. Live Website)"
                aria-label="Link label"
                className="min-w-[9rem] flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <input
                type="url"
                value={row.url}
                onChange={(event) =>
                  updateRow(row.key, { url: event.target.value })
                }
                placeholder="https://…"
                aria-label="Link URL"
                className="min-w-[12rem] flex-[2] rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                aria-label={`Remove ${row.label || "link"}`}
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
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No links yet.
        </p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
      >
        + Add link
      </button>

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          rows
            .filter((row) => row.label.trim() && row.url.trim())
            .map(({ type, label, url }) => ({ type, label, url }))
        )}
      />
    </div>
  );
}
