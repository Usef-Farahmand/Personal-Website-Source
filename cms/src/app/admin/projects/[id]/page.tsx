import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      status: true,
      translations: { select: { locale: true, title: true } },
    },
  });

  if (!project) notFound();

  const title =
    project.translations.find((translation) => translation.locale === "en")
      ?.title ??
    project.translations[0]?.title ??
    project.slug;

  return (
    <div className="space-y-4">
      <Link
        href="/admin/projects"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to Projects
      </Link>

      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-3 max-w-prose text-sm text-neutral-500 dark:text-neutral-400">
          Editing Projects isn&apos;t implemented yet — this is a placeholder.
          Full create, edit, and delete workflows for Projects will be built in
          the next task.
        </p>
      </div>
    </div>
  );
}
