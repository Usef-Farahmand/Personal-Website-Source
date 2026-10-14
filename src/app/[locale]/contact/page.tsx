import { getContactContent } from "@/services/content/contact.service";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const contact = getContactContent(locale);
  return {
    title: contact.title,
    description: contact.subtitle,
    alternates: buildAlternates(locale, "/contact"),
  };
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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Breadcrumb locale={locale} />
      <PageHeader
        path="/contact"
        title={contact.title}
        intro={contact.subtitle}
      />
      <Contact locale={locale} />
    </div>
  );
}
