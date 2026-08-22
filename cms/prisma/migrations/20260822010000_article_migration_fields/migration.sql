-- Task 06.2: add the Article columns required to losslessly migrate the
-- existing public-site Article data into the CMS.
--
-- All nullable / DEFAULT-backed additions — a plain ADD COLUMN is
-- sufficient, no table rebuild. No existing column is dropped, renamed,
-- or narrowed; every CMS record created by earlier tasks keeps working
-- unchanged.

-- AlterTable: Article
ALTER TABLE "Article" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Article" ADD COLUMN "relatedProjectIds" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Article" ADD COLUMN "relatedArticleIds" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Article" ADD COLUMN "coAuthors" TEXT NOT NULL DEFAULT '[]';
