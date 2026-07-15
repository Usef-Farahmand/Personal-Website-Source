import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getDirection } from "@/lib/locale";
import { getSiteContent } from "@/lib/content";
import type { Locale } from "@/content/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteUrl, siteMetadataDefaults } from "@/config/site";
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
    description: site.hero.tagline,
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
    notFound();
  }

  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction} className="h-full antialiased">
      <body className="bg-background text-text-primary flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
