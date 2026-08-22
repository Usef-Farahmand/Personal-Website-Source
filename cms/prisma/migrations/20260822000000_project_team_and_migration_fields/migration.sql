-- Task 06.1: add the Project/ProjectTranslation columns required to
-- losslessly migrate the existing public-site Project data into the CMS,
-- plus the new Team model.
--
-- SQLite has no ALTER COLUMN, but every column added below is a nullable
-- (or DEFAULT-backed) addition — a plain ADD COLUMN is sufficient and no
-- table rebuild is needed. No existing column is dropped, renamed, or
-- narrowed, so every CMS record created by earlier tasks (Task 01-06)
-- keeps working unchanged.

-- AlterTable: Project — release year, display order, and cross-content
-- references (see schema.prisma's Project model comments for why these
-- are plain fields/Json rather than relations).
ALTER TABLE "Project" ADD COLUMN "releaseYear" INTEGER;
ALTER TABLE "Project" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Project" ADD COLUMN "relatedProjectIds" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Project" ADD COLUMN "relatedArticleIds" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Project" ADD COLUMN "experienceId" TEXT;

-- AlterTable: ProjectTranslation — narrative fields carried by the public
-- site's ProjectTranslation type that this schema never had a column for.
ALTER TABLE "ProjectTranslation" ADD COLUMN "problem" TEXT;
ALTER TABLE "ProjectTranslation" ADD COLUMN "solution" TEXT;
ALTER TABLE "ProjectTranslation" ADD COLUMN "lessonsLearned" TEXT;
ALTER TABLE "ProjectTranslation" ADD COLUMN "targetAudience" TEXT;
ALTER TABLE "ProjectTranslation" ADD COLUMN "myRole" TEXT;
ALTER TABLE "ProjectTranslation" ADD COLUMN "featureHighlights" TEXT;

-- CreateTable: ProjectTeamMember
CREATE TABLE "ProjectTeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectTeamMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProjectTeamMember_projectId_order_idx" ON "ProjectTeamMember"("projectId", "order");

-- CreateTable: ProjectTeamMemberLink
CREATE TABLE "ProjectTeamMemberLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamMemberId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProjectTeamMemberLink_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "ProjectTeamMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProjectTeamMemberLink_teamMemberId_order_idx" ON "ProjectTeamMemberLink"("teamMemberId", "order");
