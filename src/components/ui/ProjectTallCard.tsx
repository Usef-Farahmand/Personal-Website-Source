import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
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
  const [tCategory, tCard, tAlt] = await Promise.all([
    getTranslations({ locale, namespace: "projectCategory" }),
    getTranslations({ locale, namespace: "projectCard" }),
    getTranslations({ locale, namespace: "imageAlt" }),
  ]);

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-animate
      className={cn(
        "group border-border bg-surface relative isolate flex aspect-[4/5] h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-2xl border shadow-[0_10px_30px_-18px_rgb(0_0_0/0.8)] transition-shadow duration-300 hover:shadow-[0_14px_40px_-14px_rgb(249_115_22/0.45)]",
        className
      )}
    >
      {project.coverImageUrl ? (
        <Image
          src={project.coverImageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
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

      <div className="flex flex-col gap-3 p-5 sm:p-6">
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
        <span className="border-accent/50 text-accent self-start rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ltr:tracking-wider ltr:uppercase">
          {tCategory(project.category)}
        </span>
        {/* Revealed on hover (grid-rows 0fr → 1fr animates the height). */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-(--motion-ease-smooth) [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-focus-visible:grid-rows-[1fr]">
          <div className="min-h-0 overflow-hidden">
            <p className="line-clamp-3 pt-1 text-sm leading-relaxed text-white/75">
              {project.summary}
            </p>
            <span className="bg-accent text-background mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold">
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
