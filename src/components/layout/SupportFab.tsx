"use client";

import { Coffee } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

/** Pages where a floating button would be redundant (Support itself) or
 *  would sit on top of a full-screen layout's own controls. */
const HIDDEN_ON = ["/", "/support", "/contact"];

/**
 * Small "Support" pill fixed to the bottom end corner on phones and
 * tablets (bottom-right in English, bottom-left in Persian), above the
 * home-indicator safe area. Links to the Support page — it never starts a
 * transaction. Hidden from lg up, where the footer callout is in reach,
 * and on the pages above. Sits at the header's layer, so dialogs and
 * menus still cover it.
 */
export function SupportFab({ label }: { label: string }) {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <Link
      href="/support"
      className="bg-background/90 text-text-primary fixed end-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[var(--z-header)] inline-flex min-h-11 items-center gap-2 rounded-full border border-[#f6b40e]/50 px-4 text-sm font-semibold shadow-lg backdrop-blur-md transition-colors hover:border-[#f6b40e] lg:hidden"
    >
      <Coffee className="h-4 w-4 text-[#f6b40e]" aria-hidden="true" />
      {label}
    </Link>
  );
}
