"use client";

import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

/**
 * Deliberately un-sectioned prose — no "What I Build" / "Why" / "What
 * Motivates Me" subheadings — per the explicit "not a biography, keep
 * concise" direction. Each paragraph in `paragraphs` still covers one of
 * those three threads (see the content data), but rendering them as one
 * quiet flowing story avoids the resume-like, multi-heading structure
 * the brief is steering away from.
 */
export function AboutStory({ paragraphs }: { paragraphs: string[] }) {
  const ref = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 90,
  });

  return (
    <div ref={ref} className="flex flex-col gap-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          data-animate
          className="text-body text-text-secondary"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
