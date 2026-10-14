import { LandingHero } from "@/components/sections/landing/LandingHero";
import { getSiteContent } from "@/services/content/site.service";
import { buildPageMetadata } from "@/lib/seo";
import { buildTitleTemplate } from "@/config/site";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const site = getSiteContent(locale);

  // An explicit full title (absolute) rather than the layout's "%s —
  // Name" template: this page and the layout that defines the template
  // share the same route segment ([locale]), and Next 16 doesn't apply a
  // segment's own template to its page — confirmed in a production build.
  return buildPageMetadata({
    locale,
    path: "",
    title: buildTitleTemplate(site.hero.name).replace(
      "%s",
      site.hero.professionalTitle
    ),
    description: site.hero.introduction,
    siteName: site.hero.name,
    absoluteTitle: true,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  // A single, non-scrolling landing screen that links out to every
  // section page — the former stacked homepage previews now live only on
  // their dedicated pages, and Contact moved to /contact.
  return <LandingHero locale={locale} />;
}
