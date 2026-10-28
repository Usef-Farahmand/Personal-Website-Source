"use client";

import { Children, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Shows one slide at a time and moves to the next on its own (no
 * scrolling) — the Projects page's featured strip. Slides cross-fade;
 * the timer pauses while the pointer is over the strip or focus is
 * inside it, and stops entirely for visitors who prefer reduced motion.
 * Dots jump to a slide. Every slide stays in the DOM (inactive ones are
 * inert and hidden from assistive tech), so server-rendered links and
 * images don't remount.
 */
export function AutoRotator({
  children,
  label,
  slideLabel,
  intervalMs = 6000,
}: {
  children: ReactNode;
  label: string;
  /** e.g. "Slide {index} of {total}" with those placeholders. */
  slideLabel: string;
  intervalMs?: number;
}) {
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setActive((i) => (i + 1) % slides.length),
      intervalMs
    );
    return () => window.clearTimeout(timer);
  }, [active, paused, slides.length, intervalMs]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="grid">
        {slides.map((slide, index) => (
          <div
            key={index}
            aria-hidden={index !== active}
            inert={index !== active}
            className={cn(
              "transition-opacity duration-700 ease-(--motion-ease-smooth) [grid-area:1/1] motion-reduce:transition-none",
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {slide}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={slideLabel
                .replace("{index}", String(index + 1))
                .replace("{total}", String(slides.length))}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === active
                  ? "bg-accent w-6"
                  : "bg-text-secondary/40 hover:bg-text-secondary w-2"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
