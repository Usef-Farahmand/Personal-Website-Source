"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * A script that runs synchronously while the HTML is parsed — before the
 * first paint — on full page loads (Next's "Preventing flash before
 * hydration" guide).
 *
 * It only ever exists in server HTML: during hydration React uses the
 * server snapshot (true) and adopts the parsed <script> as-is; afterwards,
 * and on any client-side mount (e.g. the [locale] layout re-rendering
 * after a language switch), the client snapshot (false) renders nothing.
 * React never creates a <script> on the client, so it never warns that
 * one won't execute — and it wouldn't need to run then anyway.
 */
export function InlineScript({ html }: { html: string }) {
  const isServerHtml = useSyncExternalStore(
    subscribe,
    () => false,
    () => true
  );

  if (!isServerHtml) return null;

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
