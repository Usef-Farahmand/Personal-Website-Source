-- AlterTable: add Task 05's Article/public-site compatibility fields
-- (see Article.sourcePlatform / Article.readingTimeMinutes in
-- schema.prisma for the full rationale). Both are added with safe
-- defaults so existing rows stay valid: sourcePlatform defaults to
-- OTHER (an honest "unknown/unclassified" rather than guessing
-- MEDIUM), readingTimeMinutes is nullable (nothing to backfill it
-- from).
ALTER TABLE "Article" ADD COLUMN "sourcePlatform" TEXT NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Article" ADD COLUMN "readingTimeMinutes" INTEGER;
