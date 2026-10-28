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
 * "Find me around the web" — opens the Social Universe dialog in place
 * (no navigation). `card` sits with the About page's Connect links;
 * `link` is the quieter text style used under the Contact form.
 */
export function SocialUniverseTrigger({
  profiles,
  labels,
  variant = "card",
  className,
}: {
  profiles: SocialUniverseProfile[];
  labels: SocialUniverseLabels;
  variant?: "card" | "link";
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
          variant === "card"
            ? "group border-border bg-surface hover:border-accent/50 card-lift text-small text-text-primary inline-flex items-center gap-3 rounded-lg border px-4 py-3 font-medium"
            : "text-small text-accent hover:text-accent-hover inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline",
          className
        )}
      >
        <Orbit
          className={cn(
            "shrink-0",
            variant === "card"
              ? "text-text-secondary group-hover:text-accent h-5 w-5 transition-colors"
              : "h-4 w-4"
          )}
          aria-hidden="true"
        />
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
