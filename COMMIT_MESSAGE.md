fix(layout): stop the header shifting sideways between the hero and other pages

- The homepage hero never scrolls, so it had no vertical scrollbar,
  while every other page did. On desktops with classic scrollbars
  (Windows) that changed the viewport width by ~15-17px and the centered
  header jumped by half of it on every navigation.
- base.css: `scrollbar-gutter: stable` on <html> reserves the scrollbar
  space on every page, so the header sits at exactly the same x
  position everywhere (verified in en and fa at 1440 and 1920px).
- landing.css: on the LTR hero that reserved gutter sits next to the
  orange panel, so it is filled orange (custom scrollbar-color plus a
  solid root background) instead of showing a dark strip. In RTL the
  gutter is next to the dark side and needs nothing.
