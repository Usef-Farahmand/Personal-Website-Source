import teamData from "./team.json";
import type { TeamMember } from "@/types/content";

/**
 * Centralized team-member directory — the single source of truth for
 * anyone referenced by id from Project.team or Recommendation.personId.
 * Plain JSON rather than a typed .ts literal, same reasoning and same
 * "cast stands in for compile-time shape-checking" caveat as
 * content/recommendations/index.ts: nothing here is localized (a
 * person's name/role/links don't change by language), so there's no
 * translations map to make a hand-written .ts file worth its extra
 * ceremony over plain data.
 *
 * `id` is the one field content authors must get right by hand: it's a
 * stable foreign key persisted in Project.team and
 * Recommendation.personId, so renaming an id here silently breaks every
 * reference to it elsewhere. The duplicate check below is a load-time
 * guard against the one authoring mistake that's both easy to make and
 * silently wrong (a duplicate id makes `getTeamMemberById` return
 * whichever entry happens to be found first) — it throws immediately,
 * the same "broken content should fail loud and fast at load time"
 * precedent as resolveTranslation's missing-fallback throw in
 * services/content/shared.ts. This deliberately does NOT extend to a
 * general schema-validation pass (e.g. Zod) — that would be the kind of
 * unnecessary abstraction the project's content model already avoids in
 * recommendations/index.ts's doc comment, and a bad `id` is the only
 * mistake here that corrupts *other* content rather than just this
 * member's own display.
 */
export const teamMembers = teamData as TeamMember[];

const duplicateIds = new Set<string>();
const seenIds = new Set<string>();
for (const member of teamMembers) {
  if (seenIds.has(member.id)) {
    duplicateIds.add(member.id);
  }
  seenIds.add(member.id);
}
if (duplicateIds.size > 0) {
  throw new Error(
    `content/team/team.json has duplicate team member id(s): ${[...duplicateIds].join(", ")}. Ids must be unique — every Project.team and Recommendation.personId reference depends on it.`
  );
}
