"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Hides the site header and footer on the homepage, which is a
 * self-contained, single-screen landing hero that renders the same
 * SiteNav inside itself. Every other page gets the header, the footer and
 * a faint version of the hero's backdrop.
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
      {!isLanding && (
        <>
          {/* The hero's blueprint grid and warm glow, faded in behind the
              top of every other page so they share its look. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] overflow-hidden"
          >
            <div className="landing-grid absolute inset-0" />
            <div className="bg-accent/15 absolute start-1/2 -top-56 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full blur-3xl rtl:translate-x-1/2" />
          </div>
          {header}
        </>
      )}
      {children}
      {!isLanding && footer}
    </>
  );
}
