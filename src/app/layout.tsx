import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/config/site";

/**
 * metadataBase here, not just in [locale]/layout.tsx's generateMetadata:
 * the root-level file-convention routes (icon.png, apple-icon.png,
 * opengraph-image.png) live outside the [locale] segment, so they need
 * their own resolvable base for absolute URLs — without this, Next warns
 * and falls back to localhost during static generation.
 */
export const metadata: Metadata = {
  metadataBase: siteUrl,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
