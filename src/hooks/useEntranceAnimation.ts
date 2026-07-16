"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useInView } from "@/hooks/useInView";

interface UseEntranceAnimationOptions {
  /** Stagger delay between each [data-animate] child, in ms. */
  staggerDelay?: number;
  /** ms before the first child starts — for sequencing after another
   *  animation (e.g. an AnimatedText cascade) rather than starting
   *  immediately on mount. */
  startDelay?: number;
  /** "mount": animate as soon as rendered (above-the-fold content).
   *  "inView": wait until scrolled into view (below-the-fold sections). */
  trigger?: "mount" | "inView";
  /** Skip entirely (e.g. for content already handled by another effect). */
  disabled?: boolean;
}

/**
 * Reveals every [data-animate] descendant of the returned ref with a
 * staggered fade + rise, either on mount or when scrolled into view.
 * Built for one-time entrance choreography (a section's content
 * appearing) — not for continuous/looping animation, which belongs in
 * CSS (see styles/tokens/motion.css's bounce-subtle for that case).
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
  startDelay = 0,
  trigger = "mount",
  disabled = false,
}: UseEntranceAnimationOptions = {}) {
  const containerRef = useRef<T>(null);
  const isInView = useInView(containerRef);
  const shouldAnimate = trigger === "mount" || isInView;
  const hasRun = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!shouldAnimate || hasRun.current || !container) return;

    const targets = container.querySelectorAll<HTMLElement>("[data-animate]");
    if (targets.length === 0) return;

    hasRun.current = true;

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
      delay: stagger(staggerDelay, { start: startDelay }),
      ease,
    });

    return () => {
      animation.pause();
    };
  }, [shouldAnimate, staggerDelay, startDelay, disabled]);

  return containerRef;
}
