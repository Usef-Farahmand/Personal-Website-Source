"use client";

import { useState, type ReactNode } from "react";
import { Overlay } from "@/components/ui/Overlay";

/**
 * Makes a whole SkillCard open its detail popup. The button wraps the
 * skill's name and stretches over the card with an `after:` layer
 * (the card is `relative`), so a click anywhere on the card opens it —
 * links inside the card sit above that layer and still navigate on their
 * own. The popup's content is server-rendered and passed in.
 */
export function SkillDetailDialog({
  title,
  triggerLabel,
  children,
  detail,
}: {
  title: string;
  triggerLabel: string;
  children: ReactNode;
  detail: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={triggerLabel}
        onClick={() => setIsOpen(true)}
        className="focus-visible:after:ring-accent cursor-pointer text-start outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:ring-2"
      >
        {children}
      </button>
      <Overlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        contentClassName="max-h-[85vh] w-[calc(100vw-2rem)] p-6 sm:w-[36rem] sm:p-8 lg:w-[40rem]"
      >
        {detail}
      </Overlay>
    </>
  );
}
