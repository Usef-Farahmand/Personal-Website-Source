"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

interface UseEntranceAnimationOptions {
  /** Stagger delay between each [data-animate] child, in ms. */
  staggerDelay?: number;
  /** Skip entirely (e.g. for content already handled by another effect). */
  disabled?: boolean;
}

/**
 * Reveals every [data-animate] descendant of the returned ref with a
 * staggered fade + rise on mount. Built for one-time entrance choreography
 * (a section's content appearing) — not for continuous/looping animation,
 * which belongs in CSS (see styles/tokens/motion.css's bounce-subtle for
 * that case).
 *
 * Consumes duration/easing/distance from the motion token system rather
 * than hardcoding values per call site, per DESIGN_SYSTEM.md's "every
 * animation must have a purpose, consistent timing across the site"
 * principle.
 *
 * Reduced motion: when the visitor prefers reduced motion, content is set
 * to its final visible state immediately with no animation — never left
 * invisible waiting on a skipped animation.
 */
export function useEntranceAnimation<T extends HTMLElement>({
  staggerDelay = 80,
  disabled = false,
}: UseEntranceAnimationOptions = {}) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>("[data-animate]");
    if (targets.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (disabled || prefersReducedMotion) {
      targets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const styles = getComputedStyle(document.documentElement);
    const distance = styles.getPropertyValue("--motion-distance-md") || "1rem";
    const duration =
      parseFloat(styles.getPropertyValue("--motion-duration-slow")) || 400;
    const ease =
      styles.getPropertyValue("--motion-ease-entrance").trim() ||
      "cubic-bezier(0, 0, 0.2, 1)";

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${distance.trim()})`;
    });

    const animation = animate(targets, {
      opacity: [0, 1],
      translateY: [distance.trim(), "0rem"],
      duration,
      delay: stagger(staggerDelay),
      ease,
    });

    return () => {
      animation.pause();
    };
  }, [staggerDelay, disabled]);

  return containerRef;
}
