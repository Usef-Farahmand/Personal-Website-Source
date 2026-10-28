import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { isPersonalProject } from "@/services/content/projects.service";
import type { Locale, ResolvedProject } from "@/types/content";

/** Technology chips shown per card; the rest collapse into "+N" so every
 *  card keeps the same height. */
const MAX_TECHS = 5;

export async function ProjectCard({
  project,
  locale,
}: {
  project: ResolvedProject;
  locale: Locale;
}) {
  const [tStatus, tPlatform, tCard, tAlt, tDetail] = await Promise.all([
    getTranslations({ locale, namespace: "projectStatus" }),
    getTranslations({ locale, namespace: "projectPlatform" }),
    getTranslations({ locale, namespace: "projectCard" }),
    getTranslations({ locale, namespace: "imageAlt" }),
    getTranslations({ locale, namespace: "projectDetail" }),
  ]);

  const platformLine = [
    project.platforms.map((platform) => tPlatform(platform)).join(" · "),
    project.releaseYear,
  ]
    .filter(Boolean)
    .join(" · ");

  const logoSrc = project.logoUrl ?? project.coverImageUrl;
  const visibleTechs = project.technologies.slice(0, MAX_TECHS);
  const hiddenTechCount = project.technologies.length - visibleTechs.length;

  // Layout follows the Projects list's view switcher through the grid's
  // data-view (FilterableGrid): "icons" = logo + name only, like a store
  // grid (the "Cards" view uses ProjectTallCard instead). Outside that grid
  // (e.g. Related Projects) none of these variants apply and the card is
  // the regular vertical card.
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-animate
      className="group border-border bg-surface hover:border-accent/50 card-lift flex h-full flex-col gap-4 rounded-lg border p-6 group-data-[view=icons]/list:items-center group-data-[view=icons]/list:gap-2.5 group-data-[view=icons]/list:p-3 group-data-[view=icons]/list:text-center sm:group-data-[view=icons]/list:p-4"
    >
      <div className="bg-background relative aspect-video shrink-0 overflow-hidden rounded-md group-data-[view=icons]/list:hidden">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-(--motion-ease-smooth) group-hover:scale-105"
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

      <div className="flex min-w-0 flex-1 flex-col gap-4 group-data-[view=icons]/list:items-center group-data-[view=icons]/list:gap-2">
        <div className="flex items-start gap-3 group-data-[view=icons]/list:flex-col group-data-[view=icons]/list:items-center group-data-[view=icons]/list:gap-2.5">
          <span className="bg-accent/10 text-accent relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md transition-transform duration-300 group-data-[view=icons]/list:h-16 group-data-[view=icons]/list:w-16 group-data-[view=icons]/list:rounded-2xl group-data-[view=icons]/list:shadow-lg group-data-[view=icons]/list:group-hover:scale-105 sm:group-data-[view=icons]/list:h-20 sm:group-data-[view=icons]/list:w-20">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={tAlt("logo", { name: project.title })}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <BrandLogo size={22} />
            )}
          </span>
          <div className="w-full min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2 group-data-[view=icons]/list:justify-center">
              <h3 className="text-h4 text-text-primary group-hover:text-accent line-clamp-2 font-semibold transition-colors duration-300 group-data-[view=icons]/list:text-sm group-data-[view=icons]/list:leading-snug">
                {project.title}
              </h3>
              <span className="flex shrink-0 items-center gap-1.5 group-data-[view=icons]/list:hidden">
                {isPersonalProject(project) && (
                  <span className="border-accent/40 text-accent rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold whitespace-nowrap">
                    {tDetail("personalProject")}
                  </span>
                )}
                <StatusBadge
                  status={project.status}
                  label={tStatus(project.status)}
                />
              </span>
            </div>
            {platformLine && (
              <p className="text-caption text-text-secondary truncate group-data-[view=icons]/list:hidden">
                {platformLine}
              </p>
            )}
          </div>
        </div>

        <ul className="mt-auto flex flex-wrap gap-2 group-data-[view=icons]/list:hidden">
          {visibleTechs.map((tech) => (
            <li
              key={tech}
              className="bg-background text-caption text-text-secondary rounded-md px-2 py-1"
            >
              {tech}
            </li>
          ))}
          {hiddenTechCount > 0 && (
            <li className="bg-background text-caption text-text-secondary rounded-md px-2 py-1">
              +{hiddenTechCount}
            </li>
          )}
        </ul>
      </div>
    </Link>
  );
}
