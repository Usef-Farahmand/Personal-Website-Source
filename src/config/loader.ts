/**
 * Loading screen assets and timings, in one place so the visual layer
 * (styles/loader.css) and the behaviour (components/loader/) agree.
 *
 * The character assets are generated offline from the source animation by
 * scripts/loader-assets/build_loader_assets.py — regenerate them there
 * rather than editing the files by hand.
 */
export const loaderConfig = {
  /** DOM id the pre-paint inline script and the controller both target. */
  elementId: "site-loader",
  /** sessionStorage key: the loader shows once per browser session. */
  sessionKey: "site-loader-seen",

  characters: {
    /** Seated, playing — 16:9, cut by the frame at the bottom. */
    landscape: {
      /** VP9-with-alpha loops (Chromium, Firefox). */
      video: {
        large: "/loader/characters-landscape-960.webm",
        small: "/loader/characters-landscape-720.webm",
        /** Viewports at or below this width get the small encode. */
        smallMaxWidth: 767,
      },
      /** Transparent still: Safari/iOS (no VP9 alpha), reduced motion,
       *  and the fallback when the video fails. */
      still: {
        src: "/loader/characters-landscape.webp",
        width: 960,
        height: 540,
      },
    },
    /** Standing, full body — for portrait screens (phones held upright,
     *  portrait tablets). */
    portrait: {
      video: "/loader/characters-portrait-680.webm",
      still: {
        src: "/loader/characters-portrait.webp",
        width: 680,
        height: 941,
      },
    },
    /** How long after hydration the video request waits — if the page is
     *  ready by then, the loader exits and the video is never fetched. */
    videoDelayMs: 150,
  },

  /** Must match the scene-in delay in styles/loader.css: a page that's
   *  ready sooner than this never shows the scene at all. */
  sceneDelayMs: 280,
  /** Once the scene is on screen, keep it at least this long so it never
   *  flashes in and straight back out. */
  minSceneVisibleMs: 700,
  /** Longest the loader waits on fonts and above-the-fold images, counted
   *  from navigation start. The CSS failsafe (9s) covers a dead script. */
  maxWaitMs: 6000,
  /** Exit transition length (styles/loader.css), plus a little slack. */
  exitMs: 650,
} as const;
