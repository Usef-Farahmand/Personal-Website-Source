feat(cms): add media picker search and YouTube gallery videos

Add search/filter to every Media Picker (Project Logo, Project Cover,
Project Gallery, Article Header Image) and let Project Gallery items be
YouTube videos in addition to local Images and Local Videos.

Media Picker
- New shared MediaPickerBrowser: search by title or original filename,
  optional type filter, thumbnail list, capped to 40 results with a
  "refine your search" hint when truncated.
- MediaPicker (Logo/Cover/Header image) rebuilt on top of it, replacing
  the old plain <select>. External API unchanged.
- MediaOption gained `originalFilename` (queries/media.ts, upload
  route) so filename search has something to search.

YouTube gallery videos
- ProjectMedia (Prisma) widened to a discriminated join row: `type`
  (MEDIA | YOUTUBE_VIDEO), `mediaId` now optional, four new optional
  youtube* columns. No second gallery-item table.
- New lib/media/youtube.ts: deterministic, network-free YouTube URL
  parsing (watch/youtu.be/embed/shorts/live) and thumbnail derivation.
- New YoutubeGalleryItemForm: separate "Add YouTube video" flow (URL +
  title, live preview/validation), kept distinct from the local media
  picker per spec.
- GalleryEditor rewritten to hold a mixed MEDIA/YOUTUBE_VIDEO list with
  reorder/remove, submitting the discriminated JSON shape.
- Server re-derives youtubeVideoId from youtubeUrl on submit
  (reconcileYoutubeGalleryItems) rather than trusting the client value.
- projectGalleryItemInputSchema is now a Zod discriminated union.

No YouTube API integration, downloading, or public Viewer changes —
out of scope per the task.

BREAKING CHANGE: ProjectMedia.mediaId is now nullable. Requires
`npx prisma migrate dev` after pulling (migration
20260823010000_project_gallery_youtube_video included).
