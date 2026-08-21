/**
 * Shared date formatting for the Admin Dashboard. A fixed locale/format
 * (rather than the visitor's browser locale) keeps server-rendered
 * output deterministic — every Admin page is an async server component
 * with no client-side re-render to diverge from it, so there's no
 * hydration-mismatch risk either way, but a fixed format is one less
 * thing to reason about.
 */
const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(date: Date): string {
  return formatter.format(date);
}
