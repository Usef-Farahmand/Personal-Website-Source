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
import { ChevronLeft, ChevronRight, FileText, Play } from "lucide-react";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { useMediaViewer } from "@/hooks/useMediaViewer";
import { useTranslations } from "next-intl";
import { getYoutubeThumbnailUrl, resolveYoutubeVideoId } from "@/lib/youtube";
import { resolveVideoEmbed } from "@/lib/videoEmbed";
import { alignDelta, animateScrollBy } from "@/lib/scrollAnimate";
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

/** Thumbnail-strip fallback for a "youtube" item with no authored
 *  `thumbnail` — resolves a video id from `youtubeVideoId`/`src` (same
 *  resolution the viewer's embed uses, so the strip and the viewer
 *  never disagree on which video an item is) and returns YouTube's CDN
 *  thumbnail URL, or null when no id can be determined at all (an
 *  invalid or missing URL), in which case the item still renders with
 *  just the Play icon rather than a broken image. */
function youtubeThumbnailFor(item: MediaItem): string | null {
  const embed = resolveVideoEmbed(item);
  if (embed?.provider !== "youtube") return null;
  const videoId = resolveYoutubeVideoId(item);
  return videoId ? getYoutubeThumbnailUrl(videoId) : null;
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
  const cancelScroll = useRef<() => void>(() => {});
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(items.length <= 1);

  const viewer = useMediaViewer(items);
  const t = useTranslations("mediaViewer");
  // Each item's real width/height ratio, read from its thumbnail once it
  // loads (gallery data rarely carries dimensions), so a portrait
  // screenshot gets a narrow tile instead of a 16:9 one full of bars.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const rememberRatio = (id: string, width: number, height: number) => {
    if (!width || !height) return;
    setRatios((current) =>
      current[id] ? current : { ...current, [id]: width / height }
    );
  };

  // The item closest to the track's starting edge (works in RTL too).
  const findNearestIndex = useCallback(() => {
    const track = trackRef.current;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    if (!track) return nearestIndex;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const distance = Math.abs(alignDelta(track, el));
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

    // |scrollLeft|: RTL tracks scroll into negative values.
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const offset = Math.abs(track.scrollLeft);
    setIsAtStart(offset <= EDGE_EPSILON_PX);
    setIsAtEnd(offset >= maxScrollLeft - EDGE_EPSILON_PX);

    // Which item is currently leading the visible area — used so a
    // Next/Prev click steps from wherever the user actually scrolled
    // to (via drag/wheel/touch), not from a stale index that only
    // button/keyboard navigation would have updated.
    setActiveIndex(findNearestIndex());
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

  function scrollByAnimated(delta: number) {
    const track = trackRef.current;
    if (!track) return;
    cancelScroll.current();
    cancelScroll.current = animateScrollBy(track, delta);
  }

  function goToIndex(nextIndex: number) {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(items.length - 1, nextIndex));
    const item = itemRefs.current[clamped];
    if (track && item) scrollByAnimated(alignDelta(track, item));
  }

  /**
   * The arrows move a page at a time: Next brings the first item that
   * isn't fully visible to the start; Previous goes back as far as one
   * view allows. Distances are measured toward the reading direction,
   * so the same logic serves LTR and RTL.
   */
  function page(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const sign = getComputedStyle(track).direction === "rtl" ? -1 : 1;
    const view = track.clientWidth;
    const offsets = itemRefs.current.flatMap((el) =>
      el ? [{ d: sign * alignDelta(track, el), w: el.offsetWidth }] : []
    );
    const target =
      direction === 1
        ? offsets.find((o) => o.d > 1 && o.d + o.w > view + 1)
        : (offsets.find((o) => o.d < -1 && o.d >= -view) ??
          offsets.filter((o) => o.d < -1).at(-1));
    if (target) scrollByAnimated(sign * target.d);
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
      // release is settled explicitly here (an eased scroll), the same
      // way native touch scrolling would settle to the nearest snap
      // point once the gesture ends.
      if (track) {
        goToIndex(findNearestIndex());
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
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    // Arrow keys follow the screen: in RTL the next item is on the left.
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = (event.key === "ArrowRight") !== rtl;
    goToIndex(activeIndex + (forward ? 1 : -1));
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
        data-fade-start={isAtStart ? undefined : ""}
        data-fade-end={isAtEnd ? undefined : ""}
        className={`edge-fade focus-visible:ring-accent flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-2 outline-none focus-visible:ring-2 [&::-webkit-scrollbar]:hidden ${
          isPointerDown ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {items.map((item, i) => {
          const duration = formatDuration(item.duration);
          const isVideo = item.type === "video" || item.type === "youtube";
          const embedded = isVideo && resolveVideoEmbed(item) !== null;
          const thumbnail =
            item.type === "image"
              ? (item.thumbnail ?? item.src)
              : (item.thumbnail ??
                (isVideo ? youtubeThumbnailFor(item) : null));
          const name = item.title ?? item.alt ?? "";
          // Every tile is the same height; its width follows the item's
          // own shape (authored size, else measured, else 16:9 until it
          // loads), and the picture is shown whole, never cropped.
          const aspectRatio =
            item.width && item.height
              ? `${item.width} / ${item.height}`
              : String(ratios[item.id] ?? 16 / 9);
          return (
            <button
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="listitem"
              onClick={() => handleItemClick(i)}
              aria-label={t(
                isVideo
                  ? "playVideo"
                  : item.type === "pdf"
                    ? "openPdfItem"
                    : "openImage",
                { title: name }
              )}
              style={{ aspectRatio }}
              className="group border-border relative h-48 max-w-[85vw] shrink-0 snap-start overflow-hidden rounded-lg border bg-black/40 sm:h-60"
            >
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 430px, 85vw"
                  draggable={false}
                  onLoad={(e) =>
                    // YouTube thumbnails are 4:3 with the bars baked in;
                    // the video itself stays a 16:9 tile.
                    item.type !== "youtube" &&
                    rememberRatio(
                      item.id,
                      e.currentTarget.naturalWidth,
                      e.currentTarget.naturalHeight
                    )
                  }
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                />
              ) : item.type === "video" && !embedded ? (
                // A file without a thumbnail: its first frame, not played.
                <video
                  src={item.src}
                  preload="metadata"
                  muted
                  playsInline
                  tabIndex={-1}
                  aria-hidden="true"
                  draggable={false}
                  onLoadedMetadata={(e) =>
                    rememberRatio(
                      item.id,
                      e.currentTarget.videoWidth,
                      e.currentTarget.videoHeight
                    )
                  }
                  className="pointer-events-none h-full w-full object-contain"
                />
              ) : item.type === "pdf" ? (
                <span className="text-text-secondary flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-sm">
                  <FileText className="h-8 w-8" aria-hidden="true" />
                  {item.title ?? "PDF"}
                </span>
              ) : null}

              {isVideo && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="bg-accent text-background absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/40 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                  >
                    <Play className="ms-0.5 h-6 w-6 fill-current" />
                  </span>
                  {duration && (
                    <span className="bg-background/90 text-caption text-text-primary absolute end-2 bottom-2 rounded px-1.5 py-0.5 tabular-nums">
                      {duration}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={isAtStart}
            aria-label={previousLabel}
            className="border-border bg-surface/90 text-text-primary hover:border-accent/50 absolute start-2 top-1/2 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
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
