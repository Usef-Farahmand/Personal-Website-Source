import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Locale, ResolvedProject } from "@/types/content";

export async function ProjectCard({
  project,
  locale,
}: {
  project: ResolvedProject;
  locale: Locale;
}) {
  const [tStatus, tPlatform, tCard] = await Promise.all([
    getTranslations({ locale, namespace: "projectStatus" }),
    getTranslations({ locale, namespace: "projectPlatform" }),
    getTranslations({ locale, namespace: "projectCard" }),
  ]);

  const platformLine = [
    project.platforms.map((platform) => tPlatform(platform)).join(" · "),
    project.releaseYear,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-animate
      className="group border-border bg-surface hover:border-accent/50 flex flex-col gap-4 rounded-lg border p-6 transition-colors"
    >
      <div className="bg-background relative aspect-video overflow-hidden rounded-md">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BrandLogo size={48} className="opacity-30" />
          </div>
        )}

        {project.featured && (
          <span className="bg-background/90 text-accent text-caption absolute start-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium">
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            {tCard("featuredBadge")}
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <span className="bg-accent/10 text-accent relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
          {project.logoUrl ? (
            <Image src={project.logoUrl} alt="" fill className="object-cover" />
          ) : (
            <BrandLogo size={22} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-h4 text-text-primary group-hover:text-accent truncate font-semibold">
              {project.title}
            </h3>
            <StatusBadge
              status={project.status}
              label={tStatus(project.status)}
            />
          </div>
          {platformLine && (
            <p className="text-caption text-text-secondary">{platformLine}</p>
          )}
        </div>
      </div>

      <p className="text-small text-text-secondary">{project.summary}</p>

      <ul className="mt-auto flex flex-wrap gap-2">
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
