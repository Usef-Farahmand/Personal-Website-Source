import { MEDIA_TYPE_LABELS, type MediaType } from "@/lib/validation/shared";

const STYLES: Record<MediaType, string> = {
  IMAGE: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  VIDEO:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  PDF: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

export default function MediaTypeBadge({ type }: { type: MediaType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[type]}`}
    >
      {MEDIA_TYPE_LABELS[type]}
    </span>
  );
}
