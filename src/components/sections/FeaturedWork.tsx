import { getTranslations } from "next-intl/server";
import { listFeaturedProjects } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Locale } from "@/content/types";

export async function FeaturedWork({ locale }: { locale: Locale }) {
  const featuredProjects = listFeaturedProjects(locale);
  const t = await getTranslations({ locale, namespace: "featuredWork" });

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section
      id="featured-work"
      className="mx-auto max-w-5xl scroll-mt-[var(--layout-header-height)] px-4 py-16 sm:px-6"
    >
      <div className="border-border mb-8 flex items-end justify-between border-t pt-12">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <Link
          href="/projects"
          className="text-small text-text-secondary hover:text-text-primary font-medium transition-colors"
        >
          {t("viewAll")} →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </section>
  );
}
