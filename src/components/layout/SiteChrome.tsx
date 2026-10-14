"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Hides the site header and footer on the homepage, which is a
 * self-contained, single-screen landing hero with its own navigation.
 * Header and Footer are async Server Components, so they're rendered by
 * DefaultLayout and passed in as slots — this only decides whether to
 * show them. `usePathname` from i18n/navigation returns the path without
 * the locale prefix, so "/" matches both /en and /fa.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const isLanding = usePathname() === "/";

  return (
    <>
      {!isLanding && header}
      {children}
      {!isLanding && footer}
    </>
  );
}
