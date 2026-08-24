-- Task 06.3: Project Gallery gains a YouTube Video source alongside the
-- existing local Media (Image/Video) source. See schema.prisma's
-- ProjectMedia model comment for the full rationale — this widens the
-- existing join table rather than introducing a second gallery-item
-- table.
--
-- `mediaId` goes from required to optional (a YOUTUBE_VIDEO row has no
-- local Media row at all), which SQLite cannot express as a plain ADD
-- COLUMN/DROP NOT NULL — it requires the standard "rebuild the table"
-- procedure: create the new shape, copy existing rows across (every
-- existing row is a MEDIA row, so `type` backfills to 'MEDIA' and the
-- four new youtube* columns backfill to NULL), drop the old table, and
-- rename. No existing gallery data is lost or reordered by this
-- migration — `id`, `projectId`, `mediaId`, and `order` all carry over
-- unchanged.

PRAGMA foreign_keys=OFF;

CREATE TABLE "new_ProjectMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MEDIA',
    "mediaId" TEXT,
    "youtubeVideoId" TEXT,
    "youtubeUrl" TEXT,
    "youtubeTitle" TEXT,
    "youtubeThumbnailUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProjectMedia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_ProjectMedia" ("id", "projectId", "type", "mediaId", "order")
SELECT "id", "projectId", 'MEDIA', "mediaId", "order" FROM "ProjectMedia";

DROP TABLE "ProjectMedia";

ALTER TABLE "new_ProjectMedia" RENAME TO "ProjectMedia";

-- CreateIndex
CREATE INDEX "ProjectMedia_projectId_order_idx" ON "ProjectMedia"("projectId", "order");

-- CreateIndex
CREATE INDEX "ProjectMedia_mediaId_idx" ON "ProjectMedia"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMedia_projectId_mediaId_key" ON "ProjectMedia"("projectId", "mediaId");

PRAGMA foreign_keys=ON;
