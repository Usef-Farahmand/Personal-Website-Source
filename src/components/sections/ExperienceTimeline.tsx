"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate } from "animejs";
import { useInView } from "@/hooks/useInView";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

interface ExperienceTimelineProps {
  /** Rendered server-side (TimelineItem needs no client interactivity
   *  itself, but the parent resolves translations server-side per the
   *  established pattern) and passed down as pre-built list items. */
  children: ReactNode;
}

export function ExperienceTimeline({ children }: ExperienceTimelineProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const isLineInView = useInView(lineRef);
  const hasGrown = useRef(false);

  const listRef = useEntranceAnimation<HTMLOListElement>({
    trigger: "inView",
    staggerDelay: 120,
  });

  useEffect(() => {
    const line = lineRef.current;
    if (!isLineInView || hasGrown.current || !line) return;
    hasGrown.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      line.style.transform = "scaleY(1)";
      return;
    }

    const styles = getComputedStyle(document.documentElement);
    const duration =
      parseFloat(styles.getPropertyValue("--motion-duration-slow")) || 400;
    const ease =
      styles.getPropertyValue("--motion-ease-standard").trim() ||
      "cubic-bezier(0.4, 0, 0.2, 1)";

    line.style.transform = "scaleY(0)";
    animate(line, {
      scaleY: [0, 1],
      duration: duration * 2,
      ease,
    });
  }, [isLineInView]);

  return (
    <div className="relative">
      <div
        ref={lineRef}
        aria-hidden="true"
        className="bg-border absolute start-1.5 top-0 bottom-0 w-px origin-top"
      />
      <ol ref={listRef} className="flex flex-col gap-0">
        {children}
      </ol>
    </div>
  );
}
