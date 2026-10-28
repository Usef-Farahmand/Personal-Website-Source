import { projects } from "@/content/projects";
import { articles } from "@/content/articles";
import { skills } from "@/content/skills";
import { resolveSkillIdForTechnology } from "./skills.service";
import type { Article, Project, Skill } from "@/types/content";

/**
 * The one place cross-links between projects, skills and articles are
 * worked out, so every page shows the same, two-way relationships.
 *
 * The authored id lists (Skill.relatedProjectIds, Project.relatedArticleIds,
 * ...) only ever point one way and drift as content is added — a project
 * listing an article doesn't make the article list the project back, and a
 * new project using "Unity" never shows up under the Unity skill unless
 * someone edits skills.data.ts too. So each relation here is the union of:
 *
 * - project ↔ skill: the skill's authored relatedProjectIds, plus every
 *   project whose `technologies` resolve to that skill (the same resolver
 *   the project page uses to link technology chips);
 * - project ↔ article and project ↔ project: the authored ids on either
 *   side, in both directions;
 * - skill ↔ article: the skill's authored relatedArticleIds (article tags
 *   are too loose — "AI", "Culture" — to match skills reliably).
 *
 * Ids that no longer resolve are dropped. Results are ids in content
 * order; callers resolve them for a locale with the usual services.
 */

const projectById = new Map(projects.map((p) => [p.id, p]));
const articleById = new Map(articles.map((a) => [a.id, a]));
const skillsInOrder = [...skills].sort((a, b) => a.order - b.order);

function techSkillIds(project: Project): Set<string> {
  return new Set(
    project.technologies
      .map((tech) => resolveSkillIdForTechnology(tech))
      .filter((id): id is string => Boolean(id))
  );
}

function existing<T>(ids: Iterable<string>, byId: Map<string, T>): string[] {
  return [...new Set(ids)].filter((id) => byId.has(id));
}

/** Skills a project demonstrates, in skill order. */
export function skillIdsForProject(projectId: string): string[] {
  const project = projectById.get(projectId);
  if (!project) return [];
  const viaTech = techSkillIds(project);
  return skillsInOrder
    .filter(
      (skill) =>
        viaTech.has(skill.id) || skill.relatedProjectIds?.includes(projectId)
    )
    .map((skill) => skill.id);
}

/** Projects that demonstrate a skill, in project content order. */
export function projectIdsForSkill(
  skill: Pick<Skill, "id" | "relatedProjectIds">
): string[] {
  const explicit = new Set(skill.relatedProjectIds ?? []);
  return projects
    .filter((p) => explicit.has(p.id) || techSkillIds(p).has(skill.id))
    .map((p) => p.id);
}

export function articleIdsForSkill(
  skill: Pick<Skill, "relatedArticleIds">
): string[] {
  return existing(skill.relatedArticleIds ?? [], articleById);
}

/** Articles linked to a project from either side. */
export function articleIdsForProject(projectId: string): string[] {
  const project = projectById.get(projectId);
  if (!project) return [];
  const backLinked = articles
    .filter((a: Article) => a.relatedProjectIds.includes(project.id))
    .map((a) => a.id);
  return existing([...project.relatedArticleIds, ...backLinked], articleById);
}

/** Projects linked to a project from either side. */
export function relatedProjectIdsForProject(projectId: string): string[] {
  const project = projectById.get(projectId);
  if (!project) return [];
  const backLinked = projects
    .filter((p) => p.relatedProjectIds.includes(project.id))
    .map((p) => p.id);
  return existing(
    [...project.relatedProjectIds, ...backLinked],
    projectById
  ).filter((id) => id !== project.id);
}
