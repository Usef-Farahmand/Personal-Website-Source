import { prisma } from "../src/lib/db";

/**
 * Minimal development seed — a handful of realistic, clearly-labeled demo
 * records exercising every relationship in the schema (translations in
 * both locales, a project gallery, a project logo/cover, an article
 * header image). Not a migration of real site content (Task 01/02
 * explicitly defer that) — every string below is deliberately marked
 * "(Demo)" so it's unmistakable in the CMS UI once one exists.
 *
 * Uses `upsert` throughout on natural keys (slug, or the
 * [parentId, locale] unique constraint) rather than `create`, so running
 * `npx prisma db seed` repeatedly is safe and idempotent instead of
 * throwing a unique-constraint error on the second run.
 *
 * Relative import for `prisma` (not the `@/lib/db` alias used elsewhere
 * in the app) because this file runs standalone via `tsx`, outside
 * Next.js's module resolution — tsx doesn't apply the app's tsconfig
 * path aliases by default.
 */

async function main() {
  console.log("Seeding CMS database…");

  const logo = await prisma.media.upsert({
    where: { id: "seed-media-logo" },
    update: {},
    create: {
      id: "seed-media-logo",
      type: "IMAGE",
      title: "(Demo) Project logo",
      source: "/seed/demo-logo.png",
    },
  });

  const cover = await prisma.media.upsert({
    where: { id: "seed-media-cover" },
    update: {},
    create: {
      id: "seed-media-cover",
      type: "IMAGE",
      title: "(Demo) Project cover image",
      source: "/seed/demo-cover.png",
      thumbnail: "/seed/demo-cover-thumb.png",
    },
  });

  const screenshot = await prisma.media.upsert({
    where: { id: "seed-media-screenshot-1" },
    update: {},
    create: {
      id: "seed-media-screenshot-1",
      type: "IMAGE",
      title: "(Demo) Gameplay screenshot",
      source: "/seed/demo-screenshot-1.png",
    },
  });

  const articleHeader = await prisma.media.upsert({
    where: { id: "seed-media-article-header" },
    update: {},
    create: {
      id: "seed-media-article-header",
      type: "IMAGE",
      title: "(Demo) Article header image",
      source: "/seed/demo-article-header.png",
    },
  });

  const project = await prisma.project.upsert({
    where: { slug: "demo-seed-project" },
    update: {},
    create: {
      slug: "demo-seed-project",
      status: "DRAFT",
      featured: false,
      technologies: ["Unity", "C#", "Next.js"],
      platforms: ["desktop", "web"],
      startDate: new Date("2025-01-01"),
      logoMediaId: logo.id,
      coverMediaId: cover.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: project.id } });
  await prisma.projectLink.createMany({
    data: [
      {
        projectId: project.id,
        type: "REPOSITORY",
        label: "Repository",
        url: "https://github.com/example/demo-seed-project",
        order: 0,
      },
    ],
  });

  await prisma.projectTranslation.upsert({
    where: { projectId_locale: { projectId: project.id, locale: "en" } },
    update: {},
    create: {
      projectId: project.id,
      locale: "en",
      title: "(Demo) Seed Project",
      shortDescription: "A placeholder project created by the seed script.",
      description:
        "This is placeholder content created by prisma/seed.ts to verify the database layer end to end. It is not real site content.",
      category: "game",
      tags: ["demo", "seed-data"],
      seoTitle: "(Demo) Seed Project — useffarahmand.com",
      seoDescription: "Placeholder SEO description for the demo seed project.",
    },
  });

  await prisma.projectTranslation.upsert({
    where: { projectId_locale: { projectId: project.id, locale: "fa" } },
    update: {},
    create: {
      projectId: project.id,
      locale: "fa",
      title: "(نمونه) پروژه آزمایشی",
      shortDescription: "یک پروژه نمایشی ایجاد شده توسط اسکریپت seed.",
      description:
        "این محتوای نمایشی توسط prisma/seed.ts ایجاد شده تا لایه دیتابیس را سرتاسر بررسی کند. این محتوای واقعی سایت نیست.",
      category: "game",
      tags: ["نمونه", "داده-آزمایشی"],
    },
  });

  await prisma.projectMedia.upsert({
    where: {
      projectId_mediaId: { projectId: project.id, mediaId: screenshot.id },
    },
    update: {},
    create: {
      projectId: project.id,
      mediaId: screenshot.id,
      order: 0,
    },
  });

  const article = await prisma.article.upsert({
    where: { slug: "demo-seed-article" },
    update: {},
    create: {
      slug: "demo-seed-article",
      status: "DRAFT",
      featured: false,
      sourceUrl: "https://example.com/demo-seed-article",
      headerMediaId: articleHeader.id,
    },
  });

  await prisma.articleTranslation.upsert({
    where: { articleId_locale: { articleId: article.id, locale: "en" } },
    update: {},
    create: {
      articleId: article.id,
      locale: "en",
      title: "(Demo) Seed Article",
      summary: "A placeholder article created by the seed script.",
      category: "software-engineering",
      tags: ["demo", "seed-data"],
      seoTitle: "(Demo) Seed Article — useffarahmand.com",
      seoDescription: "Placeholder SEO description for the demo seed article.",
    },
  });

  await prisma.articleTranslation.upsert({
    where: { articleId_locale: { articleId: article.id, locale: "fa" } },
    update: {},
    create: {
      articleId: article.id,
      locale: "fa",
      title: "(نمونه) مقاله آزمایشی",
      summary: "یک مقاله نمایشی ایجاد شده توسط اسکریپت seed.",
      category: "software-engineering",
      tags: ["نمونه", "داده-آزمایشی"],
    },
  });

  console.log("Seed complete:");
  console.log(`  Project  ${project.slug} (${project.id})`);
  console.log(`  Article  ${article.slug} (${article.id})`);
  console.log(`  Media    4 records`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
