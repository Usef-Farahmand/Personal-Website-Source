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

  /** The room behind the characters (one image per orientation). */
  room: {
    landscape: { src: "/loader/room-landscape.webp", width: 1672, height: 941 },
    portrait: { src: "/loader/room-portrait.webp", width: 941, height: 1672 },
  },

  characters: {
    /** Seated, playing — cut by the frame at the bottom (1280×776). */
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
        height: 582,
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
    /** Grace period after hydration before the video is requested (only
     *  while the overlay is still up). */
    videoDelayMs: 150,
  },

  /** Must match the scene-in delay in styles/loader.css. */
  sceneDelayMs: 280,
  /** The scene is always seen for this long — it can't be skipped and
   *  stays even when the page is ready sooner. */
  minVisibleMs: 5000,
  /** Hard cap, counted from navigation start: the loader leaves by then
   *  whatever is still loading. The CSS failsafe (10s) covers a dead
   *  script. */
  maxVisibleMs: 8000,
  /** Fade-out length (styles/loader.css), plus a little slack. */
  exitMs: 950,
} as const;
