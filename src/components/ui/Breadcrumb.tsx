import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  locale: Locale;
  /** Trail items AFTER Home. Omit or pass an empty array for pages with
   *  no meaningful hierarchy (About, Experience, Achievements, Projects
   *  index) — those render a simple "Back to Home" link instead of a
   *  one-crumb "Home / X" trail that adds a separator without adding
   *  real navigational information. */
  items?: BreadcrumbItem[];
}

/**
 * Consistent top-of-page navigation for every dedicated page. Home is
 * always reachable — either as the first crumb in a real trail (nested
 * pages like Project Detail: Home / Projects / Title) or as a standalone
 * "Back to Home" link (flat pages with nothing meaningful to show above
 * them). Callers never construct the Home crumb themselves, so this
 * behavior can't drift or be forgotten per-page.
 */
export async function Breadcrumb({ locale, items = [] }: BreadcrumbProps) {
  const t = await getTranslations({ locale, namespace: "breadcrumb" });

  if (items.length === 0) {
    return (
      <nav aria-label={t("label")} className="mb-8">
        <Link
          href="/"
          className="text-small text-text-secondary hover:text-text-primary inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {t("backToHome")}
        </Link>
      </nav>
    );
  }

  const trail: BreadcrumbItem[] = [{ label: t("home"), href: "/" }, ...items];

  return (
    <nav aria-label={t("label")} className="mb-8">
      <ol className="text-small text-text-secondary flex flex-wrap items-center gap-2">
        {trail.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
