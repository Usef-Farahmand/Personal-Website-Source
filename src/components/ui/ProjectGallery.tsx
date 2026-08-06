"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { useMediaViewer } from "@/hooks/useMediaViewer";
import type { MediaItem } from "@/types/media";

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remaining}`;
}

/**
 * Horizontal-scrolling media gallery (Section 5, PRODUCT spec — Play
 * Store-style browsing). Reuses the Universal Media Viewer for the
 * lightbox rather than a second, parallel viewer — the same component
 * Achievements uses for certificates.
 *
 * Navigation input support:
 * - Touch swipe: free — native `overflow-x-auto` + `scroll-snap` handles
 *   the gallery strip itself; swiping within the opened MediaViewer to
 *   move between items is a separate, viewer-owned gesture (see
 *   MediaViewer's own touch handling).
 * - Mouse wheel: vertical wheel motion is redirected into horizontal
 *   scroll only when the gesture is actually vertical, so a trackpad's
 *   native horizontal swipe (deltaX) passes through untouched.
 * - Mouse drag: raw pointer-to-scrollLeft mapping. Direct pixel math, not
 *   RTL-aware — an acceptable trade-off for a drag gesture, which has no
 *   inherent "logical direction" the way a keyboard command does.
 * - Keyboard: Prev/Next buttons and Arrow keys both use scrollIntoView on
 *   the target item rather than raw scrollLeft math, which *is* RTL-safe
 *   (the browser resolves "inline: start" against the container's actual
 *   writing direction). ArrowRight always means "next", ArrowLeft always
 *   means "previous" — ChevronRight/ChevronLeft icons are visually
 *   mirrored in RTL via `rtl:-scale-x-100` like everywhere else in this
 *   codebase, but the underlying action they trigger doesn't swap.
 *
 * Every item opens in the same MediaViewer regardless of where it's
 * hosted — there is no longer an external-URL special case that opens a
 * new tab instead (see types/media.ts for why that distinction was
 * removed).
 */
export function ProjectGallery({ items }: { items: MediaItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const viewer = useMediaViewer(items);

  if (items.length === 0) return null;

  function goToIndex(nextIndex: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, nextIndex));
    setActiveIndex(clamped);
    itemRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    setIsPointerDown(true);
    dragStartX.current = event.clientX;
    dragStartScrollLeft.current = track.scrollLeft;
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !isDragging.current) return;
    track.scrollLeft =
      dragStartScrollLeft.current - (event.clientX - dragStartX.current);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    isDragging.current = false;
    setIsPointerDown(false);
    trackRef.current?.releasePointerCapture(event.pointerId);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToIndex(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToIndex(activeIndex - 1);
    }
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="list"
        tabIndex={0}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={handleKeyDown}
        className={`focus-visible:ring-accent flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth pb-2 outline-none focus-visible:ring-2 [&::-webkit-scrollbar]:hidden ${
          isPointerDown ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {items.map((item, i) => {
          const duration = formatDuration(item.duration);
          return (
            <button
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="listitem"
              onClick={() => viewer.open(i)}
              className="border-border bg-surface relative aspect-video w-[min(80vw,420px)] shrink-0 snap-start overflow-hidden rounded-lg border"
            >
              {item.type === "image" && (
                <Image
                  src={item.thumbnail ?? item.src}
                  alt={item.title ?? ""}
                  fill
                  loading="lazy"
                  sizes="420px"
                  className="object-cover"
                />
              )}

              {item.type === "video" && (
                <>
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title ?? ""}
                      fill
                      loading="lazy"
                      sizes="420px"
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={item.src}
                      preload="metadata"
                      muted
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="bg-background/70 text-text-primary absolute inset-0 flex items-center justify-center">
                    <Play className="h-10 w-10" aria-hidden="true" />
                  </span>
                  {duration && (
                    <span className="bg-background/90 text-caption text-text-primary absolute end-2 bottom-2 rounded px-1.5 py-0.5 tabular-nums">
                      {duration}
                    </span>
                  )}
                </>
              )}

              {item.type === "pdf" && (
                <span className="text-text-secondary text-small flex h-full w-full items-center justify-center px-4 text-center">
                  {item.title ?? "PDF"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goToIndex(activeIndex - 1)}
            aria-label="Previous"
            className="border-border bg-surface/90 text-text-primary hover:border-accent/50 absolute start-2 top-1/2 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm sm:flex"
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => goToIndex(activeIndex + 1)}
            aria-label="Next"
            className="border-border bg-surface/90 text-text-primary hover:border-accent/50 absolute end-2 top-1/2 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm sm:flex"
          >
            <ChevronRight className="h-5 w-5 rtl:-scale-x-100" />
          </button>
        </>
      )}

      <MediaViewer
        items={viewer.items}
        index={viewer.index}
        onIndexChange={viewer.setIndex}
        isOpen={viewer.isOpen}
        onClose={viewer.close}
      />
    </div>
  );
}
