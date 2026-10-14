import { SiteNav } from "@/components/layout/SiteNav";
import type { Locale } from "@/types/content";

/** Sticky top bar for every page except the homepage, whose hero renders
 *  the same SiteNav itself (see SiteChrome). */
export async function Header({ locale }: { locale: Locale }) {
  return (
    <div className="border-border/60 bg-background/80 sticky top-0 z-[var(--z-header)] border-b backdrop-blur-md">
      <SiteNav locale={locale} variant="page" />
    </div>
  );
}
