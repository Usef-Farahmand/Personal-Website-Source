import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, listMedia } from "@/lib/queries/projects";
import ProjectForm from "@/components/admin/ProjectForm";
import SuccessBanner from "@/components/admin/SuccessBanner";

export default async function AdminProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;

  const [project, mediaOptions] = await Promise.all([
    getProjectById(id),
    listMedia(),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-4">
      <Link
        href="/admin/projects"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to Projects
      </Link>

      <SuccessBanner success={success} />

      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit Project
      </h1>

      <ProjectForm mode="edit" project={project} mediaOptions={mediaOptions} />
    </div>
  );
}
