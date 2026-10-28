"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import {
  ProjectShareModal,
  type ProjectShareData,
  type ProjectShareLabels,
} from "@/components/ui/ProjectShareModal";

/**
 * Opens the "Share this project" dialog. First of the project hero's
 * icon buttons, accent-filled; `label` ("Share" / «اشتراک‌گذاری») is its
 * accessible name, and ProjectHero shows it as the tooltip (this button
 * is the `peer` the tooltip follows).
 */
export function ProjectShareButton({
  project,
  label,
  labels,
}: {
  project: ProjectShareData;
  label: string;
  labels: ProjectShareLabels;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={label}
        onClick={() => setIsOpen(true)}
        className="peer bg-accent text-background hover:bg-accent-hover flex h-11 w-11 items-center justify-center rounded-md transition-colors"
      >
        <Share2 className="h-5 w-5" aria-hidden="true" />
      </button>
      <ProjectShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        project={project}
        labels={labels}
      />
    </>
  );
}
