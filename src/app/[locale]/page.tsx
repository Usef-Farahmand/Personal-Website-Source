import { Hero } from "@/components/sections/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import type { Locale } from "@/content/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return (
    <>
      <Hero locale={locale} />
      <AboutPreview locale={locale} />
      <FeaturedWork locale={locale} />
      <Experience locale={locale} />
      <Achievements locale={locale} />
    </>
  );
}
