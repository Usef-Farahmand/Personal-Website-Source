import Link from "next/link";
import { listMedia } from "@/lib/queries/projects";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const mediaOptions = await listMedia();

  return (
    <div className="space-y-4">
      <Link
        href="/admin/projects"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to Projects
      </Link>

      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        New Project
      </h1>

      <ProjectForm mode="create" mediaOptions={mediaOptions} />
    </div>
  );
}
