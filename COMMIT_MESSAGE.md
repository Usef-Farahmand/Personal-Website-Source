feat(site): apply the hero's design to every page and redesign About

- Shared SiteNav: the homepage hero and every other page now use the
  same top bar (logo, About/Projects/Experience/Skills/Articles with an
  active-page underline, language switcher, "Let's Talk" CTA, mobile
  menu). Header becomes a sticky, blurred wrapper around it.
- Every page gets a faint version of the hero backdrop (blueprint grid +
  warm glow) and a new PageHeader (mono ~/path tag, large bold title,
  accent bar, intro) replacing the per-page title blocks; /contact uses
  it too.
- Footer redesigned: links to every page plus all social icons.
- About page rebuilt in the hero's style: two-column intro with the new
  illustration (public/profile/usef-farahmand-about.webp) in a
  "selected object" card, live stats strip, numbered sections, an
  "At a Glance" card with highlights and philosophy, and an orange CTA
  panel. AboutIntro and AboutCta are removed.
- Hero "My Stack" rail: Godot and Cocos replaced with Adobe Photoshop
  and AI; the label, divider and icons are now separate flex items so
  the divider sits between them in RTL as well.
- Stats come from a shared getProfileStats (live project/article
  counts, shown exactly; only years keep the "+").
