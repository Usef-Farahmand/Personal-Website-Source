import ContentTable from "@/components/admin/ContentTable";
import { getProjectsList } from "@/lib/queries/content";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const projects = await getProjectsList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Projects
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {projects.length} {projects.length === 1 ? "project" : "projects"} in
          the database.
        </p>
      </div>

      <ContentTable
        items={projects}
        editHrefBase="/admin/projects"
        emptyMessage="No projects yet."
      />
    </div>
  );
}
