import { projects } from "@/content/projects";
import { resolveTranslation, type ListOptions } from "./shared";
import { getTeamMembersByIds } from "./team.service";
import type {
  Locale,
  Project,
  ProjectStatus,
  ResolvedProject,
} from "@/types/content";

/** Resolves a project's authored `team` id list (see Project.team) into
 *  full TeamMember records, or `undefined` for a solo project — matches
 *  the "absent/empty team means solo" contract ProjectTeamSection
 *  already relies on, rather than returning an empty array either way. */
function resolveProjectTeam(
  ids: string[] | undefined,
  locale: Locale
): ResolvedProject["team"] {
  if (!ids || ids.length === 0) return undefined;
  const members = getTeamMembersByIds(ids, locale);
  return members.length > 0 ? members : undefined;
}

/** Applies resolveTranslation and then swaps the id-list `team` field
 *  for its resolved TeamMember records — every public accessor below
 *  goes through this rather than calling resolveTranslation directly,
 *  so ResolvedProject.team is never left as an unresolved id array. */
function toResolvedProject(project: Project, locale: Locale): ResolvedProject {
  const resolved = resolveTranslation(project, locale) as ResolvedProject;
  return { ...resolved, team: resolveProjectTeam(project.team, locale) };
}

/** Display priority for a project's status — lower sorts first.
 *  active > shipped > paused > archived, per Content Strategy.
 *  Exported so the projects page can build the same ordering into its
 *  "newest" ListToolbar sort value (status first, then date). */
export const STATUS_PRIORITY: Record<ProjectStatus, number> = {
  active: 0,
  shipped: 1,
  paused: 2,
  archived: 3,
};

export function listProjects(locale: Locale): ResolvedProject[] {
  return [...projects]
    .sort((a, b) => {
      const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      if (statusDiff !== 0) return statusDiff;
      return b.startDate.localeCompare(a.startDate);
    })
    .map((project) => toResolvedProject(project, locale));
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
  return project ? toResolvedProject(project, locale) : null;
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
    .map((project) => toResolvedProject(project, locale));
}
