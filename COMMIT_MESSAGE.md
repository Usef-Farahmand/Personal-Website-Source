feat(cms): add local Media Library with upload, management, and Project/Article integration

Task 06 — implements a local-only Media Library on top of the existing
Media model, replacing the Task 01/02 URL-only quick-add stub with a
real upload pipeline.

- Add /admin/media: searchable, filterable grid of all Media (images,
  videos, PDFs) with thumbnails, type badges, file size, and created
  date.
- Add POST /api/media/upload (Route Handler, not a Server Action, to
  avoid the 1MB Server Action body-size default): validates file
  extension, browser-reported MIME type, size limit, and a byte-level
  signature check per type before writing to
  public/uploads/{images,videos,pdfs}/<uuid>.<ext> and creating the
  Media row. Never trusts the client-supplied MIME type alone.
- Add /admin/media/[id]: preview, editable metadata (title,
  description, downloadable, downloadUrl), file details, and a "used
  by" list of the Projects/Articles referencing it.
- Add safe deletion: blocks deleting a Media item that's still
  referenced by any Project (logo/cover/gallery) or Article (header
  image) rather than silently detaching relationships; only removes
  the on-disk file once a Media row is both deleted and unreferenced.
- Replace the old URL-based quick-add flow in MediaPicker/GalleryEditor
  with the same reusable upload widget used by the full Media Library
  (no separate Project/Article-specific upload implementation).
- Prisma: add nullable originalFilename/mimeType/fileSize to Media
  (migration 20260821080000_media_upload_metadata). Existing quick-add
  rows are left as-is.
- Un-flag "Media Library" as "soon" in the admin sidebar.

Public website remains untouched and has no runtime dependency on any
of this (Prisma, SQLite, or the new upload endpoint stay entirely
inside cms/).
