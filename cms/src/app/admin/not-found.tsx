import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
      <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Not found
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        That item doesn&apos;t exist, or may have been removed.
      </p>
      <Link
        href="/admin"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
