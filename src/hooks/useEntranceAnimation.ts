"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useInView } from "@/hooks/useInView";
import {
  motionDistance,
  motionDuration,
  motionEase,
  prefersReducedMotion,
} from "@/lib/motion";

/** Longest time (ms) between the first and last item starting. */
const MAX_STAGGER_SPAN = 600;
/** Items start slightly shrunk and grow into place. */
const START_SCALE = 0.94;

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
 * staggered fade + rise + scale-up, either on mount or when scrolled
 * into view.
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
 *
 * Interrupted-animation safety: if this effect's cleanup fires before the
 * animation completes (component unmounted mid-animation, or — critically
 * — reused from Next.js's client Router Cache after a fast navigation
 * away and back), the cleanup force-resolves every target to its final
 * visible state, not just animation.pause(). Pausing alone can leave
 * elements stuck at whatever opacity/transform they were interrupted at;
 * this guarantees content is never left invisible regardless of how or
 * when the interruption happens. "hasRun" only prevents the entrance
 * animation from replaying — it never gates whether content is visible.
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
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>("[data-animate]");
    if (targets.length === 0) return;

    const skipMotion = disabled || prefersReducedMotion();

    // Not in view yet: hide the targets now, while they're still off
    // screen, so the reveal starts from nothing. Hiding them only once the
    // animation starts made them visibly blink out as they scrolled in.
    if (!shouldAnimate) {
      if (!hasRun.current && !skipMotion) {
        targets.forEach((el) => (el.style.opacity = "0"));
      }
      return;
    }

    const resolveVisible = () => {
      targets.forEach((el) => {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
        el.style.removeProperty("will-change");
      });
    };

    // Already played for this mounted instance — guarantee visible state
    // (covers the Router Cache reuse case) without replaying the reveal.
    if (hasRun.current) {
      resolveVisible();
      return;
    }
    hasRun.current = true;

    if (skipMotion) {
      resolveVisible();
      return;
    }

    const distance = motionDistance("lg", "2rem");
    const duration = motionDuration("reveal", 900);
    // Cap the whole cascade so a long grid doesn't trickle in for seconds:
    // past ~8 items the per-item step shrinks to fit the budget.
    const step = Math.min(
      staggerDelay,
      MAX_STAGGER_SPAN / Math.max(targets.length - 1, 1)
    );

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${distance}) scale(${START_SCALE})`;
      el.style.willChange = "transform, opacity";
    });

    // Opacity resolves early on a smooth curve; position and scale take
    // the full duration on a slightly overshooting curve, so each item
    // glides up, settles a hair past its spot, then eases back.
    const animation = animate(targets, {
      opacity: {
        from: 0,
        to: 1,
        duration: duration * 0.6,
        ease: motionEase("smooth"),
      },
      translateY: { from: distance, to: "0rem", ease: motionEase("spring") },
      scale: { from: START_SCALE, to: 1, ease: motionEase("smooth") },
      duration,
      delay: stagger(step, { start: startDelay }),
      onComplete: resolveVisible,
    });

    return () => {
      animation.pause();
      resolveVisible();
    };
  }, [shouldAnimate, staggerDelay, startDelay, disabled]);

  return containerRef;
}
