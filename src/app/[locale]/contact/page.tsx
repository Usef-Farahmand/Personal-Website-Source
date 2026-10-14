import { getTranslations } from "next-intl/server";
import { getContactContent } from "@/services/content/contact.service";
import { PageHeader } from "@/components/ui/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.contact" });
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
}

/**
 * Contact used to be the homepage's last section; the homepage is now a
 * single-screen landing hero, so the section has its own route.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const contact = getContactContent(locale);

  return (
    // Fixed height: the page fits one screen and never scrolls (see
    // .viewport-page in utilities.css).
    <div className="viewport-page">
      <Contact
        locale={locale}
        header={
          <PageHeader
            path="/contact"
            title={contact.title}
            intro={contact.subtitle}
            className="mb-0 lg:mb-8"
            compact
          />
        }
      />
    </div>
  );
}
