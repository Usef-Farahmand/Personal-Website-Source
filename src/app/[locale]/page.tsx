import { Hero } from "@/components/sections/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Recommendations } from "@/components/sections/Recommendations";
import { Exploring } from "@/components/sections/Exploring";
import { Achievements } from "@/components/sections/Achievements";
import { FeaturedArticles } from "@/components/sections/FeaturedArticles";
import { Contact } from "@/components/sections/Contact";
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
      <Skills locale={locale} />
      <Recommendations locale={locale} />
      <Exploring locale={locale} />
      <Achievements locale={locale} />
      <FeaturedArticles locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
