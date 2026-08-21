import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import RecentContentList from "@/components/admin/RecentContentList";
import { getDashboardStats, getRecentContent } from "@/lib/queries/dashboard";

export default async function AdminDashboardPage() {
  const [stats, recentContent] = await Promise.all([
    getDashboardStats(),
    getRecentContent(6),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          An overview of your Projects and Articles.
        </p>
      </div>

      <section aria-labelledby="projects-stats-heading">
        <h2
          id="projects-stats-heading"
          className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
        >
          Projects
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total" value={stats.totalProjects} />
          <StatCard label="Published" value={stats.publishedProjects} />
          <StatCard label="Draft" value={stats.draftProjects} />
        </div>
      </section>

      <section aria-labelledby="articles-stats-heading">
        <h2
          id="articles-stats-heading"
          className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
        >
          Articles
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total" value={stats.totalArticles} />
          <StatCard label="Published" value={stats.publishedArticles} />
          <StatCard label="Draft" value={stats.draftArticles} />
        </div>
      </section>

      <section aria-labelledby="recent-content-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="recent-content-heading"
            className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Recent Content
          </h2>
          <div className="flex gap-4 text-sm">
            <Link
              href="/admin/projects"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              All projects
            </Link>
            <Link
              href="/admin/articles"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              All articles
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <RecentContentList items={recentContent} />
        </div>
      </section>
    </div>
  );
}
