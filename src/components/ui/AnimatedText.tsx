"use client";

import { useEffect, useRef, type ElementType } from "react";
import { animate, stagger, splitText } from "animejs";
import { useInView } from "@/hooks/useInView";

interface AnimatedTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** "mount": animate as soon as rendered (above-the-fold content, e.g.
   *  Hero). "inView": wait until scrolled into view (below-the-fold
   *  content, e.g. About Preview). */
  trigger?: "mount" | "inView";
  /** ms between each word's start. Kept small — this reveals text, it
   *  doesn't perform it; a long sentence should still read naturally. */
  wordDelay?: number;
  /** ms before the first word starts, for sequencing multiple
   *  AnimatedText blocks in a cascade. */
  startDelay?: number;
}

/**
 * Reveals text word-by-word via a subtle fade + rise, using animejs's
 * native splitText (verified against its actual v4 API/source rather than
 * assumed) instead of hand-rolled span-splitting.
 *
 * Accessibility: splitText's `accessible: true` sets aria-hidden on each
 * split word span (so a screen reader doesn't announce word-by-word), but
 * it does not supply an accessible name for the whole phrase — this
 * component sets aria-label on the container with the original text so
 * the full sentence is still announced normally.
 *
 * Reduced motion: text renders as plain, fully visible content with no
 * split and no animation — the DOM is never mutated in that case.
 *
 * Interrupted-animation safety: if cleanup fires before the animation
 * completes, splitter.revert() restores plain, fully visible text rather
 * than leaving word spans stuck mid-fade. If this effect re-enters with
 * hasRun already true (word spans potentially still present from a prior
 * run whose cleanup didn't get a chance to revert them), any lingering
 * split spans are force-resolved to visible rather than silently
 * no-opping — content is never left invisible regardless of how or when
 * an interruption happens.
 *
 * Note: this component assumes `text` is stable for the component's
 * lifetime (true for our content-driven, per-locale-page architecture,
 * where content doesn't change without a full route change/remount). It
 * is not designed to re-split cleanly if `text` changes while mounted.
 */
export function AnimatedText({
  text,
  as: Component = "p",
  className,
  trigger = "mount",
  wordDelay = 25,
  startDelay = 0,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref);
  const shouldAnimate = trigger === "mount" || isInView;
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!shouldAnimate || !el) return;

    if (hasRun.current) {
      // Already played for this mounted instance. Guarantee visibility
      // in case any split word spans are still present and mid-fade
      // (covers the case where a prior cleanup didn't get to run).
      el.querySelectorAll<HTMLElement>("[aria-hidden]").forEach((span) => {
        span.style.opacity = "1";
        span.style.transform = "none";
      });
      return;
    }
    hasRun.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const splitter = splitText(el, { words: true, accessible: true });
    el.setAttribute("aria-label", text);

    const rootStyles = getComputedStyle(document.documentElement);
    const duration =
      parseFloat(rootStyles.getPropertyValue("--motion-duration-base")) || 250;
    const ease =
      rootStyles.getPropertyValue("--motion-ease-entrance").trim() ||
      "cubic-bezier(0, 0, 0.2, 1)";
    const distance =
      rootStyles.getPropertyValue("--motion-distance-sm").trim() || "0.5rem";

    const animation = animate(splitter.words, {
      opacity: [0, 1],
      translateY: [distance, "0rem"],
      duration,
      delay: stagger(wordDelay, { start: startDelay }),
      ease,
    });

    return () => {
      animation.pause();
      splitter.revert();
    };
  }, [shouldAnimate, text, wordDelay, startDelay]);

  return (
    <Component ref={ref} className={className}>
      {text}
    </Component>
  );
}
