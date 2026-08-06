import type { MediaItem } from "@/types/media";

const METADATA_LABELS: Record<
  keyof NonNullable<MediaItem["metadata"]>,
  string
> = {
  date: "Date",
  organization: "Organization",
  author: "Author",
  source: "Source",
  category: "Category",
};

interface MediaInfoPanelProps {
  item: MediaItem;
  className?: string;
}

/**
 * Renders description + metadata (Information Panel requirement).
 * Returns null when there's genuinely nothing to show, rather than an
 * empty bordered box — "hide empty fields automatically" applies to the
 * panel as a whole, not just its individual rows.
 *
 * Layout (side panel on desktop, footer on mobile) is the caller's job
 * via `className` — this component only renders content, matching how
 * every other layout decision in this codebase stays in the parent
 * rather than a component guessing its own placement. MediaViewer passes
 * a different className at different breakpoints for exactly that
 * reason.
 */
export function MediaInfoPanel({ item, className }: MediaInfoPanelProps) {
  const metadataEntries = item.metadata
    ? (
        Object.keys(item.metadata) as (keyof NonNullable<
          MediaItem["metadata"]
        >)[]
      )
        .filter((key) => item.metadata?.[key])
        .map((key) => ({
          label: METADATA_LABELS[key],
          value: item.metadata![key]!,
        }))
    : [];

  if (!item.description && metadataEntries.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {item.description && (
        <p className="text-small text-text-secondary">{item.description}</p>
      )}
      {metadataEntries.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {metadataEntries.map((entry) => (
            <div key={entry.label}>
              <dt className="text-caption text-text-secondary font-medium">
                {entry.label}
              </dt>
              <dd className="text-small text-text-primary mt-0.5">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
