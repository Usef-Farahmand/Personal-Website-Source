feat(learning): show the demo video inline instead of as a link

- Add a `video` content block (`{ type: "video", src, poster?, caption? }`)
  rendered by `LearningContent` as a native `<video controls>` with
  `preload="metadata"` and no autoplay.
- learning.json: remove "Live Profiler + Search Demo (video)" from
  `externalLinks` and embed the video in the Profiler results section
  (en + fa); reword the "linked above" sentences accordingly.
- Schema and Persian content guide updated for the new block type.
