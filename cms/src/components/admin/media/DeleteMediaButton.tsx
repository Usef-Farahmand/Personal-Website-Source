"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMedia } from "@/lib/actions/media";

export default function DeleteMediaButton({
  id,
  title,
  disabled,
}: {
  id: string;
  title: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (disabled) return;

    const confirmed = window.confirm(
      `Delete "${title}"? This permanently removes the file from local storage and can't be undone.`
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteMedia(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin/media?success=deleted");
    });
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || disabled}
        className="w-full rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
      >
        {isPending ? "Deleting…" : "Delete media"}
      </button>
      {error ? (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
