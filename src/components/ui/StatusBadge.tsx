import type { ProjectStatus } from "@/types/content";

const statusColor: Record<ProjectStatus, string> = {
  active: "bg-success/15 text-success",
  shipped: "bg-accent/15 text-accent",
  paused: "bg-warning/15 text-warning",
  archived: "bg-disabled/20 text-text-secondary",
};

export function StatusBadge({
  status,
  label,
}: {
  status: ProjectStatus;
  label: string;
}) {
  return (
    <span
      className={`text-caption inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${statusColor[status]}`}
    >
      {label}
    </span>
  );
}
