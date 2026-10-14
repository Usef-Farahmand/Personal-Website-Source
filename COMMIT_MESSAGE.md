feat(home): replace the scrolling homepage with a single-screen game-dev hero

- New LandingHero: a full-viewport (h-dvh, no scroll) dark hero with a
  warm orange slanted panel, CRT scanlines, blueprint grid, a typing
  role badge styled like a selected game object, CTAs, stats (years,
  projects, articles), a "My Stack" rail (Unity, Godot, Cocos, Figma)
  and every enabled social link as an icon button.
- Own top navigation to About, Projects, Experience, Skills and
  Articles, a language switcher and a "Let's Talk" CTA; below lg it
  collapses into a toggle menu. Works in both LTR (en) and RTL (fa).
- Lower-priority blocks (intro, stats) drop out on short viewports so
  the page always fits one screen without scrolling.
- SiteChrome hides the site header/footer on the homepage only.
- Contact moves from the homepage to a new /contact page; the About
  CTA, 404 terminal command and sitemap now point there.
- Content: hero.roles and experienceYears added to site content;
  brand.heroPhoto points at a transparent placeholder cut-out
  (public/profile/usef-farahmand-hero.png) to be replaced with the
  real photo.
