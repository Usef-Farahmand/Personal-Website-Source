"use client";

import { useState } from "react";
import { Orbit } from "lucide-react";
import {
  SocialUniverseModal,
  type SocialUniverseLabels,
} from "@/components/ui/SocialUniverseModal";
import type { SocialUniverseProfile } from "@/config/socialUniverse";
import { cn } from "@/lib/cn";

/**
 * "Find me around the web" — a text button (under the Contact form) that
 * opens the Social Universe dialog in place, with no navigation.
 */
export function SocialUniverseTrigger({
  profiles,
  labels,
  className,
}: {
  profiles: SocialUniverseProfile[];
  labels: SocialUniverseLabels;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className={cn(
          "text-small text-accent hover:text-accent-hover inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline",
          className
        )}
      >
        <Orbit className="h-4 w-4 shrink-0" aria-hidden="true" />
        {labels.title}
      </button>
      <SocialUniverseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profiles={profiles}
        labels={labels}
      />
    </>
  );
}
