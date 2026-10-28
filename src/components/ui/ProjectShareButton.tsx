"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import {
  ProjectShareModal,
  type ProjectShareData,
  type ProjectShareLabels,
} from "@/components/ui/ProjectShareModal";

/**
 * Opens the "Share this project" dialog. Placed at the end of the project
 * page's details card; the label is "Share" / «اشتراک‌گذاری».
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
        onClick={() => setIsOpen(true)}
        className="border-accent/60 text-text-primary hover:border-accent hover:text-accent inline-flex w-full items-center justify-center gap-2 rounded-md border bg-black/30 px-4 py-2.5 text-sm font-semibold transition-colors"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        {label}
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
