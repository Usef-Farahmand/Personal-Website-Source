import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/types";

export async function AboutPreview({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "aboutPreview" });

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="border-border max-w-2xl border-t pt-12">
        <p className="text-body-lg text-text-secondary">
          {site.aboutPreview.excerpt}
        </p>

        <Link
          href="/about"
          className="text-small text-accent hover:text-accent-hover mt-6 inline-block font-medium transition-colors"
        >
          {t("cta")} →
        </Link>
      </div>
    </section>
  );
}
