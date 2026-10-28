import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Locale, ResolvedProject } from "@/types/content";

/**
 * Wide "featured" slide at the top of the Projects index: the cover art
 * across the whole width with logo, title, category, summary and a
 * Details button over a dark fade on the start side.
 */
export async function ProjectFeatureCard({
  project,
  locale,
}: {
  project: ResolvedProject;
  locale: Locale;
}) {
  const [tCategory, tCard, tAlt] = await Promise.all([
    getTranslations({ locale, namespace: "projectCategory" }),
    getTranslations({ locale, namespace: "projectCard" }),
    getTranslations({ locale, namespace: "imageAlt" }),
  ]);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group border-border bg-surface relative isolate flex min-h-[26rem] w-full shrink-0 items-end overflow-hidden rounded-2xl border sm:aspect-[16/7] sm:min-h-0"
    >
      {project.coverImageUrl ? (
        <Image
          src={project.coverImageUrl}
          alt=""
          fill
          sizes="(min-width: 1152px) 72rem, 100vw"
          className="-z-10 object-cover transition-transform duration-700 ease-(--motion-ease-smooth) group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <BrandLogo size={80} className="opacity-20" />
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(10_10_11/0.95)_0%,rgb(10_10_11/0.55)_45%,transparent_80%)] sm:bg-[linear-gradient(to_right,rgb(10_10_11/0.95)_0%,rgb(10_10_11/0.7)_40%,transparent_75%)] sm:rtl:bg-[linear-gradient(to_left,rgb(10_10_11/0.95)_0%,rgb(10_10_11/0.7)_40%,transparent_75%)]"
      />
      <div className="flex max-w-xl flex-col gap-4 p-6 sm:p-10">
        <div className="flex items-center gap-4">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/10 sm:h-20 sm:w-20">
            {project.logoUrl ? (
              <Image
                src={project.logoUrl}
                alt={tAlt("logo", { name: project.title })}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="bg-accent/15 flex h-full w-full items-center justify-center">
                <BrandLogo size={32} />
              </span>
            )}
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="group-hover:text-accent text-3xl leading-tight font-bold text-white transition-colors sm:text-4xl">
              {project.title}
            </h3>
            <span className="border-accent/50 text-accent self-start rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ltr:tracking-wider ltr:uppercase">
              {tCategory(project.category)}
            </span>
          </div>
        </div>
        <p className="line-clamp-3 hidden text-sm leading-relaxed text-white/80 sm:block sm:text-base">
          {project.summary}
        </p>
        <span className="bg-accent text-background group-hover:bg-accent-hover inline-flex items-center gap-2 self-end rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ltr:self-start">
          {tCard("details")}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
