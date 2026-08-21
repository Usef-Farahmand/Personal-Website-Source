-- AlterTable: Task 06 adds real local file upload to the Media model.
-- Three new nullable columns describe an uploaded file's origin —
-- nullable because pre-existing rows (seed data, anything created via
-- the old quick-add-by-URL flow) have no real uploaded file to
-- describe, and nothing needs to be backfilled for them.
ALTER TABLE "Media" ADD COLUMN "originalFilename" TEXT;
ALTER TABLE "Media" ADD COLUMN "mimeType" TEXT;
ALTER TABLE "Media" ADD COLUMN "fileSize" INTEGER;
