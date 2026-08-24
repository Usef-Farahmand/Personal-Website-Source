-- Task 07: Draft/Preview/Publish workflow.
--
-- Adds one new nullable column per content type to record when the CMS's
-- own workflow (see lib/content-workflow.ts) first moved that item to
-- PUBLISHED. Both are plain nullable ADD COLUMNs — no table rebuild
-- needed (unlike Task 06.3's ProjectMedia change), since neither is
-- required or touches an existing column.
--
-- Project gets a plain `publishedAt` (it had no publish-date column of
-- any kind before this). Article gets `cmsPublishedAt` specifically
-- *not* `publishedAt` — that name is already taken on Article by the
-- pre-existing, hand-entered *external* publication date column; see
-- schema.prisma's Article model comment for why conflating the two
-- would be a data-loss bug.

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "publishedAt" DATETIME;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN "cmsPublishedAt" DATETIME;

-- CreateIndex
CREATE INDEX "Project_publishedAt_idx" ON "Project"("publishedAt");

-- CreateIndex
CREATE INDEX "Article_cmsPublishedAt_idx" ON "Article"("cmsPublishedAt");
