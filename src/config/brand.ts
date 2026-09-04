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
   * True transparency (not a baked-in background) — this works cleanly
   * on the current dark theme and, unlike the previous version of this
   * asset, needs no separate counterpart if a light theme ships later.
   * The one deliberate exception is src/app/apple-icon.png: iOS handles
   * transparent home-screen icons unpredictably, so that file alone has
   * the site's dark background (#0a0a0b) baked in — regenerate it the
   * same way if this mark changes again.
   */
  mark: {
    src: "/brand/logo-mark.png",
    width: 512,
    height: 512,
  },
  /**
   * Profile photo, used as the visual anchor of the About page's
   * Personal Introduction section. Same reasoning as `mark` above: a
   * fixed asset path that only changes when the photo is actually
   * replaced, never per-locale, so it lives here rather than in the
   * localized content layer.
   *
   * Currently points at the brand mark itself as a deliberate placeholder
   * (no real photo exists yet) — replace with an actual professional
   * photo at the same path once available (any raster format also
   * works; only this path needs to change, see AboutIntro, which just
   * consumes `brand.profile.src`).
   */
  profile: {
    src: "/profile/usef-farahmand.png",
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
