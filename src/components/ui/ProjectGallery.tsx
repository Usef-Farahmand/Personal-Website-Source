"use client";

import {
  useCallback,
  useEffect,
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

/** Pointer movement (px) beyond which a press-and-hold is treated as
 *  the start of a drag — below this, pointer capture is never engaged
 *  at all, so a plain tap/click on an item passes through as a normal
 *  click. Engaging capture unconditionally on every pointerdown (rather
 *  than only once real movement is detected) retargets the subsequent
 *  pointerup/click sequence to the capturing element and silently
 *  suppresses clicks on the item buttons inside it — this constant, and
 *  the deferred-capture logic below, exist specifically to avoid that. */
const DRAG_START_THRESHOLD_PX = 6;
/** Scroll-edge epsilon (px) — real browsers can leave scrollLeft a
 *  fraction of a pixel short of the true min/max due to subpixel
 *  layout, so an exact `=== 0` / `=== max` check would occasionally
 *  leave a boundary button incorrectly enabled. */
const EDGE_EPSILON_PX = 2;

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remaining}`;
}

interface ProjectGalleryProps {
  items: MediaItem[];
  previousLabel: string;
  nextLabel: string;
}

/**
 * Horizontal-scrolling media gallery (Section 5, PRODUCT spec — Play
 * Store-style browsing). Reuses the Universal Media Viewer for the
 * lightbox rather than a second, parallel viewer — the same component
 * Achievements uses for certificates.
 *
 * Navigation input support:
 * - Touch swipe: free — native `overflow-x-auto` + `scroll-snap` handles
 *   the gallery strip itself, and no touchmove handler here ever calls
 *   preventDefault, so vertical page scroll is never hijacked by a
 *   swipe that turns out to be more vertical than horizontal.
 * - Mouse wheel: vertical wheel motion is redirected into horizontal
 *   scroll only when the gesture is actually vertical, so a trackpad's
 *   native horizontal swipe (deltaX) passes through untouched.
 * - Mouse drag: raw pointer-to-scrollLeft mapping. Direct pixel math, not
 *   RTL-aware — an acceptable trade-off for a drag gesture, which has no
 *   inherent "logical direction" the way a keyboard command does. Every
 *   <Image>/<video> in an item is rendered with `draggable={false}` —
 *   without it, pressing down directly on a thumbnail (rather than the
 *   surrounding chrome) lets the browser's native HTML5 image-drag
 *   affordance intercept the gesture, which silently breaks BOTH
 *   click-to-open and drag-to-scroll for that thumbnail specifically
 *   (native <img> elements are draggable by default). CSS
 *   `scroll-snap-type` is also switched off for the duration of an
 *   active drag (see the track's className) — left on, its "mandatory"
 *   snapping fights a manually-driven `scrollLeft`, snapping back to the
 *   nearest point on nearly every incremental move instead of following
 *   the drag; it re-engages once the drag ends, and endDrag settles the
 *   release to the nearest item explicitly via scrollIntoView.
 * - Keyboard: Prev/Next buttons and Arrow keys both use scrollIntoView on
 *   the target item rather than raw scrollLeft math, which *is* RTL-safe
 *   (the browser resolves "inline: start" against the container's actual
 *   writing direction). ArrowRight always means "next", ArrowLeft always
 *   means "previous" — ChevronRight/ChevronLeft icons are visually
 *   mirrored in RTL via `rtl:-scale-x-100` like everywhere else in this
 *   codebase, but the underlying action they trigger doesn't swap.
 *
 * Pointer capture for the drag gesture is deliberately deferred until
 * movement crosses DRAG_START_THRESHOLD_PX, rather than being engaged
 * unconditionally on every pointerdown: capturing eagerly (even for a
 * plain tap with zero movement) retargets the subsequent pointerup/click
 * sequence to the capturing element and silently suppresses clicks on
 * the item buttons — a plain click never engages capture at all.
 *
 * Boundary state (for disabling Prev/Next) and the "active" index are
 * both derived from the track's real scrollLeft via onScroll, not just
 * from button/keyboard navigation — a manual drag or swipe to the last
 * item correctly disables Next even though goToIndex was never called,
 * and a subsequent Next/Prev click steps from wherever the user actually
 * scrolled to, not from a stale click-only index.
 *
 * Every item opens in the same MediaViewer regardless of where it's
 * hosted — there is no longer an external-URL special case that opens a
 * new tab instead (see types/media.ts for why that distinction was
 * removed).
 */
export function ProjectGallery({
  items,
  previousLabel,
  nextLabel,
}: ProjectGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isDragging = useRef(false);
  const pendingPointerId = useRef<number | null>(null);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const dragDistance = useRef(0);
  const suppressNextClick = useRef(false);
  const suppressClickTimeout = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(items.length <= 1);

  const viewer = useMediaViewer(items);

  const findNearestIndex = useCallback((scrollLeft: number) => {
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const distance = Math.abs(el.offsetLeft - scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    });
    return nearestIndex;
  }, []);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setIsAtStart(track.scrollLeft <= EDGE_EPSILON_PX);
    setIsAtEnd(track.scrollLeft >= maxScrollLeft - EDGE_EPSILON_PX);

    // Which item is currently leading the visible area — used so a
    // Next/Prev click steps from wherever the user actually scrolled
    // to (via drag/wheel/touch), not from a stale index that only
    // button/keyboard navigation would have updated.
    setActiveIndex(findNearestIndex(track.scrollLeft));
  }, [findNearestIndex]);

  // Compute real boundary state on mount and on resize — the onScroll
  // handler alone can't cover the case where every item already fits
  // within the viewport (nothing to scroll, so no scroll event ever
  // fires to correct the initial guess) or where a viewport resize
  // changes whether the track overflows at all.
  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  if (items.length === 0) return null;

  function goToIndex(nextIndex: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, nextIndex));
    itemRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }

  function handleScroll() {
    updateScrollState();
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
    // Deliberately does NOT set isDragging or capture the pointer yet —
    // see DRAG_START_THRESHOLD_PX. A plain click starts and ends here
    // with nothing engaged, and falls through to the button's own
    // onClick exactly as if this handler didn't exist.
    dragStartX.current = event.clientX;
    dragStartScrollLeft.current = track.scrollLeft;
    dragDistance.current = 0;
    pendingPointerId.current = event.pointerId;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || pendingPointerId.current === null) return;
    const delta = event.clientX - dragStartX.current;
    dragDistance.current = Math.max(dragDistance.current, Math.abs(delta));

    if (!isDragging.current) {
      if (dragDistance.current < DRAG_START_THRESHOLD_PX) return;
      // Movement just crossed the threshold — this is now genuinely a
      // drag, not a click. Engage capture starting from this point on,
      // not from the original pointerdown.
      isDragging.current = true;
      setIsPointerDown(true);
      track.setPointerCapture(event.pointerId);
      // Removed imperatively, synchronously, on the DOM node itself —
      // NOT solely via the isPointerDown React state driving the
      // className. React's render (and therefore any className update)
      // lands on a later tick; the scrollLeft write a few lines below
      // happens in this same synchronous call. If the snap classes were
      // still physically present in the DOM at that point, the
      // browser's mandatory snap correction fights the write and resets
      // scrollLeft back to the nearest snap point on essentially every
      // move — which is exactly what was happening before this fix.
      track.classList.remove("snap-x", "snap-mandatory");
    }

    track.scrollLeft = dragStartScrollLeft.current - delta;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    // A real drag (moved past the threshold) means the pointerup that
    // follows is not an intentional click on whatever item is under the
    // cursor — the very next click event is suppressed once, then the
    // flag clears itself so normal taps keep working immediately after.
    // When the pointer never crossed the threshold at all, capture was
    // never engaged and this is simply a plain click passing through.
    if (isDragging.current) {
      suppressNextClick.current = true;
      clearTimeout(suppressClickTimeout.current);
      suppressClickTimeout.current = setTimeout(() => {
        suppressNextClick.current = false;
      }, 400);
      track?.releasePointerCapture(event.pointerId);
      // Restored imperatively for the same reason it was removed
      // imperatively above — this runs synchronously before the
      // settle-scroll below, rather than waiting on React's render.
      track?.classList.add("snap-x", "snap-mandatory");
      // A CSS state change alone doesn't animate anything, so the
      // release is settled explicitly here via scrollIntoView, the same
      // way native touch scrolling would settle to the nearest snap
      // point once the gesture ends.
      if (track) {
        goToIndex(findNearestIndex(track.scrollLeft));
      }
    }
    isDragging.current = false;
    setIsPointerDown(false);
    pendingPointerId.current = null;
  }

  function handleItemClick(index: number) {
    if (suppressNextClick.current) {
      suppressNextClick.current = false;
      clearTimeout(suppressClickTimeout.current);
      return;
    }
    viewer.open(index);
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
        onScroll={handleScroll}
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
              onClick={() => handleItemClick(i)}
              className="border-border bg-surface relative aspect-video w-[min(80vw,420px)] shrink-0 snap-start overflow-hidden rounded-lg border"
            >
              {item.type === "image" && (
                <Image
                  src={item.thumbnail ?? item.src}
                  alt={item.title ?? ""}
                  fill
                  loading="lazy"
                  sizes="420px"
                  draggable={false}
                  className="object-cover"
                />
              )}

              {(item.type === "video" || item.type === "youtube") && (
                <>
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title ?? ""}
                      fill
                      loading="lazy"
                      sizes="420px"
                      draggable={false}
                      className="object-cover"
                    />
                  ) : item.type === "video" ? (
                    <video
                      src={item.src}
                      preload="metadata"
                      muted
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
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
            disabled={isAtStart}
            aria-label={previousLabel}
            className="border-border bg-surface/90 text-text-primary hover:border-accent/50 absolute start-2 top-1/2 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => goToIndex(activeIndex + 1)}
            disabled={isAtEnd}
            aria-label={nextLabel}
            className="border-border bg-surface/90 text-text-primary hover:border-accent/50 absolute end-2 top-1/2 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm disabled:pointer-events-none disabled:opacity-40 sm:flex"
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
