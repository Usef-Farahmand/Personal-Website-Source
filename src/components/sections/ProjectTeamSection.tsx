"use client";

import { useModal } from "@/hooks/useModal";
import { Avatar } from "@/components/ui/Avatar";
import { TeamModal } from "@/components/ui/TeamModal";
import type { ResolvedTeamMember } from "@/types/content";

interface ProjectTeamSectionProps {
  team?: ResolvedTeamMember[];
  labels: {
    team: string;
    teamOf: string;
    viewTeam: string;
    opensInNewTab: string;
  };
}

/** Faces shown in the stack before the rest collapse into "+N". */
const VISIBLE_AVATARS = 3;

/**
 * The Team section, only for projects whose collaborators are listed:
 * a LinkedIn-style row of overlapping avatars (the first few, then
 * "+N") that opens TeamModal with everyone. Solo and personal projects
 * have no team section at all. Client component only for the popup's
 * open/close state.
 */
export function ProjectTeamSection({ team, labels }: ProjectTeamSectionProps) {
  const modal = useModal();
  if (!team || team.length === 0) return null;

  const shown = team.slice(0, VISIBLE_AVATARS);
  const rest = team.length - shown.length;

  return (
    <section>
      <h2 className="text-text-primary mb-4 text-2xl font-bold">
        {labels.team}
      </h2>
      <button
        type="button"
        onClick={modal.open}
        aria-haspopup="dialog"
        aria-label={`${labels.viewTeam} (${labels.teamOf})`}
        className="group inline-flex items-center gap-3 rounded-full"
      >
        <span className="flex -space-x-3 rtl:space-x-reverse">
          {shown.map((member) => (
            <span
              key={member.id}
              className="ring-background rounded-full ring-2 transition-transform group-hover:translate-y-[-2px]"
            >
              <Avatar src={member.avatarUrl} name={member.name} size="md" />
            </span>
          ))}
          {rest > 0 && (
            <span className="ring-background bg-surface text-text-primary border-border relative flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold ring-2 transition-transform group-hover:translate-y-[-2px]">
              +{rest}
            </span>
          )}
        </span>
        <span className="text-text-secondary group-hover:text-accent text-sm font-medium transition-colors">
          {labels.teamOf}
        </span>
      </button>

      <TeamModal
        team={team}
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={labels.viewTeam}
        opensInNewTabLabel={labels.opensInNewTab}
      />
    </section>
  );
}
