import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getDirection, getOgLocale } from "@/lib/locale";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale } from "@/types/content";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { siteUrl, siteMetadataDefaults } from "@/config/site";
import { brand } from "@/config/brand";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const site = getSiteContent(locale);

  return {
    metadataBase: siteUrl,
    title: {
      default: site.hero.name,
      template: siteMetadataDefaults.titleTemplate,
    },
    description: site.hero.introduction,
    // Open Graph / Twitter foundation: sensible site-wide defaults that
    // child pages inherit unless they override title/description/etc.
    // `images` is set explicitly here (not left to the
    // src/app/opengraph-image.png file convention alone) because this
    // segment already defines its own openGraph/twitter objects for
    // locale-specific fields, and Next.js metadata merging replaces a
    // parent segment's object wholesale rather than merging it
    // key-by-key — the file convention's auto-generated `images` would
    // otherwise be silently dropped here.
    openGraph: {
      type: "website",
      siteName: site.hero.name,
      title: site.hero.name,
      description: site.hero.introduction,
      locale: getOgLocale(locale),
      images: [brand.openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: site.hero.name,
      description: site.hero.introduction,
      images: [brand.openGraphImage.url],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  if (!hasLocale(routing.locales, locale)) {
    // Same reasoning as the [locale]/[...rest] catch-all: not-found.tsx
    // never receives route params, so getTranslations() inside it has no
    // way to resolve a locale unless one is set here first. There's no
    // "correct" locale for a genuinely invalid segment, so this falls
    // back to the app's default rather than leaving the request-scoped
    // locale unset (which would otherwise reproduce the exact
    // MISSING_MESSAGE failure this line exists to prevent).
    setRequestLocale(routing.defaultLocale);
    notFound();
  }

  const direction = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      data-theme="dark"
      className="h-full antialiased"
    >
      <body className="bg-background text-text-primary flex min-h-full flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>
            <DefaultLayout locale={locale}>{children}</DefaultLayout>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
