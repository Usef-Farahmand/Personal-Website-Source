"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import type { MediaItem } from "@/types/media";

/**
 * One image, whole and undistorted: at zoom 1 it fits the viewer's media
 * area (object-contain). Zooming grows the image itself (not a CSS scale)
 * inside a frame that keeps the fitted size, so the enlarged picture can
 * be panned by scrolling or by dragging, and never escapes the viewer.
 * MediaViewer owns the zoom level and remounts this per item.
 */
export function ImageViewer({
  item,
  zoom,
  alt,
}: {
  item: MediaItem;
  zoom: number;
  alt: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ w: number; h: number } | null>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number }>(
    null
  );
  const zoomed = zoom > 1 && fit !== null;

  // Each zoom step keeps the view centred on the middle of the picture.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !zoomed) return;
    frame.scrollLeft = (frame.scrollWidth - frame.clientWidth) / 2;
    frame.scrollTop = (frame.scrollHeight - frame.clientHeight) / 2;
  }, [zoom, zoomed]);

  function measure(img: HTMLImageElement) {
    if (zoom === 1) setFit({ w: img.clientWidth, h: img.clientHeight });
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!zoomed || !frame) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: frame.scrollLeft,
      top: frame.scrollTop,
    };
    frame.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    const start = drag.current;
    if (!frame || !start) return;
    frame.scrollLeft = start.left - (event.clientX - start.x);
    frame.scrollTop = start.top - (event.clientY - start.y);
  }

  function endDrag() {
    drag.current = null;
  }

  return (
    <div
      ref={frameRef}
      // LTR scroll coordinates for panning, also on Persian pages.
      dir="ltr"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={zoomed ? { width: fit.w, height: fit.h } : undefined}
      className={cn(
        "flex max-h-[calc(100dvh-15rem)] max-w-full items-center justify-center",
        zoomed &&
          "no-scrollbar cursor-grab touch-none justify-start overflow-auto active:cursor-grabbing"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element --
          next/image needs fixed dimensions or `fill`; the viewer shows
          images of any shape at "as large as fits". */}
      <img
        src={item.src}
        alt={alt}
        draggable={false}
        onLoad={(e) => measure(e.currentTarget)}
        style={
          zoomed
            ? {
                width: fit.w * zoom,
                height: fit.h * zoom,
                maxWidth: "none",
                maxHeight: "none",
              }
            : undefined
        }
        className="max-h-[calc(100dvh-15rem)] max-w-full rounded-md object-contain select-none"
      />
    </div>
  );
}
