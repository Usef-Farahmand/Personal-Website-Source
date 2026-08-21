import type { ContentStatus } from "@/lib/validation/shared";

const STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const STATUS_STYLES: Record<ContentStatus, string> = {
  DRAFT: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  PUBLISHED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  ARCHIVED:
    "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400",
};

const STATUS_DOT: Record<ContentStatus, string> = {
  DRAFT: "bg-amber-500",
  PUBLISHED: "bg-emerald-500",
  ARCHIVED: "bg-neutral-500",
};

/**
 * Compact status pill (section 7). The dot is purely decorative
 * (`aria-hidden`) — the label text is what actually communicates status,
 * so this reads correctly under grayscale/color-blind simulation and to
 * screen readers alike.
 */
export default function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
