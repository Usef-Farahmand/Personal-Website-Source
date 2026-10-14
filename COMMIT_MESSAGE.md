feat(contact,404): new illustrations, centered contact form, fixed-size console

- Contact: three columns with equal side widths so the form sits
  exactly in the middle — title and details on one side, the new
  headset illustration (public/profile/usef-farahmand-contact.webp) on
  the other; on phones a small copy of it sits beside the title. The
  social icon row is gone; instead a line under the form reads "Prefer
  LinkedIn? Send me a message there" and links to the LinkedIn profile.
  Still fixed-height: fits without scrolling from 360x640 to 1440x900,
  in en and fa.
- 404: the new "shrugging in front of a broken 404" illustration
  (public/profile/usef-farahmand-404.webp) above the title and
  description; the console now has a fixed size (16rem / 20rem /
  26rem tall by breakpoint) instead of stretching with the screen, with
  only its output scrolling.
- brand.ts: contactPhoto and notFoundPhoto entries; new contactPage
  and notFound.photoAlt translations.
