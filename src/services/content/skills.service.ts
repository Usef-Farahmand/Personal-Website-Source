import { skills } from "@/content/skills";
import { resolveTranslation } from "./shared";
import type { Locale, ResolvedSkill } from "@/types/content";

export function listSkills(locale: Locale): ResolvedSkill[] {
  return [...skills]
    .sort((a, b) => a.order - b.order)
    .map((skill) => resolveTranslation(skill, locale) as ResolvedSkill);
}

/**
 * Technology name (lowercased) -> owning Skill id, built once from
 * `Skill.technologies` across every skill in content/skills. This is a
 * *resolver*, not a new content model: `Project.technologies` stays a
 * plain `string[]` (see types/content.ts) so no project data needs
 * migrating — a project's free-text technology label is looked up
 * against this map on render instead of carrying a skill id itself.
 *
 * Built lazily and cached at module scope — the skills list is static
 * content, not user input, so it never needs to be rebuilt within a
 * process.
 *
 * A technology name shared by more than one skill's `technologies`
 * (e.g. "TypeScript" appears on both skill-typescript-nextjs and
 * skill-cocos-creator; "Web Game" on both skill-html5-game-development
 * and skill-web-game-development) resolves to whichever skill is
 * defined first in skills.data.ts (i.e. lowest `order`) — deterministic
 * and stable across renders, even though it can't know which specific
 * project context the label was used in.
 */
let technologySkillMap: Map<string, string> | null = null;

function buildTechnologySkillMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const skill of skills) {
    for (const technology of skill.technologies ?? []) {
      const key = technology.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, skill.id);
      }
    }
  }
  return map;
}

/**
 * Resolves a free-text technology label (as authored on
 * `Project.technologies`) to the id of the Skill that lists it, or
 * `undefined` when no Skill covers that technology. Case- and
 * whitespace-insensitive so "next.js" / "Next.js " both match the
 * authored "Next.js" entry. Callers use the returned id to link to
 * `/skills?skill=<id>` (the existing Skill deep-link contract — see the
 * Skills page) and must skip linking entirely when this returns
 * `undefined`, rather than guessing or linking to a mismatched skill.
 */
export function resolveSkillIdForTechnology(
  technology: string
): string | undefined {
  if (!technologySkillMap) {
    technologySkillMap = buildTechnologySkillMap();
  }
  return technologySkillMap.get(technology.trim().toLowerCase());
}

/** Groups the already-ordered skill list by domain, preserving each
 *  domain's first-appearance order (driven by Skill.order in the content
 *  data, not alphabetically) — both SkillsPreview (homepage) and the
 *  Skills page render from this so the category order can never drift
 *  between the two surfaces. */
export function groupSkillsByDomain(
  skillList: ResolvedSkill[]
): { domain: ResolvedSkill["domain"]; skills: ResolvedSkill[] }[] {
  const groups: { domain: ResolvedSkill["domain"]; skills: ResolvedSkill[] }[] =
    [];
  for (const skill of skillList) {
    const existing = groups.find((g) => g.domain === skill.domain);
    if (existing) {
      existing.skills.push(skill);
    } else {
      groups.push({ domain: skill.domain, skills: [skill] });
    }
  }
  return groups;
}
