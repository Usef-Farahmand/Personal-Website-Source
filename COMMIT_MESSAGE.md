feat(layout): fixed-height Contact and 404, slimmer footer, full-width detail pages

- New `.viewport-page` utility: a page whose root carries it locks the
  document to one screen (header, page, footer pinned to the bottom) so
  it never scrolls; on a screen too short for its content it scrolls
  only inside that area as a last resort.
- /contact uses it: title and details beside the form on desktop; on
  phones the PageHeader `compact` mode keeps only the title, the
  details column (also reachable via the footer icons) is desktop-only,
  name/email share a row and the message box is shorter. Fits without
  any scroll from 360x640 up to 1440x900, in en and fa.
- 404 redesigned with it: ~/404 tag, large "404", title and description
  on one side; the interactive console fills the remaining height on
  the other, with only its output scrolling. Home/Projects buttons stay
  below the console.
- Footer reduced to one slim row (copyright + social icons); the page
  links are gone (they live in the header). Unused footer-only nav
  translations removed.
- Project and Learning detail pages widened from max-w-3xl to
  max-w-5xl to match every other page.
