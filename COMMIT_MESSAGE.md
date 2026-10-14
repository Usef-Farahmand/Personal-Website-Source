feat(ui): animated mobile menu, full-height 404 console on phones, centered send button

- MobileNav: the panel stays mounted and animates both ways (slide +
  fade + slight scale from the top); its links follow in a quick
  stagger, and the menu/close icons cross-fade with a quarter turn.
  The closed panel is `inert`, so it stays out of the tab order and
  the accessibility tree. It now also closes on a tap or click
  outside it, besides Escape and choosing a link.
- 404: below lg the console fills the height left under the message
  (e.g. 477px tall on a 390x844 phone) instead of a small fixed box;
  from lg up it keeps its fixed 26rem height. The page still never
  scrolls.
- Contact: the Send Message button and the privacy note under it are
  centered in the form.
