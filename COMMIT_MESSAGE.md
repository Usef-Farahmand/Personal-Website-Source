fix(media-viewer): dedupe adjacent preload indexes to prevent duplicate React keys

Fix a console error — "Encountered two children with the same key,
`media-personal-ai-gallery-1`" — thrown by MediaViewer's adjacent-image
preloading whenever a gallery has exactly two items.

"Previous" and "next" adjacent indexes were computed independently as
`(index - 1 + length) % length` and `(index + 1) % length`. With a
2-item gallery, both expressions resolve to the same item, so the
preload list rendered two hidden `<img>` elements sharing one key.

Fix: collect the two adjacent indexes into a Set before mapping, so a
2-item gallery preloads that one unique neighbor instead of listing it
twice. No visible behavior change for galleries with 3+ items.
