"use client";

import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { Avatar } from "@/components/ui/Avatar";
import type { TeamMember } from "@/types/content";

interface TeamModalProps {
  team: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
  opensInNewTabLabel: string;
}

/**
 * Popup listing every collaborator on a project — name, avatar, and
 * their profile links — triggered by the Team section's member-count
 * button. Mirrors RecommendationModal's shell usage (Overlay + Avatar)
 * rather than reinventing dialog choreography.
 */
export function TeamModal({
  team,
  isOpen,
  onClose,
  title,
  opensInNewTabLabel,
}: TeamModalProps) {
  return (
    <Overlay isOpen={isOpen} onClose={onClose} title={title} visuallyHiddenTitle={false}>
      <ul className="flex flex-col gap-5">
        {team.map((member) => (
          <li key={member.name} className="flex items-center gap-4">
            <Avatar src={member.avatarUrl} name={member.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-body text-text-primary font-semibold">
                {member.name}
              </p>
              {member.links && member.links.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-3">
                  {member.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-small text-text-secondary hover:text-accent inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {link.label}
                      <span className="sr-only"> {opensInNewTabLabel}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Overlay>
  );
}
