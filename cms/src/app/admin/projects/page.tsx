import Link from "next/link";
import { listProjects, type ProjectSort } from "@/lib/queries/projects";
import type { ContentStatus } from "@/lib/validation/shared";
import ProjectsToolbar from "@/components/admin/ProjectsToolbar";
import ProjectsTable from "@/components/admin/ProjectsTable";
import SuccessBanner from "@/components/admin/SuccessBanner";

export const metadata = { title: "Projects" };

const VALID_STATUSES: (ContentStatus | "ALL")[] = [
  "ALL",
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];
const VALID_SORTS: ProjectSort[] = [
  "updated-desc",
  "updated-asc",
  "title-asc",
  "title-desc",
];

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    success?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status = VALID_STATUSES.includes(params.status as ContentStatus)
    ? (params.status as ContentStatus | "ALL")
    : "ALL";
  const sort = VALID_SORTS.includes(params.sort as ProjectSort)
    ? (params.sort as ProjectSort)
    : "updated-desc";

  const projects = await listProjects({ search, status, sort });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Projects
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
            {search || status !== "ALL"
              ? " matching your filters"
              : " in the database"}
            .
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          + New Project
        </Link>
      </div>

      <SuccessBanner success={params.success} />

      <ProjectsToolbar search={search} status={status} sort={sort} />

      <ProjectsTable
        items={projects}
        emptyMessage={
          search || status !== "ALL"
            ? "No projects match your filters."
            : "No projects yet."
        }
      />
    </div>
  );
}
