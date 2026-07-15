"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Client-side navigation doesn't reload the page, so screen readers never
 * announce anything and keyboard focus stays wherever it was — often
 * nowhere useful. This addresses both gaps on every route change:
 *   1. Moves focus to #main-content, so keyboard navigation continues
 *      from the new page's content rather than a stale position.
 *   2. Announces the new document.title via a visually-hidden live region,
 *      giving screen reader users the equivalent of a full page-load
 *      announcement.
 *
 * Renders nothing visible. Mount once, near the root of the shell.
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on initial mount — the browser already announced the first
    // page load natively; this is only for subsequent client navigations.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const main = document.getElementById("main-content");
    main?.focus();

    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = document.title;
    }
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="sr-only"
      ref={liveRegionRef}
    />
  );
}
