"use client";

import { useId, useState } from "react";

/**
 * Renders `values` as removable chips plus a small "type + Add" control.
 * The actual form field is the hidden `<input type="hidden">` carrying
 * the JSON-encoded array — everything else here is just UI for editing
 * that array before submit, so it works with a plain `<form action=...>`
 * server action with no client-side form-state library.
 */
export default function TagListInput({
  name,
  label,
  initialValues,
  placeholder,
  dir,
}: {
  name: string;
  label: string;
  initialValues: string[];
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  const [values, setValues] = useState<string[]>(initialValues);
  const [draft, setDraft] = useState("");
  const inputId = useId();

  function addValue() {
    const next = draft.trim();
    if (!next) return;
    if (values.includes(next)) {
      setDraft("");
      return;
    }
    setValues((current) => [...current, next]);
    setDraft("");
  }

  function removeValue(value: string) {
    setValues((current) => current.filter((v) => v !== value));
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>

      {values.length > 0 ? (
        <ul
          className="mb-2 flex flex-wrap gap-1.5"
          aria-label={`${label} list`}
        >
          {values.map((value) => (
            <li key={value}>
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 py-1 pr-1 pl-2.5 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                {value}
                <button
                  type="button"
                  onClick={() => removeValue(value)}
                  aria-label={`Remove ${value}`}
                  className="rounded-full p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" d="m2.5 2.5 7 7m0-7-7 7" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          dir={dir}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addValue();
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <button
          type="button"
          onClick={addValue}
          className="shrink-0 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          Add
        </button>
      </div>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Press Enter or comma to add.
      </p>

      <input type="hidden" name={name} value={JSON.stringify(values)} />
    </div>
  );
}
