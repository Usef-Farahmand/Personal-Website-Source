import { notFound } from "next/navigation";

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
 */
export default function CatchAll() {
  notFound();
}
