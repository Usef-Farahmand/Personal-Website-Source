"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject } from "@/lib/actions/projects";

export default function DeleteProjectButton({
  id,
  title,
  redirectTo,
  className,
}: {
  id: string;
  title: string;
  /** Where to send the user after a successful delete. Omit to stay on
   *  the current page (e.g. the list, which just re-renders without
   *  the row via revalidation). */
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const confirmed = window.confirm(
      `Delete "${title}"? This can't be undone. Media used in its gallery, logo, or cover won't be deleted, in case it's reused elsewhere.`
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteProject(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={
          className ??
          "font-medium text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50 dark:text-red-400"
        }
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error ? (
        <span role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      ) : null}
    </span>
  );
}
