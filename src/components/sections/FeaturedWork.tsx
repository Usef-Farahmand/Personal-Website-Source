import { getTranslations } from "next-intl/server";
import { listFeaturedProjects } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/content/types";

// Homepage preview shows the 2 most prominent featured projects; the
// dedicated /projects page (listProjects with no limit) shows the full
// collection, reusing the exact same ProjectsGrid/ProjectCard components.
const PREVIEW_LIMIT = 2;

export async function FeaturedWork({ locale }: { locale: Locale }) {
  const featuredProjects = listFeaturedProjects(locale, {
    limit: PREVIEW_LIMIT,
  });
  const t = await getTranslations({ locale, namespace: "featuredWork" });

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <Section id="featured-work" as="section" className="border-border border-t">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/projects" label={t("viewAll")} />
      </div>

      <ProjectsGrid>
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </ProjectsGrid>
    </Section>
  );
}
