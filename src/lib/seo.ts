import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/types/content";
import { getOgLocale } from "@/lib/locale";
import { brand } from "@/config/brand";

/**
 * Builds the `alternates` block (canonical + hreflang) for a page.
 *
 * `path` is the locale-agnostic part of the route (e.g. "" for the
 * homepage, "/projects", "/projects/prj-simulix") — every locale segment
 * is prefixed here so callers never have to repeat `/${locale}` at each
 * call site. Values are relative; Next resolves them against
 * `metadataBase` (siteUrl in config/site.ts), so this keeps working
 * whichever of the two mirrored domains (see MULTILINGUAL_ARCHITECTURE.md)
 * actually served the request.
 *
 * `x-default` points at the default locale (en) — the standard fallback
 * for a user agent/language Google can't otherwise match to one of the
 * declared alternates.
 */
export function buildAlternates(
  locale: Locale,
  path: string = ""
): Metadata["alternates"] {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `/${l}${path}`])
  ) as Record<Locale, string>;

  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...languages,
      "x-default": `/${defaultLocale}${path}`,
    },
  };
}

interface PageMetadataInput {
  locale: Locale;
  /** Locale-agnostic route path, same convention as buildAlternates. */
  path: string;
  title: string;
  description: string;
  /** Site name for og:site_name — the localized person name. */
  siteName: string;
  /** Page-specific social image; the site-wide default otherwise. */
  image?: string;
  /** Skip the layout's "%s — Name" title template. */
  absoluteTitle?: boolean;
  /** Extra Open Graph fields for `type: "article"` pages. */
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authors: string[];
    tags?: string[];
  };
}

/**
 * One place that turns a page's title/description into the full set of
 * tags every public page needs: canonical + hreflang, Open Graph (with
 * og:url, og:locale and its alternates) and the Twitter card.
 *
 * Every field is spelled out on each page rather than inherited from
 * [locale]/layout.tsx because Next replaces a parent's `openGraph` /
 * `twitter` objects wholesale — a page that set only its own title there
 * would silently lose the layout's image, site name and locale.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
  image,
  absoluteTitle = false,
  article,
}: PageMetadataInput): Metadata {
  const url = `/${locale}${path}`;
  const images = image
    ? [{ url: image }]
    : [
        {
          url: brand.openGraphImage.url,
          width: brand.openGraphImage.width,
          height: brand.openGraphImage.height,
        },
      ];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: getOgLocale(locale),
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => getOgLocale(l)),
      images,
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            ...(article.modifiedTime && {
              modifiedTime: article.modifiedTime,
            }),
            authors: article.authors,
            ...(article.tags && { tags: article.tags }),
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
  };
}
