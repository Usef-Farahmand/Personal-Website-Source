import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { isPersonalProject } from "@/services/content/projects.service";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";
import type { Locale, ResolvedProject } from "@/types/content";

/**
 * Portrait project card: cover art full-bleed, logo, title and category
 * over a dark fade at the bottom; the summary and a "Details" button
 * slide in on hover (always shown on touch screens, which can't hover).
 * Used by the Projects index ("Cards" view) and "You may also like".
 */
export async function ProjectTallCard({
  project,
  locale,
  className,
}: {
  project: ResolvedProject;
  locale: Locale;
  className?: string;
}) {
  const [tCategory, tCard, tAlt, tDetail, tStatus] = await Promise.all([
    getTranslations({ locale, namespace: "projectCategory" }),
    getTranslations({ locale, namespace: "projectCard" }),
    getTranslations({ locale, namespace: "imageAlt" }),
    getTranslations({ locale, namespace: "projectDetail" }),
    getTranslations({ locale, namespace: "projectStatus" }),
  ]);

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-animate
      className={cn(
        "group border-border bg-surface relative isolate flex aspect-[4/5] h-full min-h-[22rem] w-full flex-col justify-end overflow-hidden rounded-2xl border shadow-[0_10px_30px_-18px_rgb(0_0_0/0.8)] transition-shadow duration-300 hover:shadow-[0_14px_40px_-14px_rgb(249_115_22/0.45)] lg:group-data-[view=grid]/list:aspect-auto",
        className
      )}
    >
      {project.coverImageUrl ? (
        <Image
          src={project.coverImageUrl}
          alt=""
          fill
          // Landscape covers fill a portrait card, so the image is drawn
          // about twice as wide as the card: ask for that width, or the
          // browser picks a too-small file and upscales it (blurry).
          sizes="(min-width: 1024px) 56rem, (min-width: 640px) 90vw, 180vw"
          className="-z-10 object-cover transition-transform duration-700 ease-(--motion-ease-smooth) group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <BrandLogo size={64} className="opacity-20" />
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(10_10_11/0.97)_0%,rgb(10_10_11/0.85)_35%,rgb(10_10_11/0.1)_70%,transparent_100%)]"
      />

      <div
        data-card-text
        // Room for the Details button pinned to the bottom end corner,
        // opposite the logo and title (left in Persian, right in English).
        className="flex flex-col gap-3 p-5 pb-[4.25rem] sm:p-6 sm:pb-[4.75rem]"
      >
        <span className="relative h-14 w-14 overflow-hidden rounded-xl shadow-lg ring-2 ring-white/10">
          {project.logoUrl ? (
            <Image
              src={project.logoUrl}
              alt={tAlt("logo", { name: project.title })}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <span className="bg-accent/15 flex h-full w-full items-center justify-center">
              <BrandLogo size={26} />
            </span>
          )}
        </span>
        <h3 className="group-hover:text-accent line-clamp-2 text-xl font-bold text-white transition-colors">
          {project.title}
        </h3>
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="border-accent/50 text-accent rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ltr:tracking-wider ltr:uppercase">
            {tCategory(project.category)}
          </span>
          <StatusBadge
            status={project.status}
            label={tStatus(project.status)}
          />
          {isPersonalProject(project) && (
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-white/85 backdrop-blur-sm">
              {tDetail("personalProject")}
            </span>
          )}
        </span>
        {/* Revealed on hover (grid-rows 0fr → 1fr animates the height). */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-(--motion-ease-smooth) [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-focus-visible:grid-rows-[1fr]">
          <div className="flex min-h-0 flex-col overflow-hidden">
            <p className="line-clamp-3 pt-1 text-sm leading-relaxed text-white/75">
              {project.summary}
            </p>
            <span className="bg-accent text-background absolute end-5 bottom-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-opacity duration-300 sm:end-6 sm:bottom-6 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
              {tCard("details")}
              <ArrowRight
                className="h-4 w-4 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
