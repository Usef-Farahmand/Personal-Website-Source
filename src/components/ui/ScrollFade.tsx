"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * A horizontally scrolling box (wide tables, code) whose edges soften
 * while more content lies beyond them (.edge-fade in utilities.css), so
 * clipped content reads as "there's more" instead of being cut off.
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
      data-fade-start={edges.start ? undefined : ""}
      data-fade-end={edges.end ? undefined : ""}
      className={cn("edge-fade overflow-x-auto", className)}
    >
      {children}
    </div>
  );
}
