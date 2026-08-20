"use client";

import { Users } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { TeamModal } from "@/components/ui/TeamModal";
import type { TeamMember } from "@/types/content";

interface ProjectTeamSectionProps {
  team?: TeamMember[];
  labels: {
    team: string;
    solo: string;
    teamOf: string;
    viewTeam: string;
    opensInNewTab: string;
  };
}

/**
 * The Team section's heading row: title on the start side, and on the
 * end side either "Solo" (no collaborators — no popup, nothing to
 * list) or the member count as a button that opens TeamModal. Client
 * component only for the popup's open/close state — the server parent
 * (project detail page) still does all the data resolution.
 */
export function ProjectTeamSection({ team, labels }: ProjectTeamSectionProps) {
  const modal = useModal();
  const hasTeam = Boolean(team && team.length > 0);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-h4 text-text-primary font-semibold">
          {labels.team}
        </h2>

        {hasTeam ? (
          <button
            type="button"
            onClick={modal.open}
            className="border-border text-small text-text-primary hover:border-accent/50 hover:text-accent inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-medium transition-colors"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            {labels.teamOf}
          </button>
        ) : (
          <span className="text-small text-text-secondary font-medium">
            {labels.solo}
          </span>
        )}
      </div>

      {hasTeam && (
        <TeamModal
          team={team!}
          isOpen={modal.isOpen}
          onClose={modal.close}
          title={labels.viewTeam}
          opensInNewTabLabel={labels.opensInNewTab}
        />
      )}
    </section>
  );
}
