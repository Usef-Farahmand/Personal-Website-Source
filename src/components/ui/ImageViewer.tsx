"use client";

import type { MediaItem } from "@/types/media";

interface ImageViewerProps {
  item: MediaItem;
  isZoomed: boolean;
  fitMode: "fit" | "original";
}

/**
 * Purely presentational — `isZoomed`/`fitMode` are owned by MediaViewer
 * (the single source of truth the toolbar's labels are also built from),
 * not by this component. An earlier version of this file managed that
 * state internally via useImperativeHandle, which meant MediaViewer's
 * toolbar could show a stale "Zoom In"/"Zoom Out" label: toggling zoom
 * re-rendered this component but gave MediaViewer no reason to re-render
 * itself and recompute the toolbar. Lifting the state up fixes that at
 * the source instead of working around it.
 */
export function ImageViewer({ item, isZoomed, fitMode }: ImageViewerProps) {
  const caption = item.description ?? item.title ?? "";

  return (
    <div
      className={
        fitMode === "fit"
          ? "flex max-h-[75vh] w-full items-center justify-center"
          : "max-h-[75vh] w-full overflow-auto"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element --
          next/image needs known dimensions or `fill`, neither of which
          fits a viewer showing variable-aspect-ratio images at "as large
          as the current fit mode allows". */}
      <img
        src={item.src}
        alt={caption}
        className={
          fitMode === "fit"
            ? "max-h-[75vh] max-w-full object-contain transition-transform duration-300 ease-out"
            : "max-w-none transition-transform duration-300 ease-out"
        }
        style={{ transform: isZoomed ? "scale(2)" : "scale(1)" }}
      />
    </div>
  );
}
