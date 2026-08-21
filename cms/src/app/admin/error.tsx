"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
      <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
        Something went wrong
      </h2>
      <p className="mt-1 text-sm text-red-700 dark:text-red-400">
        This page couldn&apos;t load, usually because the local database
        isn&apos;t reachable.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-800 dark:bg-neutral-900 dark:text-red-300 dark:hover:bg-red-950/50"
      >
        Try again
      </button>
    </div>
  );
}
