import { Link } from "@/i18n/navigation";

/**
 * Deliberately minimal — name only, no icon/level/description. The
 * homepage's job is breadth at a glance; depth lives on the Skills page
 * (SkillCard). Links to `/skills?skill=<id>` rather than `#<id>` — see
 * the Skills page for why the query-param approach was chosen over a
 * hash anchor.
 */
export function SkillChip({ id, name }: { id: string; name: string }) {
  return (
    <Link
      href={`/skills?skill=${id}`}
      className="border-border bg-surface text-small text-text-secondary hover:border-accent/50 hover:text-text-primary inline-block rounded-full border px-3 py-1.5 transition-colors"
    >
      {name}
    </Link>
  );
}
