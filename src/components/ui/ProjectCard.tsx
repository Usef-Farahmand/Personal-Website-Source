import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Locale, ResolvedProject } from "@/content/types";

export async function ProjectCard({
  project,
  locale,
}: {
  project: ResolvedProject;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "projectStatus" });

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group border-border bg-surface hover:border-accent/50 flex flex-col gap-3 rounded-lg border p-6 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-h4 text-text-primary group-hover:text-accent font-semibold">
          {project.title}
        </h3>
        <StatusBadge status={project.status} label={t(project.status)} />
      </div>

      <p className="text-small text-text-secondary">{project.summary}</p>

      <ul className="mt-2 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <li
            key={tech}
            className="bg-background text-caption text-text-secondary rounded-md px-2 py-1"
          >
            {tech}
          </li>
        ))}
      </ul>
    </Link>
  );
}
