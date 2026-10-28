import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import { ResumeSheet } from "@/components/sections/ResumeSheet";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.resume" });
  const site = getSiteContent(locale);
  return buildPageMetadata({
    locale,
    path: "/resume",
    title: t("title"),
    description: t("description", { years: site.experienceYears }),
    siteName: site.hero.name,
  });
}

/**
 * The resume as a web page, in the visitor's locale — the shareable,
 * indexable home of the same sheet the About page opens in a popup.
 */
export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <ResumeSheet locale={locale} />
    </div>
  );
}
