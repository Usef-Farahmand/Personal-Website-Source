"use client";

import type { ReactNode } from "react";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { useMediaViewer } from "@/hooks/useMediaViewer";
import type { MediaItem } from "@/types/media";

interface MediaTriggerProps {
  item: MediaItem;
  className?: string;
  children: ReactNode;
  /** Forwarded to the trigger button — typed explicitly rather than as a
   *  generic rest-spread to keep the prop surface small and intentional. */
  "data-animate"?: boolean;
}

/**
 * Wraps any clickable content (a thumbnail, an icon, a card) and makes it
 * open the Universal Media Viewer — always, regardless of where the
 * underlying file is hosted. An earlier version of this component opened
 * external URLs in a new browser tab instead; that distinction is gone
 * per the explicit "do not open media in a new browser tab or page"
 * requirement, which is unconditional rather than local-files-only.
 */
export function MediaTrigger({
  item,
  className,
  children,
  "data-animate": dataAnimate,
}: MediaTriggerProps) {
  const viewer = useMediaViewer([item]);

  return (
    <>
      <button
        type="button"
        onClick={() => viewer.open(0)}
        className={className}
        data-animate={dataAnimate}
      >
        {children}
      </button>
      <MediaViewer
        items={viewer.items}
        index={viewer.index}
        onIndexChange={viewer.setIndex}
        isOpen={viewer.isOpen}
        onClose={viewer.close}
      />
    </>
  );
}
