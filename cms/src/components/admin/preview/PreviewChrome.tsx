import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import type { ContentStatus, Locale } from "@/lib/validation/shared";

/**
 * Task 07, sections 5 & 10: wraps every Preview page. A server
 * component — the locale switch is just links to `?locale=en|fa` (a
 * normal navigation, re-running the server component with the new
 * search param), so nothing here needs client-side state.
 *
 * The status banner is the section 10 requirement made unmissable:
 * "DRAFT — Preview" etc., so this can never be confused for the real
 * public website even at a glance.
 */

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fa: "Persian",
};

export default function PreviewChrome({
  status,
  editHref,
  previewBasePath,
  locale,
  children,
}: {
  status: ContentStatus;
  editHref: string;
  previewBasePath: string;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900/60">
        <div className="flex items-center gap-2.5">
          <StatusBadge status={status} />
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Preview — not the live public website
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border border-neutral-300 p-0.5 dark:border-neutral-700">
            {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
              <Link
                key={loc}
                href={`${previewBasePath}?locale=${loc}`}
                aria-current={loc === locale ? "true" : undefined}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  loc === locale
                    ? "bg-blue-600 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {LOCALE_LABELS[loc]}
              </Link>
            ))}
          </div>
          <Link
            href={editHref}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to editor
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
