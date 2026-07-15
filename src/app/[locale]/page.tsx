import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AboutPreview } from "@/components/sections/AboutPreview";
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
      <FeaturedWork locale={locale} />
      <AboutPreview locale={locale} />
    </>
  );
}
