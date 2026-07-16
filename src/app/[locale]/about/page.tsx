import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-h1 text-text-primary mb-10 font-semibold">
        {t("title")}
      </h1>

      <div className="flex flex-col gap-10">
        <p className="text-body-lg text-text-primary">
          {site.about.introduction}
        </p>

        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {t("sections.mission")}
          </h2>
          <p className="text-body text-text-secondary">{site.about.mission}</p>
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {t("sections.philosophy")}
          </h2>
          <p className="text-body text-text-secondary">
            {site.about.philosophy}
          </p>
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {t("sections.journey")}
          </h2>
          <p className="text-body text-text-secondary">{site.about.journey}</p>
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {t("sections.interests")}
          </h2>
          <p className="text-body text-text-secondary">
            {site.about.interests}
          </p>
        </section>
      </div>

      <div className="border-border mt-14 border-t pt-8">
        <Link
          href="/projects"
          className="text-small text-accent hover:text-accent-hover inline-flex items-center gap-1 font-medium transition-colors"
        >
          {t("viewProjectsCta")}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
        </Link>
      </div>
    </div>
  );
}
