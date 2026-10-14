import { getContactContent } from "@/services/content/contact.service";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
 * single-screen landing hero, so the section has its own route. The
 * section component is reused as-is (its copy was already written to
 * stand alone — see Contact.tsx).
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return (
    <>
      <div className="container-wide -mb-12 pt-16 sm:-mb-16">
        <Breadcrumb locale={locale} />
      </div>
      <Contact locale={locale} titleAs="h1" />
    </>
  );
}
