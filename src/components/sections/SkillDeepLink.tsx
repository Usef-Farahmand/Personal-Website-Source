"use client";

import { useEffect } from "react";
import { animate } from "animejs";
import { motionEase } from "@/lib/motion";
/**
 * Deep-linked skill id from ?skill=<id> (see the Skills page, project
 * pages and SkillsPreview on the homepage): the matching card is scrolled
 * into view, focused, and given a brief highlight pulse. Renders nothing —
 * the cards themselves live in the page's FilterableListSection.
 */
export function SkillDeepLink({ activeSkillId }: { activeSkillId?: string }) {
  useEffect(() => {
    if (!activeSkillId) return;

    // A short buffer so this runs after the entrance stagger (up to
    // ~staggerDelay * card count) has settled — otherwise a deep-linked
    // card late in the stagger order gets its highlight pulse and its
    // fade-in animating at the same time, which reads as uncoordinated
    // rather than "smooth and natural".
    const timer = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(
        `[data-skill-id="${activeSkillId}"]`
      );
      if (!target) return;

      target.scrollIntoView({ behavior: "smooth", block: "center" });
      // preventScroll: scrollIntoView above already handles positioning —
      // without this, focus() triggers a second, competing scroll and the
      // two visibly fight each other.
      target.focus({ preventScroll: true });

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) {
        // Scroll + focus still happen — only the decorative pulse is
        // skipped. The focus-visible ring already on SkillCard is enough
        // of a static marker without added motion.
        return;
      }

      // Accent color (--orange-500 / #f97316) as literal RGB — box-shadow
      // keyframes need real alpha values, and Anime.js animates inline
      // styles directly rather than resolving Tailwind's color utilities.
      animate(target, {
        boxShadow: [
          "0 0 0 0 rgba(249, 115, 22, 0.45)",
          "0 0 0 10px rgba(249, 115, 22, 0)",
        ],
        duration: 1100,
        ease: motionEase("smooth"),
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [activeSkillId]);

  return null;
}
