import { prisma } from "@/lib/db";

/**
 * Placeholder landing page for the CMS foundation.
 *
 * Task 01 explicitly excludes building Projects/Articles CRUD and the
 * full Admin UI — this page exists only to prove the app boots, connects
 * to its own local SQLite database, and reads through the Prisma
 * singleton correctly. The counts below will become real navigation
 * targets once CRUD is implemented in a later task.
 */
export default async function DashboardPage() {
  const [projectCount, articleCount, mediaCount] = await Promise.all([
    prisma.project.count(),
    prisma.article.count(),
    prisma.media.count(),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Local CMS — Foundation</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        This app runs only on your machine and is not deployed. Content
        management screens are not built yet — this is the data-layer
        foundation.
      </p>

      <dl className="mt-10 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <dt className="text-xs tracking-wide text-neutral-500 uppercase">
            Projects
          </dt>
          <dd className="mt-1 text-2xl font-semibold">{projectCount}</dd>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <dt className="text-xs tracking-wide text-neutral-500 uppercase">
            Articles
          </dt>
          <dd className="mt-1 text-2xl font-semibold">{articleCount}</dd>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <dt className="text-xs tracking-wide text-neutral-500 uppercase">
            Media
          </dt>
          <dd className="mt-1 text-2xl font-semibold">{mediaCount}</dd>
        </div>
      </dl>
    </main>
  );
}
