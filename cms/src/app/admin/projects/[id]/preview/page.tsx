import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/queries/projects";
import PreviewChrome from "@/components/admin/preview/PreviewChrome";
import ProjectPreviewContent from "@/components/admin/preview/ProjectPreviewContent";
import type { Locale } from "@/lib/validation/shared";

/**
 * Task 07, sections 3-5 & 21: a CMS-only route. It reads straight from
 * the CMS database via `getProjectById` — the same query the editor
 * itself uses, so Preview always reflects exactly what's saved,
 * including Draft/Archived content (section 21: Preview may show
 * Draft, but only through this local CMS route — never through a
 * public-website path). There's no public equivalent of this URL and
 * nothing here is reachable from the public site.
 */
export default async function ProjectPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string }>;
}) {
  const { id } = await params;
  const { locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "fa" ? "fa" : "en";

  const project = await getProjectById(id);
  if (!project) notFound();

  const previewBasePath = `/admin/projects/${id}/preview`;

  return (
    <PreviewChrome
      status={project.status}
      editHref={`/admin/projects/${id}`}
      previewBasePath={previewBasePath}
      locale={locale}
    >
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <ProjectPreviewContent
          project={project}
          locale={locale}
          previewBasePath={previewBasePath}
        />
      </div>
    </PreviewChrome>
  );
}
