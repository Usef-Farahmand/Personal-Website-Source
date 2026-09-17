import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types/content";

/**
 * Geo-based locale detection (see detectLocaleFromRequest below) fully
 * replaces next-intl's built-in Accept-Language detection, so it's
 * turned off here. next-intl still handles everything else: validating
 * the locale segment, loading messages, and serving already-prefixed
 * requests (/en/..., /fa/...) unchanged.
 */
const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
});

const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * ISO 3166-1 alpha-2 country codes that should land on the Persian (fa)
 * version of the site by default. Iran only for now — easy to extend
 * (e.g. add "AF", "TJ") if that's ever wanted.
 */
const FA_COUNTRIES = new Set(["IR"]);

function isLocale(value: string | undefined): value is Locale {
  return !!value && (routing.locales as readonly string[]).includes(value);
}

/**
 * Decides the locale for a request that has no /en or /fa prefix yet
 * (i.e. the visitor hit a bare URL like "/" or "/projects").
 *
 * Priority:
 * 1. An explicit earlier choice (the NEXT_LOCALE cookie, set below and
 *    kept in sync whenever the visitor is on a prefixed route) —
 *    someone who manually switched languages should never get bounced
 *    back to their country's default on a later bare-URL visit.
 * 2. The visitor's country, from Vercel's edge geolocation header.
 *    This header is only present on an actual Vercel deployment — it's
 *    empty in local dev, which is fine, since step 3 covers that.
 * 3. The site's configured default locale.
 */
function detectLocaleFromRequest(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const country = request.headers.get("x-vercel-ip-country");
  if (country && FA_COUNTRIES.has(country)) {
    return "fa";
  }

  return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // No locale in the URL yet: decide one (cookie, then geo, then
  // default) and redirect straight to the prefixed URL.
  if (!pathnameHasLocale) {
    const locale = detectLocaleFromRequest(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/" });
    return response;
  }

  // Already prefixed (/en/... or /fa/...): let next-intl handle it as
  // usual, and refresh the cookie so this explicit choice — whether the
  // visitor typed it, followed a link, or clicked the language switcher
  // — sticks for the next bare-URL visit.
  const response = intlMiddleware(request);
  const currentLocale = pathname.split("/")[1];
  if (isLocale(currentLocale)) {
    response.cookies.set(LOCALE_COOKIE, currentLocale, { path: "/" });
  }
  return response;
}

export const config = {
  // Match every route except static files, Next internals, and API routes.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
