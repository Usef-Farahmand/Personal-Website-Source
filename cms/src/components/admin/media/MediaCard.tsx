import Link from "next/link";
import { formatDateTime } from "@/lib/format-date";
import { formatFileSize } from "@/lib/format-file-size";
import type { MediaLibraryItem } from "@/lib/queries/media";
import MediaTypeBadge from "./MediaTypeBadge";
import MediaTypeIcon from "./MediaTypeIcon";

/**
 * No automatic thumbnail generation for video/PDF (section 5: "Do not
 * add video transcoding or image processing yet") — those types show a
 * type icon tile instead of a preview frame. Images use the uploaded
 * file itself, since a browser can decode any of the allowed image
 * formats without extra processing.
 */
export default function MediaCard({ item }: { item: MediaLibraryItem }) {
  const displayName = item.title || item.source.split("/").pop() || "Untitled";

  return (
    <Link
      href={`/admin/media/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 transition-colors hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-800 dark:hover:border-blue-600"
    >
      <div className="flex aspect-video items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        {item.type === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element -- local upload, not a remote image needing next/image's optimizer
          <img
            src={item.thumbnail || item.source}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <MediaTypeIcon
            type={item.type}
            className="h-10 w-10 text-neutral-400 dark:text-neutral-600"
          />
        )}
      </div>
      <div className="flex-1 space-y-1.5 p-3">
        <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {displayName}
        </p>
        <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <MediaTypeBadge type={item.type} />
          <span>{formatFileSize(item.fileSize)}</span>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          {formatDateTime(item.createdAt)}
        </p>
      </div>
    </Link>
  );
}
