fix(layout): stop the Persian (RTL) site zooming out on mobile

- ContactForm: hide the honeypot with `sr-only` instead of
  `absolute -left-[9999px]`. In an RTL document the scrollable overflow
  area extends to the left, so that offset made /fa pages ~10,000px wide
  and mobile browsers zoomed out to fit them and pushed the page into a
  corner. In LTR the same offset is unreachable, so /en was unaffected.
- HeroContent: center the scroll-down cue correctly in RTL
  (`rtl:translate-x-1/2`) and fix the comment that claimed -50% works in
  both directions.
- Add scripts/check-responsive.mjs: Playwright crawl of every sitemap
  route (en + fa, all slugs, 404) across 13 viewports from 320px phones to
  1440px desktop, failing on horizontal scroll or a mobile layout viewport
  wider than the device and listing the offending elements.
- .gitignore: ignore the script's .responsive-report/ output.
