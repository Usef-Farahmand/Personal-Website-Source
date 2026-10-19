feat(projects): add Cafe Bazaar and Myket store buttons, use official store icons

Add first-class `bazaar` and `myket` links for projects (Iranian Android
app stores), shown in the project hero with their official logos, and
point Mini Sumo's store link at Cafe Bazaar.

- add `bazaar` and `myket` to Project.links, en/fa labels
- add official store logos (Bazaar, Myket, Google Play, App Store) as PNGs
  in public/icons/stores/ and use them for the hero store buttons
- show every available hero CTA (primary + all secondary buttons)
- switch mini-sumo `links.download` to `links.bazaar`
  (https://cafebazaar.ir/app/com.jollypanda.mini_sumo)
- exclude `.next/dev` from tsconfig so stale dev-server type files can't
  break `next build` (the `React refers to a UMD global` validator.ts error)
- rename src/middleware.ts to src/proxy.ts (Next.js 16 deprecation)
