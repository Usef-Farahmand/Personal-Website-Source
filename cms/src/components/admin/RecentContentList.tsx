import Link from "next/link";
import { formatDateTime } from "@/lib/format-date";
import type { RecentContentItem } from "@/lib/queries/dashboard";
import LanguageStatus from "./LanguageStatus";
import StatusBadge from "./StatusBadge";

export default function RecentContentList({
  items,
}: {
  items: RecentContentItem[];
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        No content yet. Recently updated Projects and Articles will appear here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[640px] divide-y divide-neutral-200 text-left text-sm dark:divide-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-900/60">
          <tr>
            <th
              scope="col"
              className="px-4 py-2 font-medium text-neutral-500 dark:text-neutral-400"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-medium text-neutral-500 dark:text-neutral-400"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-medium text-neutral-500 dark:text-neutral-400"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-medium text-neutral-500 dark:text-neutral-400"
            >
              Languages
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-medium text-neutral-500 dark:text-neutral-400"
            >
              Updated
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-medium text-neutral-500 dark:text-neutral-400"
            >
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {items.map((item) => (
            <tr key={`${item.type}-${item.id}`}>
              <td className="px-4 py-3 text-neutral-500 capitalize dark:text-neutral-400">
                {item.type}
              </td>
              <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                {item.title}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3">
                <LanguageStatus languages={item.languages} />
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                {formatDateTime(item.updatedAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={item.editHref}
                  className="font-medium text-blue-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-blue-400"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
