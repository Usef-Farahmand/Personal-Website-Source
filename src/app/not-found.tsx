import Link from "next/link";
import "./globals.css";

/**
 * Root-level fallback for the rare case where a request never reaches the
 * [locale] segment at all (e.g. a path the proxy/middleware matcher
 * excludes) — src/app/[locale]/not-found.tsx handles the vast majority
 * of real 404s (any unmatched path under /en or /fa) and is the one that
 * actually renders Header/Footer/theming.
 *
 * This file can't know the visitor's locale (there's no [locale] param
 * this high in the tree), so it renders a minimal, English-only page and
 * — unlike the localized one — must provide its own complete <html>/
 * <body>, since the root layout (src/app/layout.tsx) intentionally
 * doesn't. It also imports globals.css directly: the root layout doesn't
 * import it either (only [locale]/layout.tsx does), so without this
 * import here, this page would render with no design tokens or Tailwind
 * utilities available at all.
 */
export default function RootNotFound() {
  return (
    <html lang="en" data-theme="dark" className="h-full antialiased">
      <body className="bg-background text-text-primary flex min-h-full flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <p className="text-accent text-small font-mono">404</p>
        <h1 className="text-h3 font-semibold">Page not found</h1>
        <p className="text-text-secondary text-body">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="bg-accent text-background hover:bg-accent-hover text-small rounded-md px-5 py-2.5 font-medium transition-colors"
        >
          Back to home
        </Link>
      </body>
    </html>
  );
}
