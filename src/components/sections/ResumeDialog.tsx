"use client";

import { useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Overlay } from "@/components/ui/Overlay";

/**
 * Opens the resume in a popup over the About page instead of navigating
 * away. The trigger (ResumeBanner's artwork) and the sheet are both
 * server-rendered and passed in; this only owns the open state. /resume
 * stays the shareable page, linked from inside the popup.
 */
export function ResumeDialog({
  trigger,
  triggerLabel,
  triggerClassName,
  title,
  openPageLabel,
  children,
}: {
  trigger: ReactNode;
  triggerLabel: string;
  triggerClassName?: string;
  title: string;
  openPageLabel: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={triggerLabel}
        onClick={() => setIsOpen(true)}
        className={triggerClassName}
      >
        {trigger}
      </button>

      <Overlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        contentClassName="flex max-h-[90vh] w-[calc(100vw-2rem)] flex-col overflow-hidden p-5 pt-12 sm:w-[calc(100vw-4rem)] sm:p-8 sm:pt-12 lg:w-[56rem]"
      >
        <Link
          href="/resume"
          className="text-text-secondary hover:text-accent absolute start-5 top-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors sm:start-8"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {openPageLabel}
        </Link>
        {children}
      </Overlay>
    </>
  );
}
