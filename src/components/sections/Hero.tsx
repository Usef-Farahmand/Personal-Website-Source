import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/types";

export async function Hero({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-20 sm:px-6 sm:py-28">
      <p className="text-small text-accent font-medium">
        {site.hero.statusLine}
      </p>

      <h1 className="text-h1 sm:text-display text-text-primary font-semibold">
        {site.hero.name}
      </h1>

      <p className="text-body-lg text-text-secondary max-w-2xl">
        {site.hero.tagline}
      </p>

      <div className="mt-2 flex flex-wrap gap-4">
        <Link
          href="/projects"
          className="bg-accent text-small text-background hover:bg-accent-hover rounded-md px-5 py-2.5 font-medium transition-colors"
        >
          {t("ctaPrimary")}
        </Link>
      </div>
    </section>
  );
}
