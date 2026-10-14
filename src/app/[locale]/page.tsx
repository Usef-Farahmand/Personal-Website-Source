import { LandingHero } from "@/components/sections/landing/LandingHero";
import { getSiteContent } from "@/services/content/site.service";
import { buildAlternates } from "@/lib/seo";
import { siteMetadataDefaults } from "@/config/site";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const site = getSiteContent(locale);

  return {
    // Set as an explicit full string (not left to the layout's "%s —
    // Usef Farahmand" template) after confirming in a production build
    // that Next 16's title-template merging does not apply here, since
    // this page and the layout that defines the template share the
    // same route segment ([locale]) rather than a parent/child one —
    // unlike every other page here, which sits in its own child segment
    // and merges the template correctly. Spelling it out avoids relying
    // on that merge for the site's single most important title tag.
    title: siteMetadataDefaults.titleTemplate.replace(
      "%s",
      site.hero.professionalTitle
    ),
    description: site.hero.introduction,
    alternates: buildAlternates(locale),
  };
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
