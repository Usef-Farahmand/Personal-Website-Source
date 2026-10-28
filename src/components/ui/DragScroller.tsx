"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { animateScrollBy } from "@/lib/scrollAnimate";

interface DragScrollerProps {
  children: ReactNode;
  /** Accessible name for the scrolling region. */
  label: string;
  previousLabel: string;
  nextLabel: string;
  className?: string;
  /** One slide per view (e.g. the Projects page's featured strip)
   *  instead of the default card-width slides. */
  fullWidthSlides?: boolean;
}

const DRAG_THRESHOLD_PX = 6;

/**
 * A single horizontal row of cards. Touch and trackpads scroll it
 * natively; with a mouse it can be dragged sideways, and the arrow
 * buttons page through it. A drag never counts as a click, so cards that
 * open something (a certificate viewer, a "read more" dialog) only react
 * to a real click. The row moves freely (no snapping); every slide
 * stretches to the tallest one (cards' own h-full would otherwise stop
 * that), so a row of cards is always one size.
 */
export function DragScroller({
  children,
  label,
  previousLabel,
  nextLabel,
  className,
  fullWidthSlides = false,
}: DragScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const cancelScroll = useRef<() => void>(() => {});

  // scrollLeft is negative in RTL, so measure distance from each edge by
  // magnitude rather than sign.
  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const offset = Math.abs(track.scrollLeft);
    setEdges({ start: offset <= 1, end: offset >= max - 1 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateEdges]);

  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const rtl = getComputedStyle(track).direction === "rtl";
    cancelScroll.current();
    cancelScroll.current = animateScrollBy(
      track,
      direction * (rtl ? -1 : 1) * track.clientWidth * 0.85
    );
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    const delta = event.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(delta) < DRAG_THRESHOLD_PX) return;
    if (!drag.current.moved) {
      drag.current.moved = true;
      setDragging(true);
      track.setPointerCapture(event.pointerId);
    }
    track.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = () => {
    drag.current.active = false;
    setDragging(false);
  };

  // Swallow the click that ends a drag so it doesn't open the card under
  // the cursor.
  const onClickCapture = (event: React.MouseEvent) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  };

  // Same arrows as the project gallery: round buttons over the row's
  // two ends, shown only when the row overflows.
  const arrowClass =
    "border-border bg-surface/90 text-text-primary hover:border-accent/50 absolute top-1/2 z-10 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm transition-[border-color,opacity] disabled:pointer-events-none disabled:opacity-40 sm:flex";
  const overflowing = !(edges.start && edges.end);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        data-fade-start={edges.start ? undefined : ""}
        data-fade-end={edges.end ? undefined : ""}
        className={cn(
          "edge-fade no-scrollbar focus-visible:ring-accent -mx-1 flex gap-4 overflow-x-auto px-1 pt-2 pb-4 outline-none select-none focus-visible:ring-2 [&>*]:h-auto! [&>*]:shrink-0",
          fullWidthSlides ? "[&>*]:w-full" : "[&>*]:w-[min(85vw,22rem)]",
          dragging ? "cursor-grabbing [&_*]:pointer-events-none" : "cursor-grab"
        )}
      >
        {children}
      </div>

      {overflowing && (
        <>
          <button
            type="button"
            aria-label={previousLabel}
            disabled={edges.start}
            onClick={() => page(-1)}
            className={cn(arrowClass, "start-2")}
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={edges.end}
            onClick={() => page(1)}
            className={cn(arrowClass, "end-2")}
          >
            <ChevronRight className="h-5 w-5 rtl:-scale-x-100" />
          </button>
        </>
      )}
    </div>
  );
}
