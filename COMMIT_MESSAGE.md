fix(seo): give every image descriptive, localized alt text

Replace every empty or repeated `alt` on the site with text that
describes the image, in both English and Persian, so search engines and
screen readers both get something useful.

- add an `imageAlt` message namespace (en/fa): `logo`, `galleryImage`,
  `galleryImageNumbered`
- BrandLogo now defaults to "<name> logo" instead of an empty alt
- project logos (card + hero) and the studio logo on About get "<name> logo"
- add an optional `alt` field to MediaItem; the project page fills it in
  so gallery screenshots read "Mini Sumo screenshot 3 of 12" (or
  "<title> — screenshot from <project>") instead of twelve identical
  "Mini Sumo" alts; used by ProjectGallery, ImageViewer and the viewer's
  preload images
- store button logos (Cafe Bazaar, Myket, Google Play, App Store) get
  real alt text (still aria-hidden, since the button label already says it)
- the mobile contact photo reuses the desktop photo's alt
