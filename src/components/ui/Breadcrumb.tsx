import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types/content";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  locale: Locale;
  /** Trail items AFTER Home (e.g. Projects / Title). */
  items: BreadcrumbItem[];
}

/**
 * "Home / Section / Title" trail for nested detail pages (Project and
 * Learning detail). Flat section pages have none — the site header
 * already links every section and Home.
 */
export async function Breadcrumb({ locale, items }: BreadcrumbProps) {
  const t = await getTranslations({ locale, namespace: "breadcrumb" });

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
