import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

/**
 * Catch-all for any path under a locale that doesn't match a real page
 * (e.g. /en/typo). Without this, Next.js never actually enters the
 * [locale] segment for a structurally-unmatched path — it serves the
 * app-level not-found page directly, bypassing [locale]/layout.tsx (and
 * therefore [locale]/not-found.tsx) entirely. This page exists purely to
 * make the route match, then immediately defers to the nearest
 * not-found.tsx boundary — [locale]/not-found.tsx — via notFound().
 *
 * This is the documented next-intl pattern for this exact gap; see
 * https://next-intl.dev — "Unless you provide a not-found page within
 * the [locale] folder, Next.js will use the app-level not-found page —
 * without your regular layout."
 *
 * setRequestLocale is required here, not optional: not-found.tsx files
 * never receive route params in the App Router (this is a Next.js
 * limitation, not a next-intl one), so getTranslations() inside
 * [locale]/not-found.tsx has no other way to know which locale's
 * messages to load for this specific render path. Without this call,
 * that lookup fails with "MISSING_MESSAGE" even though the key exists
 * in both message files — the locale it resolves to is otherwise
 * whatever next-intl's request-scoped context happened to default to,
 * not necessarily this request's actual /en or /fa segment.
 */
export default async function CatchAll({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  setRequestLocale(locale);
  notFound();
}
