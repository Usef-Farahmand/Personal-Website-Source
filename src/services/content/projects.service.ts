import { projects } from "@/content/projects";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, Project, ResolvedProject } from "@/types/content";

export function listProjects(locale: Locale): ResolvedProject[] {
  return [...projects]
    .sort((a, b) => a.order - b.order)
    .map((project) => resolveTranslation(project, locale) as ResolvedProject);
}

export function listFeaturedProjects(
  locale: Locale,
  options?: ListOptions
): ResolvedProject[] {
  const featured = listProjects(locale).filter((project) => project.featured);
  return options?.limit ? featured.slice(0, options.limit) : featured;
}

export function getProjectBySlug(
  slug: string,
  locale: Locale
): ResolvedProject | null {
  const project = projects.find((p: Project) => p.slug === slug);
  return project
    ? (resolveTranslation(project, locale) as ResolvedProject)
    : null;
}

/** Resolves Project.relatedProjectIds into full ResolvedProject records,
 *  in the order authored, silently skipping any id that no longer
 *  resolves (e.g. a related project that was later removed) rather than
 *  throwing — a dangling id shouldn't break the whole detail page. */
export function getProjectsByIds(
  ids: string[],
  locale: Locale
): ResolvedProject[] {
  return ids
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p))
    .map((project) => resolveTranslation(project, locale) as ResolvedProject);
}
