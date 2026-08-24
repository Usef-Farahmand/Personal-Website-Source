/**
 * Task 07, sections 17-19: the boundary the *next* task's static
 * export/deployment step will read through. Nothing else in this file
 * hooks up publishing to the public website at runtime — the public
 * website stays completely independent of Prisma/SQLite/this CMS (see
 * next.config.ts's turbopack.root comment for how that separation is
 * enforced at the build-tool level too).
 *
 * Every query here is `where: { status: "PUBLISHED" }` — never
 * anything looser. This is the one place in the codebase a future
 * export script is meant to import from; it should never need to
 * reach for `prisma` directly to answer "what's publishable" (section
 * 18: "Do not expose Prisma directly to the future publishing layer").
 */

import { prisma } from "@/lib/db";
import type { MediaOption } from "@/lib/queries/media";

/**
 * Full Project detail for every currently-Published project, in the
 * same shape `getProjectById` already returns (translations, links,
 * gallery with resolved media, logo, cover, team) — a future export
 * step needs the full record, not a summarized list-item shape like
 * `ProjectListItem`.
 */
export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: {
      translations: true,
      links: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" }, include: { media: true } },
      logo: true,
      cover: true,
      team: {
        orderBy: { order: "asc" },
        include: { links: { orderBy: { order: "asc" } } },
      },
    },
  });
}

/** Full Article detail for every currently-Published article. */
export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: {
      translations: true,
      headerImage: true,
    },
  });
}

/**
 * Every Media record actually referenced by currently-Published
 * content (Project logo/cover/gallery, Article header image) —
 * deduplicated by id. This is the list a future export step needs to
 * know which uploaded files under `public/uploads/` must be copied
 * into the static site's own asset bundle; Media rows that only exist
 * on Draft/Archived content are deliberately excluded, same as the
 * content itself.
 */
export async function getPublishedMedia(): Promise<MediaOption[]> {
  const [projects, articles] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: {
        logo: true,
        cover: true,
        gallery: { select: { media: true } },
      },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { headerImage: true },
    }),
  ]);

  const byId = new Map<string, MediaOption>();
  const add = (media: MediaOption | null | undefined) => {
    if (media) byId.set(media.id, media);
  };

  for (const project of projects) {
    add(project.logo);
    add(project.cover);
    for (const entry of project.gallery) add(entry.media);
  }
  for (const article of articles) add(article.headerImage);

  return [...byId.values()];
}
