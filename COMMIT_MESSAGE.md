feat(about): fold Achievements and Recommendations into About, drop Exploring

- About now shows Achievements and Recommendations as single-row,
  horizontally draggable carousels (new DragScroller: native touch
  scroll, mouse drag, prev/next arrows, snap; a drag never triggers a
  card's click). Recommendations keeps its full page, linked from About.
- Achievements no longer has a page of its own: /[locale]/achievements
  redirects to /[locale]/about#achievements.
- Exploring removed entirely (page, sections, card, content, service,
  types, messages, sitemap, footer and 404-terminal entries);
  /[locale]/exploring redirects to the homepage.
- New "My Studio" card on About for Jolly Panda (logo, Founder role,
  description, link to https://www.jollypanda.ir); studio name/url/logo
  are shared site content, role/description localized as studioIntro.
- Learning Notes added to the header navigation; between lg and xl the
  header shows the logo without the name so all six links fit on one
  line.
- "Back to Home" removed from every page; Breadcrumb now only renders
  the Home / Section / Title trail on detail pages.
- Experience page widened to max-w-5xl to match the other pages; About
  uses the same width.
