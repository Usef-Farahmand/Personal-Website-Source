fix(nav): give the homepage header the same height as every other page

- SiteNav uses one vertical padding (py-3.5) for both variants instead
  of the larger landing-only py-4/lg:py-6.
- The hero wraps SiteNav in a transparent 1px bottom border, matching
  the sticky header's border on other pages.
- The page variant's "Let's Talk" button gets a transparent border like
  the landing one, so both bars measure the same (69px on mobile, 71px
  from sm up) and the logo sits at the same spot on every page.
