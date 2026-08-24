/**
 * Task 07 fix: this used to hardcode "Project ..." for every message,
 * so using it on the Articles pages (it always has been — see
 * app/admin/articles/page.tsx and .../articles/[id]/page.tsx) showed
 * the wrong noun. Now takes the content type and picks the right one.
 * Also the natural place to add the four new workflow outcomes
 * (published/unpublished/archived/restored) alongside the pre-existing
 * created/updated/deleted.
 */

export type SuccessBannerContentType = "project" | "article";

const TYPE_LABELS: Record<SuccessBannerContentType, string> = {
  project: "Project",
  article: "Article",
};

const MESSAGES: Record<string, (typeLabel: string) => string> = {
  created: (typeLabel) => `${typeLabel} created.`,
  updated: (typeLabel) => `${typeLabel} saved.`,
  deleted: (typeLabel) => `${typeLabel} deleted.`,
  published: (typeLabel) => `${typeLabel} published.`,
  unpublished: (typeLabel) => `${typeLabel} moved back to Draft.`,
  archived: (typeLabel) => `${typeLabel} archived.`,
  restored: (typeLabel) => `${typeLabel} restored to Draft.`,
};

export default function SuccessBanner({
  success,
  type,
}: {
  success?: string;
  type: SuccessBannerContentType;
}) {
  if (!success || !MESSAGES[success]) return null;

  return (
    <div
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
    >
      {MESSAGES[success](TYPE_LABELS[type])}
    </div>
  );
}
