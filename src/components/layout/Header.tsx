import { getSiteContent } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/content/types";

export async function Header({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-small text-text-primary hover:text-accent font-medium transition-colors"
        >
          {site.hero.name}
        </Link>

        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
