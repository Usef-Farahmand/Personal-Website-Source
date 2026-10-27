fix(projects): show DeskPresence highlights and restore Mini Sumo content

Fix the duplicate-key console error on the project page and make the
DeskPresence feature highlights render.

- convert `prj-deskpresence` featureHighlights (en/fa) from plain strings to
  `{ icon, title, description }` objects
- move the DeskPresence copy that was pasted into `prj-mini-sumo` and write
  Mini Sumo's own en/fa text back in its translations
- add `monitor`, `camera`, `user`, `lock`, `activity`, `droplet`, `mouse`,
  `smartphone`, `shield` to `FeatureHighlightIcon` and map them to lucide
  icons in `FeatureHighlightCard`
- key featureHighlights by title + index in the project page
