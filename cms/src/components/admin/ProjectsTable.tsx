import Link from "next/link";
import { formatDateTime } from "@/lib/format-date";
import type { ProjectListItem } from "@/lib/queries/projects";
import LanguageStatus from "./LanguageStatus";
import StatusBadge from "./StatusBadge";
import DeleteProjectButton from "./DeleteProjectButton";

export default function ProjectsTable({
  items,
  emptyMessage,
}: {
  items: ProjectListItem[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[760px] divide-y divide-neutral-200 text-left text-sm dark:divide-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-900/60">
          <tr>
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
              Featured
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
            <tr key={item.id}>
              <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                {item.title}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                {item.featured ? (
                  <span aria-label="Featured" className="text-amber-500">
                    ★
                  </span>
                ) : (
                  <span
                    aria-label="Not featured"
                    className="text-neutral-300 dark:text-neutral-700"
                  >
                    ☆
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <LanguageStatus languages={item.languages} />
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                {formatDateTime(item.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/projects/${item.id}/preview`}
                    className="font-medium text-neutral-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-neutral-400"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/admin/projects/${item.id}`}
                    className="font-medium text-blue-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                  <DeleteProjectButton id={item.id} title={item.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
