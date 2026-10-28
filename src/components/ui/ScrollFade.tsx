"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * A horizontally scrolling box (wide tables, code) whose edges soften
 * while more content lies beyond them (.edge-fade in utilities.css), so
 * clipped content reads as "there's more" instead of being cut off. No
 * scrollbar: it scrolls by trackpad/wheel, touch, or dragging with the
 * mouse (once the pointer has moved a few pixels, so clicks still work).
 */
export function ScrollFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const scrollable = !(edges.start && edges.end);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !scrollable) return;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, left: el.scrollLeft, moved: false };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    const start = drag.current;
    if (!el || !start) return;
    const delta = event.clientX - start.x;
    if (!start.moved) {
      if (Math.abs(delta) < 6) return;
      start.moved = true;
      setDragging(true);
      el.setPointerCapture(event.pointerId);
    }
    el.scrollLeft = start.left - delta;
  }

  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // |scrollLeft|: RTL boxes scroll into negative values.
    const offset = Math.abs(el.scrollLeft);
    setEdges({ start: offset <= 1, end: offset >= max - 1 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  return (
    <div
      ref={ref}
      onScroll={update}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      data-fade-start={edges.start ? undefined : ""}
      data-fade-end={edges.end ? undefined : ""}
      className={cn(
        "edge-fade no-scrollbar overflow-x-auto",
        scrollable && "cursor-grab",
        dragging && "cursor-grabbing select-none",
        className
      )}
    >
      {children}
    </div>
  );
}
