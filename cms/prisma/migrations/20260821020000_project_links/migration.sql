-- CreateTable
CREATE TABLE "ProjectLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProjectLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProjectLink_projectId_order_idx" ON "ProjectLink"("projectId", "order");

-- Backfill: migrate the three fixed URL columns into ProjectLink rows
-- before dropping them, so existing data (e.g. seed data, anything an
-- administrator already entered) isn't silently lost.
INSERT INTO "ProjectLink" ("id", "projectId", "type", "label", "url", "order")
SELECT lower(hex(randomblob(16))), "id", 'WEBSITE', 'Website', "websiteUrl", 0
FROM "Project" WHERE "websiteUrl" IS NOT NULL;

INSERT INTO "ProjectLink" ("id", "projectId", "type", "label", "url", "order")
SELECT lower(hex(randomblob(16))), "id", 'REPOSITORY', 'Repository', "repositoryUrl", 1
FROM "Project" WHERE "repositoryUrl" IS NOT NULL;

INSERT INTO "ProjectLink" ("id", "projectId", "type", "label", "url", "order")
SELECT lower(hex(randomblob(16))), "id", 'WEBSITE', 'Live', "liveUrl", 2
FROM "Project" WHERE "liveUrl" IS NOT NULL;

-- AlterTable: drop the now-superseded fixed URL columns (see
-- Project.links in schema.prisma for the full rationale).
ALTER TABLE "Project" DROP COLUMN "websiteUrl";
ALTER TABLE "Project" DROP COLUMN "repositoryUrl";
ALTER TABLE "Project" DROP COLUMN "liveUrl";
