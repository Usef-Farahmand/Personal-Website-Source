fix(learning): stop next/image "Invalid URL" crash on learning images

The detail page crashed in `LearningContent` because an image `src` in
learning.json was written as "public/learning/..." (project-relative,
no leading slash), which next/image rejects with "Failed to construct
'URL': Invalid URL".

- learning.json: use public URLs ("/learning/FastLeaderboardUnity/...")
  for the cover, both article screenshots (en + fa), and the demo video
  link, now that the files live in public/learning/.
- Add `toPublicSrc()` and apply it to the cover, card, in-article
  images, and OG/JSON-LD images, so "public/x.png" or "x.png" in content
  is normalized to "/x.png" instead of crashing the page.
- Schema/docs: clarify that image paths are relative to public/ with a
  leading slash.
