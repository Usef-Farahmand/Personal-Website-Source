"use client";

import type { ReactNode } from "react";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { useMediaViewer } from "@/hooks/useMediaViewer";
import { isExternalMediaUrl, type MediaItem } from "@/types/media";

interface MediaTriggerProps {
  item: MediaItem;
  className?: string;
  children: ReactNode;
  /** Forwarded to whichever element renders (button or anchor) — typed
   *  explicitly rather than as a generic rest-spread, since button and
   *  anchor have incompatible event-handler generics that make a single
   *  spread-onto-both type-check cleanly. Add more named props here if a
   *  future consumer needs to forward something else. */
  "data-animate"?: boolean;
}

/**
 * Wraps any clickable content (a thumbnail, an icon, a card) and makes it
 * open the correct thing: the Universal Media Viewer for a local
 * image/PDF, or a new browser tab (with rel="noopener noreferrer") for an
 * external URL. This is the piece a future Projects gallery, Article
 * embed, or Certificates list reuses directly — MediaViewer itself stays
 * unopinionated about "how was this triggered."
 */
export function MediaTrigger({
  item,
  className,
  children,
  "data-animate": dataAnimate,
}: MediaTriggerProps) {
  const viewer = useMediaViewer([item]);

  if (isExternalMediaUrl(item.url)) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-animate={dataAnimate}
      >
        {children}
      </a>
    );
  }

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
