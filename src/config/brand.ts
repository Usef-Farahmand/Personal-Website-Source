/**
 * Brand asset configuration.
 *
 * Same layer as config/site.ts: a deployment/asset fact, not content —
 * these paths only change when a brand asset is actually replaced, never
 * per-locale or through a CMS. Every component that renders the logo
 * imports from here rather than writing its own "/brand/..." string, so
 * swapping the logo later is a one-file change.
 *
 * Deliberately just paths + dimensions, not alt text: alt text names the
 * person ("Usef Farahmand logo"), which is locale-aware content that
 * already lives in site.hero.name — duplicating it here would create a
 * second source of truth for something that already has one.
 */

export const brand = {
  /**
   * Icon-only mark. Used everywhere the logo actually appears in the UI
   * (Header, Footer, favicon/app-icon source) — real content type sizes,
   * so nowhere needs the name/tagline baked into pixels.
   *
   * Source file is 512x512; Next.js Image generates whatever the actual
   * rendered size needs from this at request time, so this one file
   * covers every on-page usage without separate manually-cropped copies.
   *
   * The source PNG has an opaque near-black background baked in (not
   * true transparency) rather than a soft-edged cutout, matching
   * --color-background (#0a0a0b) closely enough to be seamless on the
   * only theme this site has today. If a light theme ships (see
   * ThemeProvider's documented extension point), this file will need a
   * transparent or light-background counterpart — flagging that now
   * rather than leaving it to be discovered as a visual bug later.
   */
  mark: {
    src: "/brand/logo-mark.png",
    width: 512,
    height: 512,
  },
  /**
   * Served by the src/app/opengraph-image.png file convention. Also
   * referenced explicitly in [locale]/layout.tsx's openGraph/twitter
   * `images` — the file convention alone isn't enough here, because that
   * layout already defines its own openGraph/twitter objects (for
   * locale-specific fields), and Next.js metadata merging replaces a
   * parent segment's object wholesale rather than merging it key-by-key,
   * silently dropping the auto-generated `images` otherwise.
   */
  openGraphImage: {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
  },
} as const;
